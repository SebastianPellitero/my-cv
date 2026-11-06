import "server-only"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { cache } from "react"
import {
    calendarIdSchema,
    LINK_TTL_SECONDS,
    parseStoredCalendar,
    parseStoredPick,
    type CalendarInput,
    type StoredCalendar,
    type StoredPick,
} from "./schema"
import { CALENDAR_TIMEZONE } from "./time"

const KEY_PREFIX = "calendar:"
// Outside the "calendar:*" scan, so picks never show up as links
const PICK_PREFIX = "calendar-pick:"

let client: Redis | undefined
let pickLimiter: Ratelimit | undefined

// Created on first use so `next build` doesn't need the env vars
export function getRedis(): Redis {
    client ??= Redis.fromEnv()
    return client
}

export async function createCalendar(input: CalendarInput, now = new Date()): Promise<StoredCalendar> {
    const calendar: StoredCalendar = {
        id: crypto.randomUUID(),
        title: input.title,
        note: input.note,
        timezone: CALENDAR_TIMEZONE,
        createdAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + LINK_TTL_SECONDS * 1000).toISOString(),
        slots: input.slots,
    }

    await getRedis().set(`${KEY_PREFIX}${calendar.id}`, calendar, { ex: LINK_TTL_SECONDS })
    return calendar
}

// Keeps the link's expiry, and returns false instead of bringing back a link that has gone
export async function updateCalendar(calendar: StoredCalendar, input: CalendarInput): Promise<boolean> {
    const saved = await getRedis().set(
        `${KEY_PREFIX}${calendar.id}`,
        { ...calendar, ...input },
        { exat: Math.floor(Date.parse(calendar.expiresAt) / 1000), xx: true }
    )

    return saved !== null
}

// Shared between generateMetadata and the page so one request makes one read
export const getCalendar = cache(async (id: string): Promise<StoredCalendar | null> => {
    if (!calendarIdSchema.safeParse(id).success) return null
    return parseStoredCalendar(await getRedis().get(`${KEY_PREFIX}${id}`))
})

export async function listCalendars(): Promise<StoredCalendar[]> {
    const redis = getRedis()
    const keys = new Set<string>()
    let cursor = "0"

    do {
        const [next, batch] = await redis.scan(cursor, { match: `${KEY_PREFIX}*`, count: 100 })
        batch.forEach((key) => keys.add(key))
        cursor = next
    } while (cursor !== "0")

    if (keys.size === 0) return []

    const records = await redis.mget<unknown[]>(...keys)
    return records
        .map(parseStoredCalendar)
        .filter((calendar) => calendar !== null)
        .sort((a, b) => a.expiresAt.localeCompare(b.expiresAt))
}

export async function deleteCalendar(id: string): Promise<void> {
    await getRedis().del(`${KEY_PREFIX}${id}`, `${PICK_PREFIX}${id}`)
}

export const getPick = cache(async (id: string): Promise<StoredPick | null> => {
    return parseStoredPick(await getRedis().get(`${PICK_PREFIX}${id}`))
})

export async function getPicks(ids: string[]): Promise<Map<string, StoredPick>> {
    if (ids.length === 0) return new Map()

    const records = await getRedis().mget<unknown[]>(...ids.map((id) => `${PICK_PREFIX}${id}`))
    const picks = new Map<string, StoredPick>()

    records.forEach((record, position) => {
        const pick = parseStoredPick(record)
        if (pick) picks.set(ids[position], pick)
    })

    return picks
}

// Saves the pick with the link's expiry and returns the one it replaced, in a single atomic step
export async function savePick(
    calendar: StoredCalendar,
    slotIndex: number,
    now = new Date()
): Promise<StoredPick | null> {
    const pick: StoredPick = { slotIndex, pickedAt: now.toISOString() }
    const previous = await getRedis().set(`${PICK_PREFIX}${calendar.id}`, pick, {
        exat: Math.floor(Date.parse(calendar.expiresAt) / 1000),
        get: true,
    })

    return parseStoredPick(previous)
}

export async function allowPick(id: string): Promise<boolean> {
    pickLimiter ??= new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(5, "1 h"),
        prefix: "ratelimit:calendar-pick",
    })

    const { success, reason } = await pickLimiter.limit(id)

    // Each pick can send an email, so a timeout doesn't count as allowed
    return success && reason !== "timeout"
}
