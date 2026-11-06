import { describe, expect, it } from "vitest"
import { formatVisitorTime, isSameTime } from "./VisitorTime"

const amsterdam = "Europe/Amsterdam"
// Tuesday 10 November, 10:00 in Amsterdam
const slot = "2026-11-10T09:00:00.000Z"

describe("isSameTime", () => {
    it("treats a different zone with the same clock as the same", () => {
        expect(isSameTime(slot, "Europe/Berlin", amsterdam)).toBe(true)
    })

    it("spots a different clock", () => {
        expect(isSameTime(slot, "Europe/London", amsterdam)).toBe(false)
    })
})

describe("formatVisitorTime", () => {
    it("shows only the time on the same day", () => {
        expect(formatVisitorTime(slot, "America/New_York", amsterdam)).toBe("04:00")
    })

    it("names the day only when it falls on another one", () => {
        expect(formatVisitorTime(slot, "Pacific/Auckland", amsterdam)).toBe("22:00")
        expect(formatVisitorTime("2026-11-10T19:00:00.000Z", "Pacific/Auckland", amsterdam)).toBe("Wed 08:00")
    })
})
