"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
    ADMIN_PATH,
    allowLoginAttempt,
    matchesAdminSecret,
    requireAdmin,
    startAdminSession,
} from "@/lib/admin-auth";
import {
    calendarIdSchema,
    parseCalendarEdit,
    parseCalendarInput,
    type FieldErrors,
} from "@/lib/calendar/schema";
import { createCalendar, deleteCalendar, getCalendar, updateCalendar } from "@/lib/calendar/store";
import { formatExpiry } from "@/lib/calendar/time";

export type LoginState = { error?: string };

export type CreateLinkState =
    | { status: "idle" }
    | { status: "error"; fieldErrors: FieldErrors }
    | { status: "success"; id: string; expiresLabel: string };

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
    try {
        if (!(await allowLoginAttempt())) {
            return { error: "Too many attempts. Try again in 15 minutes." };
        }
    } catch {
        return { error: "Sign-in is unavailable right now." };
    }

    const secret = formData.get("secret");
    if (typeof secret !== "string" || !matchesAdminSecret(secret)) {
        return { error: "That secret is not correct." };
    }

    await startAdminSession();
    redirect(ADMIN_PATH);
}

export async function createCalendarLink(_state: CreateLinkState, input: unknown): Promise<CreateLinkState> {
    await requireAdmin();

    const parsed = parseCalendarInput(input);
    if (!parsed.ok) return { status: "error", fieldErrors: parsed.fieldErrors };

    try {
        const calendar = await createCalendar(parsed.data);
        revalidatePath(ADMIN_PATH);
        return { status: "success", id: calendar.id, expiresLabel: formatExpiry(calendar.expiresAt) };
    } catch {
        return { status: "error", fieldErrors: { form: "The link couldn't be saved. Try again." } };
    }
}

export async function updateCalendarLink(
    id: unknown,
    _state: CreateLinkState,
    input: unknown
): Promise<CreateLinkState> {
    await requireAdmin();

    const gone: CreateLinkState = { status: "error", fieldErrors: { form: "This link has expired or was deleted." } };
    const parsedId = calendarIdSchema.safeParse(id);
    if (!parsedId.success) return gone;

    try {
        const calendar = await getCalendar(parsedId.data);
        if (!calendar) return gone;

        const parsed = parseCalendarEdit(input, calendar);
        if (!parsed.ok) return { status: "error", fieldErrors: parsed.fieldErrors };

        if (!(await updateCalendar(calendar, parsed.data))) return gone;
    } catch {
        return { status: "error", fieldErrors: { form: "The changes couldn't be saved. Try again." } };
    }

    revalidatePath(ADMIN_PATH);
    revalidatePath(`/calendar/${parsedId.data}`);
    redirect(ADMIN_PATH);
}

export async function deleteCalendarLink(id: unknown): Promise<void> {
    await requireAdmin();

    const parsed = calendarIdSchema.safeParse(id);
    if (!parsed.success) return;

    await deleteCalendar(parsed.data);
    revalidatePath(ADMIN_PATH);
}
