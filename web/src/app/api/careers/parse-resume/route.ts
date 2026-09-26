import { NextResponse } from "next/server";
import { getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { cmsForwardedIpHeaders } from "@/services/http/clientIp";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const PARSE_MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function POST(request: Request) {
  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid resume upload." }, { status: 400 });
  }

  const files = incoming.getAll("resume");
  if (files.length !== 1 || Array.from(incoming.keys()).some((key) => key !== "resume") || !(files[0] instanceof File)) {
    return NextResponse.json({ error: "Upload one resume file." }, { status: 400 });
  }

  const file = files[0];
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const expectedMime = PARSE_MIME_BY_EXTENSION[extension];
  const docxZipMime = extension === "docx" && ["application/zip", "application/x-zip-compressed"].includes(file.type);
  if (!expectedMime || (file.type && file.type !== expectedMime && !docxZipMime)) {
    return NextResponse.json({ error: "Autofill accepts PDF or DOCX files." }, { status: 415 });
  }
  if (!file.size || file.size > MAX_RESUME_BYTES) {
    return NextResponse.json({ error: "Resume must be 5 MB or smaller." }, { status: 413 });
  }

  const forward = new FormData();
  forward.append("resume", file.type === expectedMime || file.type === "application/zip"
    ? file
    : new File([file], file.name, { type: expectedMime }), file.name);

  try {
    const response = await fetch(`${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.careerResumeParse}`, {
      method: "POST",
      headers: { Accept: "application/json", ...cmsForwardedIpHeaders(request) },
      body: forward,
      cache: "no-store",
      signal: request.signal,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const error = typeof payload?.error?.message === "string"
        ? payload.error.message
        : "Resume autofill is unavailable. Please complete the form manually.";
      return NextResponse.json({ error }, { status: response.status });
    }
    if (!payload || typeof payload !== "object" || !payload.data || !payload.meta) {
      return NextResponse.json({ error: "Resume autofill returned an invalid response." }, { status: 502 });
    }
    return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: "Resume autofill is unavailable. Please complete the form manually." },
      { status: 502 },
    );
  }
}
