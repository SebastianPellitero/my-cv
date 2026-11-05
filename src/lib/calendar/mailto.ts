export function buildPickSlotMailto(email: string, slotLabel: string, timezone: string): string {
    const subject = `Interview slot: ${slotLabel} (${timezone})`
    const body = [
        "Hi Sebastian,",
        "",
        "I'd like to pick this slot for the interview:",
        "",
        `${slotLabel} (${timezone})`,
        "",
        "Thanks,",
    ].join("\r\n")

    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
