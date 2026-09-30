/**
 * Self-check for careers application date-of-birth (18+ legal age).
 * Keep logic aligned with careersApplicationForm.ts.
 * Run: npm run test:careers-dob
 */
import assert from "node:assert/strict";

const CAREERS_DOB_MIN_AGE_YEARS = 18;
const CAREERS_DOB_MAX_AGE_YEARS = 100;

function startOfLocalDay(date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function toDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseCareersDateValue(value) {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const parsed = new Date(`${trimmed}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return startOfLocalDay(parsed);
}

function hasReachedMinimumAge(birthDate, minimumAge, referenceDate = new Date()) {
  const referenceDay = startOfLocalDay(referenceDate);
  const birthDay = startOfLocalDay(birthDate);
  const milestone = new Date(birthDay);
  milestone.setFullYear(milestone.getFullYear() + minimumAge);
  return milestone.getTime() <= referenceDay.getTime();
}

function getLatestBirthDateForMinimumAge(minimumAge, referenceDate = new Date()) {
  const referenceDay = startOfLocalDay(referenceDate);
  const latest = new Date(referenceDay);
  latest.setFullYear(latest.getFullYear() - minimumAge);
  return latest;
}

function getCareersBirthDateBounds(referenceDate = new Date()) {
  const referenceDay = startOfLocalDay(referenceDate);
  const max = getLatestBirthDateForMinimumAge(CAREERS_DOB_MIN_AGE_YEARS, referenceDay);
  const min = new Date(referenceDay);
  min.setFullYear(min.getFullYear() - CAREERS_DOB_MAX_AGE_YEARS);
  return { minDate: toDateValue(min), maxDate: toDateValue(max) };
}

function getCareersDateOfBirthError(value, referenceDate = new Date()) {
  if (!value.trim()) return "Date of birth is required";
  const parsed = parseCareersDateValue(value);
  if (!parsed) return "Enter a valid date of birth";
  if (!hasReachedMinimumAge(parsed, CAREERS_DOB_MIN_AGE_YEARS, referenceDate)) {
    return `You must be at least ${CAREERS_DOB_MIN_AGE_YEARS} years old`;
  }
  const { minDate } = getCareersBirthDateBounds(referenceDate);
  const min = parseCareersDateValue(minDate);
  if (!min || parsed.getTime() < min.getTime()) return "Enter a valid date of birth";
  return undefined;
}

const referenceDate = new Date("2026-09-30T12:00:00");

const { minDate, maxDate } = getCareersBirthDateBounds(referenceDate);
assert.equal(maxDate, "2008-09-30");
assert.equal(minDate, "1926-09-30");

assert.equal(getCareersDateOfBirthError("", referenceDate), "Date of birth is required");
assert.equal(getCareersDateOfBirthError("2008-10-01", referenceDate), "You must be at least 18 years old");
assert.equal(getCareersDateOfBirthError("2008-09-30", referenceDate), undefined);
assert.equal(getCareersDateOfBirthError("1926-09-30", referenceDate), undefined);
assert.equal(getCareersDateOfBirthError("1925-09-30", referenceDate), "Enter a valid date of birth");

const under18 = parseCareersDateValue("2010-01-01");
assert.ok(under18);
assert.equal(hasReachedMinimumAge(under18, CAREERS_DOB_MIN_AGE_YEARS, referenceDate), false);

const exactly18 = parseCareersDateValue("2008-09-30");
assert.ok(exactly18);
assert.equal(hasReachedMinimumAge(exactly18, CAREERS_DOB_MIN_AGE_YEARS, referenceDate), true);

console.log("careers DOB bounds checks passed");
