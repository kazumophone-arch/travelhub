import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "travelhub_admin_session";

const SESSION_PAYLOAD = "travelhub-admin-v1";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export function isAdminPasswordConfigured() {
  return Boolean(getAdminPassword());
}

export function verifyAdminPassword(input: string) {
  const password = getAdminPassword();

  if (!password) {
    return false;
  }

  return safeEqual(input, password);
}

export function createAdminSessionValue() {
  const password = getAdminPassword();

  if (!password) {
    return "";
  }

  return `${SESSION_PAYLOAD}.${signSession(password)}`;
}

export function verifyAdminSession(value: string | undefined | null) {
  const password = getAdminPassword();

  if (!password || !value) {
    return false;
  }

  return safeEqual(value, createAdminSessionValue());
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

function getAdminPassword() {
  return String(process.env.ADMIN_PASSWORD ?? "").trim();
}

function signSession(password: string) {
  return crypto
    .createHmac("sha256", password)
    .update(SESSION_PAYLOAD)
    .digest("hex");
}

function safeEqual(first: string, second: string) {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(firstBuffer, secondBuffer);
}
