import "server-only"
import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { Ratelimit } from "@upstash/ratelimit"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { getRedis } from "@/lib/calendar/store"

export const ADMIN_PATH = "/admin/calendar"

const SESSION_COOKIE = "admin_session"
const SESSION_SECONDS = 12 * 60 * 60

let limiter: Ratelimit | undefined

// Hashing first gives timingSafeEqual equal-length input, so it can't throw or reveal length
function safeEqual(a: string, b: string): boolean {
    const digest = (value: string) => createHash("sha256").update(value).digest()
    return timingSafeEqual(digest(a), digest(b))
}

function sessionSignature(secret: string, expiresAt: number): string {
    const key = createHmac("sha256", secret).update("admin-session-key").digest()
    return createHmac("sha256", key).update(String(expiresAt)).digest("hex")
}

export function signSession(secret: string, expiresAt: number): string {
    return `${expiresAt}.${sessionSignature(secret, expiresAt)}`
}

export function verifySession(secret: string, token: string, now = Date.now()): boolean {
    const [expires, signature] = token.split(".")
    const expiresAt = Number(expires)
    if (!signature || !Number.isSafeInteger(expiresAt) || expiresAt <= now) return false
    return safeEqual(signature, sessionSignature(secret, expiresAt))
}

export function matchesAdminSecret(candidate: string): boolean {
    const secret = process.env.ADMIN_SECRET
    return Boolean(secret) && safeEqual(candidate, secret as string)
}

export async function allowLoginAttempt(): Promise<boolean> {
    limiter ??= new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(5, "15 m"),
        prefix: "ratelimit:admin-login",
    })

    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    const { success, reason } = await limiter.limit(ip)

    // The library passes requests through on timeout; sign-in should fail closed instead
    return success && reason !== "timeout"
}

export async function startAdminSession(): Promise<void> {
    const secret = process.env.ADMIN_SECRET
    if (!secret) throw new Error("ADMIN_SECRET is not set")

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, signSession(secret, Date.now() + SESSION_SECONDS * 1000), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/admin",
        maxAge: SESSION_SECONDS,
    })
}

export async function isAdmin(): Promise<boolean> {
    const secret = process.env.ADMIN_SECRET
    const token = (await cookies()).get(SESSION_COOKIE)?.value
    return Boolean(secret && token) && verifySession(secret as string, token as string)
}

// Server Actions are public endpoints, so each one calls this before doing anything
export async function requireAdmin(): Promise<void> {
    if (!(await isAdmin())) redirect(ADMIN_PATH)
}
