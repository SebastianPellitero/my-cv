"use client";
import { useEffect, useRef, useState } from "react";
import { secondaryButton } from "./styles";

type Props = {
    text: string;
    // Completes the button's accessible name, e.g. "link for Coolblue"
    label: string;
};

export default function CopyButton({ text, label }: Props) {
    const [message, setMessage] = useState("");
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    async function copy() {
        try {
            await navigator.clipboard.writeText(text);
            setMessage("Copied");
        } catch {
            setMessage("Copy failed, select the link instead");
        }
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setMessage(""), 4000);
    }

    return (
        <span className="inline-flex flex-wrap items-center gap-3">
            <button type="button" onClick={copy} className={secondaryButton}>
                Copy<span className="sr-only"> {label}</span>
            </button>
            {/* Stays mounted so screen readers announce changes to its text */}
            <span role="status" className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                {message}
            </span>
        </span>
    );
}
