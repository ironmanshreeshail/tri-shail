import type { D1Database, ExecutionContext } from "@cloudflare/workers-types";
import { validateEnquiry } from "./validation.ts";
export interface Env {
  DB: D1Database;
  ASSETS: { fetch(request: Request): Promise<Response> };
  RATE_LIMIT_SALT: string;
}
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, ...extra },
  });
}
async function digest(value: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return [...new Uint8Array(bytes)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
async function readBounded(request: Request) {
  const limit = 12_000;
  if (Number(request.headers.get("Content-Length")) > limit)
    throw new Error("too-large");
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.length;
    if (length > limit) {
      await reader.cancel();
      throw new Error("too-large");
    }
    chunks.push(value);
  }
  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(body);
}
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);
    if (url.pathname !== "/api/enquiries")
      return json({ error: "Not found." }, 404);
    if (request.method !== "POST")
      return json({ error: "Use the enquiry form to submit your goal." }, 405, {
        Allow: "POST",
      });
    if (request.headers.get("Origin") !== url.origin)
      return json(
        { error: "Please submit using the form on this website." },
        403,
      );
    if (!request.headers.get("Content-Type")?.startsWith("application/json"))
      return json({ error: "Please submit a valid enquiry." }, 415);
    let raw: unknown;
    try {
      raw = JSON.parse(await readBounded(request));
    } catch (error) {
      return json(
        {
          error:
            error instanceof Error && error.message === "too-large"
              ? "This enquiry is too large. Please shorten your message."
              : "Please check your enquiry and try again.",
        },
        error instanceof Error && error.message === "too-large" ? 413 : 400,
      );
    }
    const result = validateEnquiry(raw);
    if (!result.ok) return json({ error: result.error }, 400);
    if (!env.DB || !env.RATE_LIMIT_SALT)
      return json(
        {
          error:
            "The enquiry service is being connected. Please try again shortly.",
        },
        503,
      );
    const data = result.data;
    try {
      const payloadHash = await digest(JSON.stringify(data));
      const existing = await env.DB.prepare(
        "SELECT payload_hash FROM enquiries WHERE submission_id = ?",
      )
        .bind(data.submissionId)
        .first<{ payload_hash: string }>();
      if (existing)
        return existing.payload_hash === payloadHash
          ? json({ ok: true }, 200)
          : json(
              {
                error:
                  "This enquiry has already been submitted. Please start a new enquiry.",
              },
              409,
            );
      // Raw IP addresses are never stored. Rotating windows bound both abuse and stored counters.
      const window = Math.floor(Date.now() / 3_600_000);
      const ip = request.headers.get("CF-Connecting-IP") || "local";
      const rateKey = await digest(`${env.RATE_LIMIT_SALT}:${window}:${ip}`);
      const allowed = await env.DB.prepare(
        "INSERT INTO rate_limits (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < 5 RETURNING count",
      )
        .bind(rateKey, (window + 2) * 3_600_000)
        .first();
      if (!allowed)
        return json(
          {
            error:
              "You’ve sent several enquiries recently. Please try again in an hour.",
          },
          429,
          { "Retry-After": "3600" },
        );
      const now = new Date().toISOString();
      await env.DB.prepare(
        "INSERT INTO enquiries (id, submission_id, payload_hash, name, phone, email, goal, message, consent_at, consent_version, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(submission_id) DO NOTHING",
      )
        .bind(
          crypto.randomUUID(),
          data.submissionId,
          payloadHash,
          data.name,
          data.phone,
          data.email || null,
          data.goal || null,
          data.message || null,
          now,
          "2026-10-14",
          now,
        )
        .run();
      const saved = await env.DB.prepare(
        "SELECT payload_hash FROM enquiries WHERE submission_id = ?",
      )
        .bind(data.submissionId)
        .first<{ payload_hash: string }>();
      if (!saved) throw new Error("Persistence verification failed");
      if (saved.payload_hash !== payloadHash)
        return json(
          {
            error:
              "This enquiry has already been submitted. Please start a new enquiry.",
          },
          409,
        );
      ctx.waitUntil(
        env.DB.prepare("DELETE FROM rate_limits WHERE expires_at < ?")
          .bind(Date.now())
          .run()
          .catch(() => undefined),
      );
      return json({ ok: true }, 201);
    } catch {
      // Do not log request bodies, contact fields, or database exception details.
      console.error("Enquiry persistence failed");
      return json(
        {
          error:
            "We couldn’t save your enquiry right now. Your details are still in the form; please try again.",
        },
        503,
      );
    }
  },
};
