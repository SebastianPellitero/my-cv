import { buildSlotIcs } from "@/lib/calendar/ics"
import { getCalendar } from "@/lib/calendar/store"

export const dynamic = "force-dynamic"

type Context = {
    params: Promise<{ id: string; index: string }>
}

export async function GET(_request: Request, { params }: Context) {
    const { id, index } = await params
    const calendar = await getCalendar(id)
    const slot = calendar?.slots[Number(index)]

    if (!slot) return new Response("This link has expired", { status: 404 })

    const ics = buildSlotIcs({
        uid: `${id}-${index}@sebastianpellitero.dev`,
        summary: "Interview with Sebastian Pellitero",
        slot,
        stamp: new Date(),
    })

    return new Response(ics, {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": 'attachment; filename="interview-sebastian-pellitero.ics"',
            "Cache-Control": "no-store",
        },
    })
}
