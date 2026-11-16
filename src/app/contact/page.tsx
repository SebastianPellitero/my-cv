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
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
            <header className="mb-16 sm:mb-20">
                <div className="flex items-center gap-3 mb-6">
                    <span className="inline-block w-6 h-px bg-teal" />
                    <span className="text-xs tracking-[0.2em] uppercase font-mono text-teal-ink dark:text-teal">
                        Get in touch
                    </span>
                </div>
                <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl leading-[1.05] tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 mb-8">
                    Contact<em className="text-teal-ink dark:text-teal">.</em>
                </h1>
                <div className="w-12 h-0.5 bg-accent mb-8" />
                <p className="font-mono text-sm sm:text-base leading-relaxed max-w-xl text-zinc-600 dark:text-zinc-400">
                    Reach me by email, LinkedIn or GitHub.
                </p>
            </header>

            {/* Same hairline rows as the home page; each row is one link */}
            <ul className="border-b border-zinc-200 dark:border-zinc-800">
                {links.map((l) => (
                    <li key={l.label} className="border-t border-zinc-200 dark:border-zinc-800">
                        <a
                            href={l.href}
                            {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                            className="group grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline"
                        >
                            <span className="font-mono text-xs tracking-[0.15em] uppercase text-teal-ink dark:text-teal">
                                {l.label}
                            </span>
                            <span className="font-serif text-xl sm:text-3xl leading-tight break-words text-zinc-900 dark:text-zinc-100
                                             transition-[translate,color] duration-300 group-hover:translate-x-2 group-hover:text-teal-ink
                                             dark:group-hover:text-teal motion-reduce:group-hover:translate-x-0">
                                {l.value}
                            </span>
                            <span aria-hidden className="hidden font-mono text-sm text-teal-ink dark:text-teal sm:block">
                                {l.external ? "↗" : "→"}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
