import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry } from "../worker/validation.ts";
const valid = {
  name: "Example Athlete",
  phone: "+91 (98765) 43210",
  email: "athlete@example.test",
  goal: "First triathlon",
  message: "My first event",
  consent: true,
  submissionId: "d53e3f76-1a57-4897-8c52-cb16e85b45f3",
};
test("normalises contact details while preserving a valid enquiry", () => {
  const result = validateEnquiry({ ...valid, name: " Example Athlete " });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.phone, "+919876543210");
    assert.equal(result.data.name, "Example Athlete");
  }
});
test("rejects invalid phone, email, unrecognised goals, missing consent, spam, and invalid identifiers", () => {
  for (const change of [
    { phone: "abc" },
    { phone: "++919000000000" },
    { email: "broken" },
    { goal: "Unknown event" },
    { consent: false },
    { website: "https://spam.test" },
    { submissionId: "not-a-uuid" },
    { message: "x".repeat(2001) },
  ]) {
    assert.equal(validateEnquiry({ ...valid, ...change }).ok, false);
  }
});
test("optional fields can be omitted and malformed JSON shapes are rejected", () => {
  assert.equal(
    validateEnquiry({
      ...valid,
      email: undefined,
      goal: undefined,
      message: undefined,
    }).ok,
    true,
  );
  for (const value of [null, [], true, "hello"])
    assert.equal(validateEnquiry(value).ok, false);
});
