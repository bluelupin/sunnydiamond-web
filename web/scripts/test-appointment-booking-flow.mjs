/**
 * Live CMS probe: submit → list → reschedule → cancel
 * against Appointment Booking API Guide + FE expectations.
 *
 * Usage (from web/):
 *   node scripts/test-appointment-booking-flow.mjs
 *
 * Env:
 *   STRAPI_API_TOKEN or CMS_API_TOKEN (required)
 *   CMS_BASE_URL (optional, default sunnydiamonds-cms-dev)
 *   MAGENTO_CUSTOMER_ID (optional, default 98765)
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const BASE =
  (process.env.CMS_BASE_URL || "https://sunnydiamonds-cms-dev.on-forge.com").replace(
    /\/$/,
    "",
  );
const TOKEN = process.env.STRAPI_API_TOKEN || process.env.CMS_API_TOKEN || "";
const CUSTOMER_ID = Number(process.env.MAGENTO_CUSTOMER_ID || 98765);

const results = [];
const gaps = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
}

function noteGap(text) {
  gaps.push(text);
  console.log(`GAP   ${text}`);
}

function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function todayLocalIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function api(method, path, body) {
  const url = `${BASE}${path}`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: res.status, json, text };
}

async function getFormSlots(formTag) {
  const q =
    `/api/product-forms?filters[formTag][$eq]=${encodeURIComponent(formTag)}` +
    `&populate[availableTimeSlots]=true`;
  // Form schemas are public; CMS token often 403s on product-forms.
  const url = `${BASE}${q}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const json = await res.json().catch(() => null);
  const rows = Array.isArray(json?.data) ? json.data : [];
  const entity = rows[0] || null;
  const slots = (entity?.availableTimeSlots || [])
    .map((s) => (typeof s?.timeString === "string" ? s.timeString.trim() : ""))
    .filter(Boolean);
  return { status: res.status, formTag: entity?.formTag || formTag, slots };
}

async function submitAppointment({ formTag, productId, productName, requestedDate, slot, withAddress }) {
  const data = {
    magentoCustomerId: CUSTOMER_ID,
    formTag,
    productId,
    productName,
    customerName: "API Flow Tester",
    customerPhone: "9876543210",
    customerEmail: "flow-test@example.com",
    requestedDate,
    selectedTimeSlot: slot,
    consentAccepted: true,
  };
  if (withAddress) {
    Object.assign(data, {
      addressLine1: "House 10",
      addressLine2: "Near City Centre",
      city: "Kochi",
      pincode: "682001",
    });
  }
  return api("POST", "/api/product-submissions/submit", { data });
}

async function listAppointments() {
  return api(
    "GET",
    `/api/customer/appointments?magentoCustomerId=${CUSTOMER_ID}&page=1&pageSize=50`,
  );
}

async function reschedule(documentId, requestedDate, selectedTimeSlot) {
  return api("POST", `/api/customer/appointments/${documentId}/reschedule`, {
    data: { magentoCustomerId: CUSTOMER_ID, requestedDate, selectedTimeSlot },
  });
}

async function cancel(documentId) {
  return api("POST", `/api/customer/appointments/${documentId}/cancel`, {
    data: { magentoCustomerId: CUSTOMER_ID },
  });
}

function findInList(listJson, documentId) {
  const rows = Array.isArray(listJson?.data) ? listJson.data : [];
  return rows.find((r) => r.documentId === documentId) || null;
}

async function main() {
  console.log(`CMS: ${BASE}`);
  console.log(`Customer: ${CUSTOMER_ID}`);
  console.log("");

  if (!TOKEN) {
    fail("env", "Missing STRAPI_API_TOKEN / CMS_API_TOKEN");
    process.exit(1);
  }

  // --- Form schemas / slots ---
  const tryHome = await getFormSlots("try-at-home-form");
  const video = await getFormSlots("product-video-call");

  if (tryHome.status === 200 && tryHome.slots.length) {
    pass("fetch try-at-home-form slots", tryHome.slots.join(", "));
  } else {
    fail("fetch try-at-home-form slots", `status=${tryHome.status} slots=${tryHome.slots.length}`);
  }

  if (video.status === 200 && video.slots.length) {
    pass("fetch product-video-call slots", video.slots.join(", "));
  } else {
    fail("fetch product-video-call slots", `status=${video.status} slots=${video.slots.length}`);
    noteGap("product-video-call form/slots not available — video flow skipped");
  }

  const trySlot = tryHome.slots[0] || "10:00 AM - 11:00 AM";
  const trySlotAlt = tryHome.slots[1] || tryHome.slots[0] || "2:00 PM - 3:00 PM";
  const videoSlot = video.slots[0] || trySlot;

  const today = todayLocalIso();
  // Outside FE/BE 3-day window for reschedule (appointment within <3 days)
  const nearDate = addDays(today, 1);
  // Inside window (>= 3 days away)
  const farDate = addDays(today, 7);
  const farDateAlt = addDays(today, 8);

  // --- Submit try-at-home (far, for successful reschedule) ---
  const submitFar = await submitAppointment({
    formTag: "try-at-home-form",
    productId: "flow-test-ring-1",
    productName: "Flow Test Ring Far",
    requestedDate: farDate,
    slot: trySlot,
    withAddress: true,
  });

  const farDocId = submitFar.json?.data?.documentId;
  const farGroupId = submitFar.json?.data?.appointmentGroupId;
  if (submitFar.status === 200 && farDocId) {
    pass(
      "submit try-at-home (far date)",
      `documentId=${farDocId} group=${farGroupId ?? "null"}`,
    );
    if (!farGroupId) {
      noteGap("try-at-home submit response missing appointmentGroupId (guide expects it for home trials)");
    }
  } else {
    fail(
      "submit try-at-home (far date)",
      `status=${submitFar.status} ${submitFar.json?.error?.message || submitFar.text}`,
    );
  }

  // --- Clubbing: second product same date/slot ---
  const submitClub = await submitAppointment({
    formTag: "try-at-home-form",
    productId: "flow-test-pendant-1",
    productName: "Flow Test Pendant Club",
    requestedDate: farDate,
    slot: trySlot,
    withAddress: true,
  });
  const clubDocId = submitClub.json?.data?.documentId;
  const clubGroupId = submitClub.json?.data?.appointmentGroupId;
  if (submitClub.status === 200 && clubDocId) {
    pass("submit try-at-home clubbed product", `documentId=${clubDocId} group=${clubGroupId}`);
    if (farGroupId && clubGroupId && farGroupId === clubGroupId) {
      pass("clubbing group id shared", clubGroupId);
    } else if (farGroupId && clubGroupId && farGroupId !== clubGroupId) {
      noteGap(
        `clubbing: second same-slot submit got different appointmentGroupId (${farGroupId} vs ${clubGroupId})`,
      );
    }
  } else {
    fail(
      "submit try-at-home clubbed product",
      `status=${submitClub.status} ${submitClub.json?.error?.message || ""}`,
    );
  }

  // --- Submit try-at-home near date (for outside reschedule window) ---
  const submitNear = await submitAppointment({
    formTag: "try-at-home-form",
    productId: "flow-test-ring-near",
    productName: "Flow Test Ring Near",
    requestedDate: nearDate,
    slot: trySlot,
    withAddress: true,
  });
  const nearDocId = submitNear.json?.data?.documentId;
  if (submitNear.status === 200 && nearDocId) {
    pass("submit try-at-home (near date <3d)", `documentId=${nearDocId} date=${nearDate}`);
  } else {
    fail(
      "submit try-at-home (near date <3d)",
      `status=${submitNear.status} ${submitNear.json?.error?.message || ""}`,
    );
  }

  // --- Video call submit ---
  let videoDocId = null;
  if (video.slots.length) {
    const submitVideo = await submitAppointment({
      formTag: "product-video-call",
      productId: "flow-test-video-1",
      productName: "Flow Test Video Product",
      requestedDate: farDate,
      slot: videoSlot,
      withAddress: false,
    });
    videoDocId = submitVideo.json?.data?.documentId ?? null;
    const videoGroup = submitVideo.json?.data?.appointmentGroupId;
    if (submitVideo.status === 200 && videoDocId) {
      pass("submit product-video-call", `documentId=${videoDocId}`);
      if (videoGroup) {
        noteGap(
          `video call returned appointmentGroupId=${videoGroup} (guide: video calls stay individual / no group)`,
        );
      } else {
        pass("video call has no appointmentGroupId", "as expected");
      }
    } else {
      fail(
        "submit product-video-call",
        `status=${submitVideo.status} ${submitVideo.json?.error?.message || submitVideo.text}`,
      );
    }
  }

  // --- List ---
  const list1 = await listAppointments();
  if (list1.status === 200 && Array.isArray(list1.json?.data)) {
    pass("list appointments", `count=${list1.json.data.length}`);
    const sample = list1.json.data[0];
    if (sample && !Array.isArray(sample.products)) {
      noteGap("list item missing products[] array (guide requires products for card UI)");
    } else if (sample?.products) {
      pass("list includes products[]", `first card products=${sample.products.length}`);
    }
    // Clubbed far appointment should be one card with 2 products ideally
    const farRow =
      findInList(list1.json, farDocId) ||
      list1.json.data.find((r) => r.appointmentGroupId && r.appointmentGroupId === farGroupId);
    if (farRow) {
      const productCount = Array.isArray(farRow.products) ? farRow.products.length : 0;
      if (productCount >= 2) {
        pass("list clubbed card has multiple products", `products=${productCount}`);
      } else {
        noteGap(
          `list clubbing: expected >=2 products on group card, got ${productCount} (may still be separate rows)`,
        );
      }
      if (farRow.documentId && farDocId && farRow.documentId !== farDocId && farRow.documentId !== clubDocId) {
        // top-level id may be either product — fine per guide as long as stable
        pass("list top-level documentId present", farRow.documentId);
      }
    }
  } else {
    fail("list appointments", `status=${list1.status} ${list1.json?.error?.message || ""}`);
  }

  // --- Reschedule inside window (far) ---
  if (farDocId) {
    const okReschedule = await reschedule(farDocId, farDateAlt, trySlotAlt);
    if (okReschedule.status === 200 && okReschedule.json?.data) {
      pass(
        "reschedule inside 3-day window",
        `changed=${okReschedule.json?.meta?.changed} date=${okReschedule.json?.data?.requestedDate}`,
      );
      if (Array.isArray(okReschedule.json?.data?.affectedProductDocumentIds)) {
        pass(
          "reschedule returns affectedProductDocumentIds",
          String(okReschedule.json.data.affectedProductDocumentIds.length),
        );
      }
    } else {
      fail(
        "reschedule inside 3-day window",
        `status=${okReschedule.status} ${okReschedule.json?.error?.message || ""}`,
      );
    }

    // same date/slot → changed:false
    const noop = await reschedule(
      farDocId,
      okReschedule.json?.data?.requestedDate || farDateAlt,
      okReschedule.json?.data?.selectedTimeSlot || trySlotAlt,
    );
    if (noop.status === 200 && noop.json?.meta?.changed === false) {
      pass("reschedule same slot returns changed:false");
    } else if (noop.status === 200) {
      noteGap(`reschedule same slot expected meta.changed=false, got ${JSON.stringify(noop.json?.meta)}`);
    } else {
      fail("reschedule same slot", `status=${noop.status} ${noop.json?.error?.message || ""}`);
    }
  }

  // --- Reschedule outside window (near) ---
  if (nearDocId) {
    const bad = await reschedule(nearDocId, farDateAlt, trySlotAlt);
    const msg = bad.json?.error?.message || "";
    if (bad.status === 400 && /3-day|window|reschedul/i.test(msg)) {
      pass("reschedule outside window rejected", msg);
    } else {
      fail(
        "reschedule outside window rejected",
        `status=${bad.status} msg=${msg || bad.text}`,
      );
      if (bad.status !== 400) {
        noteGap("backend did not return 400 for outside reschedule window");
      }
    }
  }

  // --- Cancel inside window (far / after reschedule) ---
  if (farDocId) {
    const cancelFar = await cancel(farDocId);
    if (
      cancelFar.status === 200 &&
      (cancelFar.json?.data?.workflowStatus === "Cancelled" ||
        cancelFar.json?.meta?.changed === true)
    ) {
      pass(
        "cancel inside window",
        `status=${cancelFar.json?.data?.workflowStatus} changed=${cancelFar.json?.meta?.changed}`,
      );
    } else {
      fail(
        "cancel inside window",
        `status=${cancelFar.status} ${cancelFar.json?.error?.message || cancelFar.text}`,
      );
    }

    const cancelAgain = await cancel(farDocId);
    if (cancelAgain.status === 200 && cancelAgain.json?.meta?.changed === false) {
      pass("cancel already-cancelled returns changed:false");
    } else if (cancelAgain.status === 200) {
      noteGap(
        `re-cancel expected meta.changed=false, got ${JSON.stringify(cancelAgain.json?.meta)}`,
      );
    } else {
      fail("re-cancel", `status=${cancelAgain.status} ${cancelAgain.json?.error?.message || ""}`);
    }

    const rescheduleCancelled = await reschedule(farDocId, farDate, trySlot);
    const cMsg = rescheduleCancelled.json?.error?.message || "";
    if (rescheduleCancelled.status === 400 && /cancel|closed|complete/i.test(cMsg)) {
      pass("reschedule cancelled appointment rejected", cMsg);
    } else {
      fail(
        "reschedule cancelled appointment rejected",
        `status=${rescheduleCancelled.status} msg=${cMsg}`,
      );
    }
  }

  // --- Cancel near (still should succeed if T-1 not reached; appointment is tomorrow) ---
  if (nearDocId) {
    const cancelNear = await cancel(nearDocId);
    if (cancelNear.status === 200 && cancelNear.json?.data?.workflowStatus === "Cancelled") {
      pass("cancel near-date appointment (still before T-1)", nearDate);
    } else if (cancelNear.status === 400 && /cancel|window|minute/i.test(cancelNear.json?.error?.message || "")) {
      pass("cancel rejected by window", cancelNear.json.error.message);
    } else {
      fail(
        "cancel near-date appointment",
        `status=${cancelNear.status} ${cancelNear.json?.error?.message || ""}`,
      );
    }
  }

  // --- Cancel video ---
  if (videoDocId) {
    const cancelVideo = await cancel(videoDocId);
    if (cancelVideo.status === 200) {
      pass("cancel video call", `changed=${cancelVideo.json?.meta?.changed}`);
    } else {
      fail(
        "cancel video call",
        `status=${cancelVideo.status} ${cancelVideo.json?.error?.message || ""}`,
      );
    }
  }

  // --- Auth: missing token ---
  const noAuth = await fetch(`${BASE}/api/customer/appointments?magentoCustomerId=${CUSTOMER_ID}`, {
    headers: { Accept: "application/json" },
  });
  if (noAuth.status === 401 || noAuth.status === 403) {
    pass("list without CMS token rejected", `status=${noAuth.status}`);
  } else {
    noteGap(`list without CMS token returned ${noAuth.status} (expected 401/403)`);
  }

  // --- Listing flags for FE disable ---
  const list2 = await listAppointments();
  const anyFlags = (list2.json?.data || []).some(
    (row) =>
      Object.prototype.hasOwnProperty.call(row, "canReschedule") ||
      Object.prototype.hasOwnProperty.call(row, "canCancel"),
  );
  if (!anyFlags) {
    noteGap(
      "list API has no canReschedule/canCancel flags — FE must keep local window logic or rely on error toasts",
    );
  } else {
    pass("list exposes canReschedule/canCancel flags");
  }

  console.log("\n========== SUMMARY ==========");
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`PASS: ${passed}  FAIL: ${failed}  GAPS: ${gaps.length}`);
  if (gaps.length) {
    console.log("\nGaps noticed:");
    for (const g of gaps) console.log(` - ${g}`);
  }
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
