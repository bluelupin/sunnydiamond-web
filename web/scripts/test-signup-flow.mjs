#!/usr/bin/env node

/**
 * End-to-end signup flow test (phone OTP → create account).
 *
 * Mirrors the /login UI flow:
 *   1. POST /api/auth/otp/request
 *   2. POST /api/auth/otp/verify  (expects registrationRequired: true for new numbers)
 *   3. POST /api/auth/otp/verify  (with name + email to create the account)
 *   4. GET  /api/auth/me          (confirms session cookie)
 *
 * Usage:
 *   node scripts/test-signup-flow.mjs
 *   SIGNUP_TEST_PHONE=9876543210 SIGNUP_TEST_OTP=123456 node scripts/test-signup-flow.mjs
 *   node scripts/test-signup-flow.mjs --base-url http://localhost:3000 --phone 9876543210 --otp 123456
 *   node scripts/test-signup-flow.mjs --smoke   # validation-only, no OTP needed
 */

const DEFAULT_BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function parseArgs(argv) {
  const options = {
    baseUrl: process.env.BASE_URL || DEFAULT_BASE_URL,
    phone: process.env.SIGNUP_TEST_PHONE || "",
    otp: process.env.SIGNUP_TEST_OTP || "",
    smoke: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--smoke") {
      options.smoke = true;
      continue;
    }

    if (arg === "--base-url") {
      options.baseUrl = argv[index + 1] ?? options.baseUrl;
      index += 1;
      continue;
    }

    if (arg === "--phone") {
      options.phone = argv[index + 1] ?? options.phone;
      index += 1;
      continue;
    }

    if (arg === "--otp") {
      options.otp = argv[index + 1] ?? options.otp;
      index += 1;
    }
  }

  return options;
}

function printHelp() {
  console.log(`Signup flow test

Options:
  --base-url <url>   Next.js app URL (default: ${DEFAULT_BASE_URL})
  --phone <digits>   10-digit Indian mobile number (env: SIGNUP_TEST_PHONE)
  --otp <code>       6-digit OTP received via SMS (env: SIGNUP_TEST_OTP)
  --smoke            Run API validation checks only (no OTP required)
  -h, --help         Show this help

Examples:
  node scripts/test-signup-flow.mjs --smoke
  SIGNUP_TEST_PHONE=9876543210 SIGNUP_TEST_OTP=123456 node scripts/test-signup-flow.mjs
`);
}

function log(step, payload) {
  console.log(`\n=== ${step} ===`);
  console.log(JSON.stringify(payload, null, 2));
}

function randomPhone() {
  const suffix = String(Date.now()).slice(-9);
  return `9${suffix}`;
}

function randomEmail() {
  return `signup.test.${Date.now()}@sunnydiamond.com`;
}

async function api(baseUrl, path, { method = "GET", body, cookieJar } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (cookieJar?.length) {
    headers.Cookie = cookieJar.join("; ");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "manual",
  });

  const setCookie = response.headers.getSetCookie?.() ?? [];
  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  return {
    status: response.status,
    ok: response.ok,
    data,
    cookies: setCookie,
  };
}

function mergeCookies(cookieJar, newCookies) {
  const jar = new Map();

  for (const cookie of cookieJar) {
    const [pair] = cookie.split(";");
    const [name, value] = pair.split("=");
    jar.set(name.trim(), value);
  }

  for (const cookie of newCookies) {
    const [pair] = cookie.split(";");
    const [name, value] = pair.split("=");
    jar.set(name.trim(), value);
  }

  return [...jar.entries()].map(([name, value]) => `${name}=${value}`);
}

async function runSmokeTests(baseUrl) {
  log("Smoke 1. Missing phone", { expect: "400" });
  const missingPhone = await api(baseUrl, "/api/auth/otp/request", {
    method: "POST",
    body: {},
  });
  if (missingPhone.status !== 400) {
    throw new Error(`Expected 400 for missing phone, got ${missingPhone.status}`);
  }
  log("Smoke 1. Result", missingPhone.data);

  log("Smoke 2. Missing OTP", { expect: "400" });
  const missingOtp = await api(baseUrl, "/api/auth/otp/verify", {
    method: "POST",
    body: { phone: "9876543210" },
  });
  if (missingOtp.status !== 400) {
    throw new Error(`Expected 400 for missing OTP, got ${missingOtp.status}`);
  }
  log("Smoke 2. Result", missingOtp.data);

  log("Smoke 3. Login page reachable", { url: `${baseUrl}/login` });
  const loginPage = await fetch(`${baseUrl}/login`);
  if (!loginPage.ok) {
    throw new Error(`Login page returned HTTP ${loginPage.status}`);
  }
  log("Smoke 3. Result", { status: loginPage.status, ok: true });

  console.log("\n✅ Signup flow smoke tests passed");
}

async function runSignupFlow({ baseUrl, phone, otp }) {
  const cookieJar = [];
  const email = randomEmail();
  const fullName = "Signup Test User";

  log("1. Request OTP", { phone, baseUrl });
  const otpRequest = await api(baseUrl, "/api/auth/otp/request", {
    method: "POST",
    body: { phone },
    cookieJar,
  });

  if (!otpRequest.ok || !otpRequest.data?.ok) {
    throw new Error(
      otpRequest.data?.error ||
        `OTP request failed with HTTP ${otpRequest.status}`,
    );
  }

  log("1. OTP sent", {
    resendAfterSeconds: otpRequest.data.resendAfterSeconds,
  });

  log("2. Verify OTP (new user check)", { phone, otp: "******" });
  const verifyNewUser = await api(baseUrl, "/api/auth/otp/verify", {
    method: "POST",
    body: { phone, otp },
    cookieJar,
  });

  if (!verifyNewUser.ok || !verifyNewUser.data?.ok) {
    throw new Error(
      verifyNewUser.data?.error ||
        `OTP verification failed with HTTP ${verifyNewUser.status}`,
    );
  }

  if (!verifyNewUser.data.registrationRequired) {
    log("2. Existing user", {
      message:
        "Phone is already registered; signup path skipped. Logging in instead.",
    });
  } else {
    log("2. Registration required", { registrationRequired: true });

    log("3. Create account", { phone, email, fullName });
    const createAccount = await api(baseUrl, "/api/auth/otp/verify", {
      method: "POST",
      body: {
        phone,
        otp,
        email,
        firstName: "Signup",
        lastName: "Test User",
      },
      cookieJar,
    });

    if (!createAccount.ok || !createAccount.data?.ok) {
      throw new Error(
        createAccount.data?.error ||
          `Account creation failed with HTTP ${createAccount.status}`,
      );
    }

    if (createAccount.data.registrationRequired) {
      throw new Error("Account creation still requires registration");
    }

    log("3. Account created", {
      customerCreated: createAccount.data.customerCreated ?? false,
    });
  }

  const nextCookies = mergeCookies(cookieJar, [
    ...otpRequest.cookies,
    ...verifyNewUser.cookies,
  ]);

  log("4. Session check", { path: "/api/auth/me" });
  const me = await api(baseUrl, "/api/auth/me", { cookieJar: nextCookies });

  if (!me.ok || !me.data?.customer) {
    throw new Error("Expected authenticated customer from /api/auth/me");
  }

  log("4. Authenticated customer", me.data.customer);

  console.log("\n✅ Signup flow test completed successfully");
  console.log(`Logged in as ${me.data.customer.email}`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  if (options.smoke) {
    await runSmokeTests(options.baseUrl);
    return;
  }

  const phone = (options.phone || randomPhone()).replace(/\D/g, "");
  const otp = options.otp.replace(/\D/g, "");

  if (!/^\d{10}$/.test(phone)) {
    throw new Error("Phone must be 10 digits (set --phone or SIGNUP_TEST_PHONE)");
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new Error(
      "OTP must be 6 digits (set --otp or SIGNUP_TEST_OTP). Request OTP first, then re-run with the SMS code.",
    );
  }

  await runSignupFlow({ baseUrl: options.baseUrl.replace(/\/$/, ""), phone, otp });
}

main().catch((error) => {
  console.error("\n❌ Signup flow test failed");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
