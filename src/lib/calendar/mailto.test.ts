import { describe, expect, it } from "vitest"
import { buildPickSlotMailto } from "./mailto"

describe("buildPickSlotMailto", () => {
    it("names the slot and timezone in an encoded subject and body", () => {
        const url = new URL(
            buildPickSlotMailto("me@example.com", "Tuesday 10 November, 10:00 to 11:00", "Europe/Amsterdam")
        )

        expect(url.protocol).toBe("mailto:")
        expect(url.pathname).toBe("me@example.com")
        expect(url.searchParams.get("subject")).toBe(
            "Interview slot: Tuesday 10 November, 10:00 to 11:00 (Europe/Amsterdam)"
        )
        expect(url.searchParams.get("body")).toContain("Tuesday 10 November, 10:00 to 11:00 (Europe/Amsterdam)")
    })
})
