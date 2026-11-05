"use client";
import { useActionState } from "react";
import { login } from "@/app/admin/calendar/actions";
import { errorText, field, fieldLabel, primaryButton } from "./styles";

export default function LoginForm() {
    const [state, action, pending] = useActionState(login, {});

    return (
        <form action={action} className="grid gap-4">
            <div>
                <label htmlFor="admin-secret" className={fieldLabel}>
                    Admin secret
                </label>
                <input
                    id="admin-secret"
                    name="secret"
                    type="password"
                    autoComplete="current-password"
                    required
                    aria-invalid={state.error ? true : undefined}
                    aria-describedby={state.error ? "admin-secret-error" : undefined}
                    className={field}
                />
            </div>
            <div role="alert">
                {state.error && (
                    <p id="admin-secret-error" className={errorText}>
                        Error: {state.error}
                    </p>
                )}
            </div>
            <button type="submit" disabled={pending} className={primaryButton}>
                {pending ? "Signing in" : "Sign in"}
            </button>
        </form>
    );
}
