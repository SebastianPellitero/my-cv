import { beforeEach, describe, expect, it, vi } from "vitest"
import { getCalendar } from "@/lib/calendar/store"
import type { StoredCalendar } from "@/lib/calendar/schema"
import { GET } from "./route"

vi.mock("@/lib/calendar/store", () => ({ getCalendar: vi.fn() }))

const id = "3f2b8c1e-7a4d-4e6f-9b1a-2c3d4e5f6a7b"

const calendar: StoredCalendar = {
    id,
    title: "Availability",
    timezone: "Europe/Amsterdam",
    createdAt: "2026-11-05T12:00:00.000Z",
    expiresAt: "2026-11-19T12:00:00.000Z",
    slots: [{ start: "2026-11-10T09:00:00.000Z", end: "2026-11-10T10:00:00.000Z" }],
}

const request = (index: string) =>
    GET(new Request("https://example.com"), { params: Promise.resolve({ id, index }) })

describe("GET /calendar/[id]/slot/[index]", () => {
    beforeEach(() => vi.mocked(getCalendar).mockReset())

    it("returns 404 once the key has expired", async () => {
        vi.mocked(getCalendar).mockResolvedValue(null)
        const response = await request("0")
        expect(response.status).toBe(404)
        expect(await response.text()).not.toContain("BEGIN:VCALENDAR")
    })

    it("returns 404 for a slot that doesn't exist", async () => {
        vi.mocked(getCalendar).mockResolvedValue(calendar)
        expect((await request("5")).status).toBe(404)
        expect((await request("abc")).status).toBe(404)
    })

    it("downloads the slot as an uncached calendar file", async () => {
        vi.mocked(getCalendar).mockResolvedValue(calendar)
        const response = await request("0")

        expect(response.status).toBe(200)
        expect(response.headers.get("Content-Type")).toBe("text/calendar; charset=utf-8")
        expect(response.headers.get("Content-Disposition")).toContain("attachment")
        expect(response.headers.get("Cache-Control")).toBe("no-store")
        expect(await response.text()).toContain("DTSTART:20261110T090000Z")
    })
})
