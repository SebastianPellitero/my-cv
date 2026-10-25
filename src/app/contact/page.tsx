import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Sebastian Pellitero by email, LinkedIn or GitHub.",
};

const links = [
    { label: "Email", value: "sebastian.pellitero@gmail.com", href: "mailto:sebastian.pellitero@gmail.com", external: false },
    { label: "LinkedIn", value: "in/sebastian-pellitero", href: "https://www.linkedin.com/in/sebastian-pellitero/", external: true },
    { label: "GitHub", value: "SebastianPellitero", href: "https://github.com/SebastianPellitero", external: true },
];

export default function Contact() {
    return (
        <div className="mx-auto max-w-5xl px-6 py-16">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block w-6 h-px bg-teal" />
                    <span className="text-xs tracking-[0.2em] uppercase font-mono text-teal-ink dark:text-teal">
                        Get in touch
                    </span>
                </div>
                <h1 className="font-serif text-5xl sm:text-6xl leading-[1.05] tracking-[-0.02em] text-zinc-900 dark:text-zinc-100">
                    Contact<em className="text-teal-ink dark:text-teal">.</em>
                </h1>
            </header>

            <ul className="grid gap-4 sm:grid-cols-3">
                {links.map((l) => (
                    <li key={l.label}>
                        <a
                            href={l.href}
                            {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                            className="block h-full rounded-2xl border p-6
                                border-zinc-200 bg-white hover:border-teal
                                dark:border-zinc-800 dark:bg-zinc-900/40 transition-colors duration-300"
                        >
                            <span className="block font-mono text-xs tracking-[0.15em] uppercase text-teal-ink dark:text-teal mb-2">
                                {l.label}
                            </span>
                            <span className="block font-mono text-sm break-all text-zinc-700 dark:text-zinc-300">
                                {l.value}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
