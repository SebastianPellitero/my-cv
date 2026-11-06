import "server-only"

const RESEND_URL = "https://api.resend.com/emails"
const DEFAULT_SENDER = "Availability <onboarding@resend.dev>"

export async function sendOwnerEmail({ subject, text }: { subject: string; text: string }): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY
    const to = process.env.CONTACT_EMAIL
    if (!apiKey || !to) throw new Error("RESEND_API_KEY or CONTACT_EMAIL is not set")

    const res = await fetch(RESEND_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: process.env.RESEND_FROM ?? DEFAULT_SENDER, to, subject, text }),
    })

    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`)
}
