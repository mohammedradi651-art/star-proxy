
import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SERVICES = new Set([
  "yem",
  "offeryem",
  "post",
  "why",
  "mtn",
  "mtnoffer",
  "sabaphone",
  "sabaoffer",
  "sbay",
  "sabaunits",
  "sabagomla",
  "mtngomla",
  "mobilegomla",
  "adenet",
  "yem4g",
  "electwater",
  "gameswcards",
  "info",
]);

const RESERVED = new Set([
  "userid",
  "username",
  "password",
  "domainname",
  "token",
]);

function md5(value: string) {
  return createHash("md5").update(value, "utf8").digest("hex");
}

function fail(message: string, status: number) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.STAR_PROXY_API_KEY;
    const suppliedKey = request.headers
      .get("authorization")
      ?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!apiKey || suppliedKey !== apiKey) {
      return fail("Unauthorized", 401);
    }

    const base = process.env.PROVIDER_BASE_URL;
    const userId = process.env.PROVIDER_USERID;
    const username = process.env.PROVIDER_USERNAME;
    const password = process.env.PROVIDER_PASSWORD;

    if (!base || !userId || !username || !password) {
      return fail("Provider configuration is incomplete", 500);
    }

    const baseUrl = new URL(base);

    if (baseUrl.protocol !== "https:") {
      return fail("Provider URL must use HTTPS", 500);
    }

    const body = await request.json();
    const { service, params, method = "GET" } = body ?? {};

    if (
      typeof service !== "string" ||
      !SERVICES.has(service) ||
      !params ||
      typeof params !== "object" ||
      Array.isArray(params)
    ) {
      return fail("Invalid service or parameters", 400);
    }

    if (method !== "GET" && method !== "POST") {
      return fail("Only GET and POST are supported", 400);
    }

    const values = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (
        !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(key) ||
        RESERVED.has(key.toLowerCase()) ||
        (typeof value !== "string" &&
          typeof value !== "number") ||
        !Number.isFinite(
          typeof value === "number" ? value : 0
        )
      ) {
        return fail(`Invalid parameter: ${key}`, 400);
      }

      values.set(key, String(value));
    }

    const transid = values.get("transid");
    const mobile = values.get("mobile");

    if (
      !transid ||
      transid.length > 100 ||
      !mobile ||
      !/^\d+$/.test(mobile) ||
      mobile.length < 2 ||
      mobile.length > 15
    ) {
      return fail("A valid transid and mobile are required", 400);
    }

    // The transaction ID must be unique for every operation.
    const token = md5(
      md5(password) + transid + username + mobile
    );

    values.set("userid", userId);
    values.set("transid", transid);
    values.set("mobile", mobile);
    values.set("token", token);

    // The upstream hostname is fixed by server configuration.
    const upstreamUrl = new URL(
      service,
      baseUrl.href.endsWith("/")
        ? baseUrl.href
        : `${baseUrl.href}/`
    );

    if (upstreamUrl.origin !== baseUrl.origin) {
      return fail("Invalid upstream destination", 400);
    }

    const options: RequestInit = {
      method,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(20000),
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    };

    if (method === "GET") {
      upstreamUrl.search = values.toString();
    } else {
      options.headers = {
        ...options.headers,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      options.body = values.toString();
    }

    const upstream = await fetch(upstreamUrl, options);
    const result = await upstream.text();

    return new Response(result, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ??
          "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Star Proxy error:", error);

    return fail("Upstream request failed or timed out", 502);
  }
}