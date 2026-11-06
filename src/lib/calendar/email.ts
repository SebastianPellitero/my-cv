type PickEmail = {
    title: string
    note?: string
    slotLabel: string
    timezone: string
    previousSlotLabel?: string
}

export function buildPickEmail({ title, note, slotLabel, timezone, previousSlotLabel }: PickEmail) {
    const context = note ? `Link: ${title}\nNote: ${note}` : `Link: ${title}`

    if (!previousSlotLabel) {
        return { subject: `Slot picked: ${title}`, text: `Picked: ${slotLabel} (${timezone})\n\n${context}` }
    }

    return {
        subject: `Slot changed: ${title}`,
        text: `New: ${slotLabel} (${timezone})\nWas: ${previousSlotLabel}\n\n${context}`,
    }
}
