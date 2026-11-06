import { beforeEach, describe, expect, it, vi } from "vitest"
import { sendOwnerEmail } from "@/lib/calendar/notify"
import type { StoredCalendar } from "@/lib/calendar/schema"
import { allowPick, getCalendar, savePick } from "@/lib/calendar/store"
import { pickSlot } from "./actions"

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@/lib/calendar/notify", () => ({ sendOwnerEmail: vi.fn() }))
vi.mock("@/lib/calendar/store", () => ({
    allowPick: vi.fn(),
    getCalendar: vi.fn(),
    savePick: vi.fn(),
}))

const id = "3f2b8c1e-7a4d-4e6f-9b1a-2c3d4e5f6a7b"

const calendar: StoredCalendar = {
    id,
    title: "Availability for Coolblue",
    note: "Second round with the team lead",
    timezone: "Europe/Amsterdam",
    createdAt: "2026-11-05T12:00:00.000Z",
    expiresAt: "2026-11-19T12:00:00.000Z",
    slots: [
        { start: "2026-11-10T09:00:00.000Z", end: "2026-11-10T10:00:00.000Z" },
        { start: "2026-11-11T13:00:00.000Z", end: "2026-11-11T14:00:00.000Z" },
    ],
}

const previousPick = (slotIndex: number) => ({ slotIndex, pickedAt: "2026-11-06T12:00:00.000Z" })

describe("pickSlot", () => {
    beforeEach(() => {
        vi.resetAllMocks()
        vi.mocked(getCalendar).mockResolvedValue(calendar)
        vi.mocked(allowPick).mockResolvedValue(true)
        vi.mocked(savePick).mockResolvedValue(null)
        vi.mocked(sendOwnerEmail).mockResolvedValue()
    })

    it("saves a first pick and sends one email", async () => {
        expect(await pickSlot(id, 0)).toEqual({ status: "ok" })

        expect(savePick).toHaveBeenCalledWith(calendar, 0)
        expect(sendOwnerEmail).toHaveBeenCalledExactlyOnceWith({
            subject: "Slot picked: Availability for Coolblue",
            text: "Picked: Tuesday 10 November, 10:00 to 11:00 (Europe/Amsterdam)\n\nLink: Availability for Coolblue\nNote: Second round with the team lead",
        })
    })

    it("names the old and new slot when the pick changes", async () => {
        vi.mocked(savePick).mockResolvedValue(previousPick(0))

        await pickSlot(id, 1)

        expect(sendOwnerEmail).toHaveBeenCalledExactlyOnceWith({
            subject: "Slot changed: Availability for Coolblue",
            text: "New: Wednesday 11 November, 14:00 to 15:00 (Europe/Amsterdam)\nWas: Tuesday 10 November, 10:00 to 11:00\n\nLink: Availability for Coolblue\nNote: Second round with the team lead",
        })
    })

    it("sends nothing when the same slot is picked again", async () => {
        vi.mocked(savePick).mockResolvedValue(previousPick(1))

        expect(await pickSlot(id, 1)).toEqual({ status: "ok" })
        expect(sendOwnerEmail).not.toHaveBeenCalled()
    })

    it("keeps the pick when the email fails", async () => {
        const log = vi.spyOn(console, "error").mockImplementation(() => {})
        vi.mocked(sendOwnerEmail).mockRejectedValue(new Error("Resend responded 500"))

        expect(await pickSlot(id, 0)).toEqual({ status: "ok" })
        expect(savePick).toHaveBeenCalled()
        expect(log).toHaveBeenCalled()
    })

    it("reports an expired link without saving", async () => {
        vi.mocked(getCalendar).mockResolvedValue(null)

        expect(await pickSlot(id, 0)).toEqual({ status: "expired" })
        expect(savePick).not.toHaveBeenCalled()
    })

    it("stops at the rate limit without saving or emailing", async () => {
        vi.mocked(allowPick).mockResolvedValue(false)

        expect(await pickSlot(id, 0)).toEqual({ status: "limited" })
        expect(savePick).not.toHaveBeenCalled()
        expect(sendOwnerEmail).not.toHaveBeenCalled()
    })

    it("rejects a malformed id or a slot that doesn't exist", async () => {
        expect(await pickSlot("nope", 0)).toEqual({ status: "error" })
        expect(await pickSlot(id, -1)).toEqual({ status: "error" })
        expect(await pickSlot(id, "0")).toEqual({ status: "error" })
        expect(await pickSlot(id, 99)).toEqual({ status: "error" })
        expect(savePick).not.toHaveBeenCalled()
    })

    it("reports an error when Redis fails", async () => {
        vi.mocked(savePick).mockRejectedValue(new Error("offline"))

        expect(await pickSlot(id, 0)).toEqual({ status: "error" })
        expect(sendOwnerEmail).not.toHaveBeenCalled()
    })
})
