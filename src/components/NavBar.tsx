"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const active = usePathname()?.startsWith(href);
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className="font-mono text-xs tracking-[0.12em] uppercase
               inline-flex items-center min-h-10 px-2 sm:px-3
               text-zinc-600 hover:text-teal-ink
               dark:text-zinc-400 dark:hover:text-teal
               aria-[current=page]:text-teal-ink dark:aria-[current=page]:text-teal
               transition-colors duration-200"
        >
            {children}
        </Link>
    );
};

export default function NavBar() {
    return (
        <header className="sticky top-0 z-50
                       border-b border-zinc-200 bg-white/80 backdrop-blur
                       dark:border-zinc-800/60 dark:bg-zinc-950/70">
            <nav aria-label="Main" className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">

                {/* Logo */}
                <Link
                    href="/"
                    aria-label="Sebastian Pellitero — home"
                    className="font-serif text-base tracking-[-0.01em]
                     inline-flex items-center min-h-10 min-w-10
                     text-zinc-900 hover:text-teal-ink
                     dark:text-zinc-100 dark:hover:text-teal
                     transition-colors duration-200"
                >
                    SP
                </Link>

                {/* Nav links */}
                <div className="flex items-center gap-1">
                    <NavLink href="/about">Experience</NavLink>
                    <NavLink href="/projects">Projects</NavLink>
                    <a
                        href="mailto:sebastian.pellitero@gmail.com"
                        className="font-mono text-xs tracking-[0.12em] uppercase
                       inline-flex items-center min-h-10 ml-1 sm:ml-2 px-3 sm:px-4 rounded-sm
                       border border-teal-ink text-teal-ink hover:bg-teal-ink hover:text-white
                       dark:border-teal dark:text-teal dark:hover:bg-teal dark:hover:text-zinc-900
                       transition-colors duration-200"
                    >
                        Email me
                    </a>
                </div>

            </nav>

            {/* Teal accent line at bottom */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-teal/30 to-transparent" />
        </header>
    );
}
