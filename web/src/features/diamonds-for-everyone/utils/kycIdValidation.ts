export type KycIdType = "Aadhaar" | "PAN" | (string & {});

export type KycIdValidationMessages = {
  aadhaarError: string;
  aadhaarDigitsOnlyError: string;
  aadhaarLengthError: string;
  panError: string;
};

export function normalizeAadhaarDigits(value: string): string {
  return value.replace(/\s|-/g, "");
}

export function normalizePan(value: string): string {
  return value.trim().toUpperCase().replace(/\s/g, "");
}

/** Format checks only; UIDAI checksum / API validation belongs on the server. */
export function isValidAadhaar(value: string): boolean {
  const digits = normalizeAadhaarDigits(value);
  if (!/^\d{12}$/.test(digits)) {
    return false;
  }
  if (/^[01]/.test(digits)) {
    return false;
  }
  if (/^(\d)\1{11}$/.test(digits)) {
    return false;
  }

  return true;
}

export function isValidPan(value: string): boolean {
  const pan = normalizePan(value);
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
}

export function sanitizeKycIdNumberInput(idType: KycIdType, value: string): string {
  if (idType === "Aadhaar") {
    return value.replace(/\D/g, "").slice(0, 12);
  }

  if (idType === "PAN") {
    return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
  }

  return value;
}

export function getKycIdNumberValidationError(
  idType: KycIdType,
  value: string,
  messages: KycIdValidationMessages,
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "ID number is required";
  }

  if (idType === "Aadhaar") {
    const digits = normalizeAadhaarDigits(trimmed);
    if (digits.length === 0) {
      return "ID number is required";
    }
    if (!/^\d+$/.test(digits)) {
      return messages.aadhaarDigitsOnlyError;
    }
    if (digits.length !== 12) {
      return messages.aadhaarLengthError;
    }
    if (!isValidAadhaar(trimmed)) {
      return messages.aadhaarError;
    }
    return undefined;
  }

  if (idType === "PAN") {
    if (!isValidPan(trimmed)) {
      return messages.panError;
    }
    return undefined;
  }

  return undefined;
}
