import { afterEach, describe, expect, it, vi } from "vitest"
import { matchesAdminSecret, signSession, verifySession } from "./admin-auth"

vi.mock("server-only", () => ({}))
vi.mock("@/lib/calendar/store", () => ({ getRedis: vi.fn() }))

const NOW = 1_800_000_000_000

describe("session cookie", () => {
    it("accepts a token it signed", () => {
        expect(verifySession("secret", signSession("secret", NOW + 1000), NOW)).toBe(true)
    })

    it("rejects an expired token", () => {
        expect(verifySession("secret", signSession("secret", NOW), NOW)).toBe(false)
    })

    it("rejects a token signed with another secret", () => {
        expect(verifySession("secret", signSession("other", NOW + 1000), NOW)).toBe(false)
    })

    it("rejects a token whose expiry was extended", () => {
        const [, signature] = signSession("secret", NOW + 1000).split(".")
        expect(verifySession("secret", `${NOW + 9999}.${signature}`, NOW)).toBe(false)
    })

    it("rejects malformed tokens", () => {
        expect(verifySession("secret", "", NOW)).toBe(false)
        expect(verifySession("secret", "not-a-token", NOW)).toBe(false)
        expect(verifySession("secret", "abc.def", NOW)).toBe(false)
    })
})

describe("matchesAdminSecret", () => {
    afterEach(() => vi.unstubAllEnvs())

    it("compares against ADMIN_SECRET, whatever the input length", () => {
        vi.stubEnv("ADMIN_SECRET", "correct horse")
        expect(matchesAdminSecret("correct horse")).toBe(true)
        expect(matchesAdminSecret("wrong")).toBe(false)
    })

    it("never matches when ADMIN_SECRET is unset", () => {
        vi.stubEnv("ADMIN_SECRET", "")
        expect(matchesAdminSecret("")).toBe(false)
    })
})
