import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import type { D1Database, ExecutionContext } from "@cloudflare/workers-types";
import worker, { type Env } from "../worker/index.ts";

function setup() {
  const sqlite = new DatabaseSync(":memory:");
  sqlite.exec(
    readFileSync(
      new URL("../migrations/0001_enquiries.sql", import.meta.url),
      "utf8",
    ),
  );
  const db = {
    prepare(sql: string) {
      let values: unknown[] = [];
      return {
        bind(...args: unknown[]) {
          values = args;
          return this;
        },
        async first() {
          return (
            sqlite
              .prepare(sql)
              .get(...(values as (string | number | null)[])) || null
          );
        },
        async run() {
          return sqlite
            .prepare(sql)
            .run(...(values as (string | number | null)[]));
        },
      };
    },
  } as unknown as D1Database;
  const env: Env = {
    DB: db,
    ASSETS: {
      async fetch() {
        return new Response("Static website");
      },
    },
    RATE_LIMIT_SALT: "test-only-secret",
  };
  const ctx = {
    waitUntil(p: Promise<unknown>) {
      void p.catch(() => {});
    },
  } as ExecutionContext;
  const data = {
    name: "Test Athlete",
    phone: "+919000000000",
    email: "athlete@example.test",
    goal: "Full Ironman",
    message: "Test fixture",
    consent: true,
    submissionId: crypto.randomUUID(),
  };
  const request = (body: unknown = data, origin = "https://tri-shail.test") =>
    new Request("https://tri-shail.test/api/enquiries", {
      method: "POST",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        "CF-Connecting-IP": "192.0.2.1",
      },
      body: JSON.stringify(body),
    });
  return { sqlite, env, ctx, data, request };
}
test("stores an enquiry once and accepts an identical retry without consuming another rate-limit slot", async () => {
  const s = setup();
  assert.equal((await worker.fetch(s.request(), s.env, s.ctx)).status, 201);
  assert.equal((await worker.fetch(s.request(), s.env, s.ctx)).status, 200);
  assert.equal(
    s.sqlite.prepare("SELECT COUNT(*) AS n FROM enquiries").get()?.n,
    1,
  );
  assert.equal(
    s.sqlite.prepare("SELECT count FROM rate_limits").get()?.count,
    1,
  );
  const conflict = await worker.fetch(
    s.request({ ...s.data, message: "Changed payload" }),
    s.env,
    s.ctx,
  );
  assert.equal(conflict.status, 409);
});
test("concurrent retries result in one persistent enquiry", async () => {
  const s = setup();
  const responses = await Promise.all(
    Array.from({ length: 3 }, () => worker.fetch(s.request(), s.env, s.ctx)),
  );
  assert.ok(responses.every((r) => r.ok));
  assert.equal(
    s.sqlite.prepare("SELECT COUNT(*) AS n FROM enquiries").get()?.n,
    1,
  );
});
test("rejects invalid input and foreign origins without saving a record", async () => {
  const s = setup();
  assert.equal(
    (await worker.fetch(s.request({ ...s.data, consent: false }), s.env, s.ctx))
      .status,
    400,
  );
  assert.equal(
    (
      await worker.fetch(
        s.request(s.data, "https://foreign.test"),
        s.env,
        s.ctx,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await worker.fetch(
        s.request({ ...s.data, message: "x".repeat(13000) }),
        s.env,
        s.ctx,
      )
    ).status,
    413,
  );
  assert.equal(
    s.sqlite.prepare("SELECT COUNT(*) AS n FROM enquiries").get()?.n,
    0,
  );
});
test("enforces a durable rate limit and exposes no public read endpoint", async () => {
  const s = setup();
  for (let i = 0; i < 5; i++)
    assert.equal(
      (
        await worker.fetch(
          s.request({ ...s.data, submissionId: crypto.randomUUID() }),
          s.env,
          s.ctx,
        )
      ).status,
      201,
    );
  const limited = await worker.fetch(
    s.request({ ...s.data, submissionId: crypto.randomUUID() }),
    s.env,
    s.ctx,
  );
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("Retry-After"), "3600");
  assert.equal(
    (
      await worker.fetch(
        new Request("https://tri-shail.test/api/enquiries"),
        s.env,
        s.ctx,
      )
    ).status,
    405,
  );
});
test("returns a recoverable failure when persistence fails, while static pages still work", async () => {
  const s = setup();
  s.env.DB = {
    prepare() {
      throw new Error("Synthetic database failure");
    },
  } as unknown as D1Database;
  assert.equal((await worker.fetch(s.request(), s.env, s.ctx)).status, 503);
  const response = await worker.fetch(
    new Request("https://tri-shail.test/privacy/"),
    s.env,
    s.ctx,
  );
  assert.equal(await response.text(), "Static website");
});
