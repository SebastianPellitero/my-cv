import Link from "next/link";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
        href={href}
        className="font-['DM_Mono',monospace] text-[0.7rem] tracking-[0.12em] uppercase
               text-zinc-500 hover:text-teal
               dark:text-zinc-400 dark:hover:text-teal
               transition-colors duration-200 px-3 py-2"
    >
        {children}
    </Link>
);

export default function NavBar() {
    return (
        <header className="sticky top-0 z-50
                       border-b border-zinc-200 bg-white/80 backdrop-blur
                       dark:border-zinc-800/60 dark:bg-zinc-950/70">
            <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">

                {/* Logo */}
                <Link
                    href="/"
                    className="font-['DM_Serif_Display',serif] text-base tracking-[-0.01em]
                     text-zinc-900 hover:text-teal
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
                        href="https://www.linkedin.com/in/sebastian-pellitero/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-['DM_Mono',monospace] text-[0.7rem] tracking-[0.12em] uppercase
                       ml-2 px-4 py-1.5 rounded-sm
                       border border-teal text-teal
                       hover:bg-teal hover:text-zinc-900
                       transition-colors duration-200"
                    >
                        Hire me
                    </a>
                </div>

            </nav>

            {/* Teal accent line at bottom */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-teal/30 to-transparent" />
        </header>
    );
}