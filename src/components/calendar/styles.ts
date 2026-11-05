// The outline in globals.css is unlayered and beats normal utilities, so these need `!` to apply
export const focusRing = "focus-visible:outline-teal-ink! dark:focus-visible:outline-teal!";

const buttonBase = `inline-flex items-center justify-center min-h-10 px-4 rounded-sm
    font-mono text-xs tracking-[0.12em] uppercase
    transition-colors duration-200 motion-reduce:transition-none disabled:opacity-60 ${focusRing}`;

export const primaryButton = `${buttonBase} bg-teal-ink text-white hover:bg-teal-ink/85
    dark:bg-teal dark:text-zinc-950 dark:hover:bg-teal/85`;

export const secondaryButton = `${buttonBase} border border-teal-ink text-teal-ink
    hover:bg-teal-ink hover:text-white
    dark:border-teal dark:text-teal dark:hover:bg-teal dark:hover:text-zinc-900`;

export const inlineLink = `border-b pb-0.5 text-teal-ink border-teal-ink hover:opacity-60
    dark:text-teal dark:border-teal transition-opacity motion-reduce:transition-none ${focusRing}`;

export const field = `block w-full min-h-10 px-3 py-2 rounded-sm border border-zinc-500
    bg-white text-zinc-900 font-mono text-sm
    dark:bg-zinc-900 dark:text-zinc-100 dark:[color-scheme:dark] ${focusRing}`;

export const fieldLabel = "block mb-1 font-mono text-xs tracking-[0.1em] uppercase text-zinc-600 dark:text-zinc-400";

export const errorText = "font-mono text-xs text-red-700 dark:text-red-400";

export const card = "rounded-2xl border p-6 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/40";
