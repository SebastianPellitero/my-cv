import Link from "next/link";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
        href={href}
        className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900
               dark:text-zinc-200 dark:hover:bg-zinc-900 dark:hover:text-white"
    >
        {children}
    </Link>
);

export default function NavBar() {
    return (
        <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/70 backdrop-blur
                       dark:border-zinc-800 dark:bg-zinc-950/60">
            <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                <Link
                    href="/"
                    className="font-orbitron text-base font-semibold tracking-wide text-zinc-900 hover:opacity-90
                     dark:text-zinc-100"
                >
                    Sebastian Pellitero
                </Link>

                {/* <div className="hidden items-center gap-1 md:flex">
                    <NavLink href="/about">About</NavLink>
                    <NavLink href="/projects">Projects</NavLink>
                    <NavLink href="/contact">Contact</NavLink>

                    <span className="mx-2 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

                    <Link
                        href="/cv"
                        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800
                       dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                    >
                        CV
                    </Link>
                </div> */}

                {/* <Link
                    href="/cv"
                    className="md:hidden rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800
                     dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
                >
                    CV
                </Link> */}
            </nav>
        </header>
    );
}
