import "server-only"
import { Redis } from "@upstash/redis"
import { cache } from "react"
import {
    calendarIdSchema,
    LINK_TTL_SECONDS,
    parseStoredCalendar,
    type CalendarInput,
    type StoredCalendar,
} from "./schema"
import { CALENDAR_TIMEZONE } from "./time"

const KEY_PREFIX = "calendar:"

let client: Redis | undefined

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
    await getRedis().del(`${KEY_PREFIX}${id}`)
}
