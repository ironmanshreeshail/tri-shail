export const goals = [
  "First triathlon",
  "Ironman 70.3",
  "Full Ironman",
  "Half marathon / marathon",
  "Exploring my options",
];
export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  goal: string;
  message: string;
  submissionId: string;
  consent: true;
};
export function validateEnquiry(
  value: unknown,
): { ok: true; data: Enquiry } | { ok: false; error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return { ok: false, error: "Please check your enquiry details." };
  const raw = value as Record<string, unknown>;
  const text = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  if (text("website"))
    return { ok: false, error: "We could not accept this submission." };
  const name = text("name"),
    phone = text("phone"),
    email = text("email"),
    goal = text("goal"),
    message = text("message"),
    submissionId = text("submissionId");
  if (name.length < 2 || name.length > 100)
    return { ok: false, error: "Please enter your name (2–100 characters)." };
  if (
    !/^\+?[\d\s().-]+$/.test(phone) ||
    phone.length > 30 ||
    phone.replace(/\D/g, "").length < 7 ||
    phone.replace(/\D/g, "").length > 15
  )
    return {
      ok: false,
      error: "Please enter a valid phone number, including your country code.",
    };
  if (
    email &&
    (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  )
    return { ok: false, error: "Please check your email address." };
  if (goal && !goals.includes(goal))
    return { ok: false, error: "Please choose a goal from the list." };
  if (message.length > 2000)
    return {
      ok: false,
      error: "Please keep your message under 2,000 characters.",
    };
  if (raw.consent !== true)
    return {
      ok: false,
      error: "Please agree to be contacted about your enquiry.",
    };
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      submissionId,
    )
  )
    return { ok: false, error: "Please refresh the page and try again." };
  return {
    ok: true,
    data: {
      name,
      phone: phone.replace(/[\s().-]/g, ""),
      email,
      goal,
      message,
      submissionId,
      consent: true,
    },
  };
}
