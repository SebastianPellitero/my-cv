import { getPinnedRepos, getPublicRepos, type Repo } from "@/lib/github"

export const metadata = {
    title: "Projects",
    description: "Open-source work and side projects by Sebastian Pellitero.",
}

function LanguageDot({ color, name }: { color: string; name: string }) {
    return (
        <span className="flex items-center gap-1.5">
            <span
                aria-hidden
                className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
            />
            <span className="font-mono text-xs tracking-[0.08em] text-zinc-600 dark:text-zinc-400">
                {name}
            </span>
        </span>
    )
}

function StarForkCount({ stars, forks }: { stars: number; forks: number }) {
    return (
        <div className="flex items-center gap-3">
            {stars > 0 && (
                <span className="flex items-center gap-1 font-mono text-xs text-teal-ink dark:text-teal">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                    </svg>
                    {stars}
                    <span className="sr-only">stars</span>
                </span>
            )}
            {forks > 0 && (
                <span className="flex items-center gap-1 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                    </svg>
                    {forks}
                    <span className="sr-only">forks</span>
                </span>
            )}
        </div>
    )
}

function RepoCard({ repo, featured = false }: { repo: Repo; featured?: boolean }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border flex flex-col
            border-zinc-200 bg-white
            dark:border-zinc-800 dark:bg-zinc-900/40
            hover:border-teal/50 focus-within:border-teal-ink dark:focus-within:border-teal transition-colors duration-300 group
            ${featured ? "p-6" : "p-5"}`}
        >
            {/* Hover glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 [background:radial-gradient(300px_circle_at_50%_0%,rgba(45,212,191,0.06),transparent_70%)]" />

            <div className="flex flex-col flex-1 gap-3">
                {/* Name + links */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-serif leading-tight text-zinc-900 dark:text-zinc-100 ${featured ? "text-lg" : "text-base"}`}>
                        {/* after: overlay makes the whole card open the repo */}
                        <a
                            href={repo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="after:absolute after:inset-0 group-hover:text-teal-ink dark:group-hover:text-teal transition-colors"
                        >
                            {repo.name}
                        </a>
                    </h3>
                    {repo.homepageUrl && (
                        <a
                            href={repo.homepageUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${repo.name} live demo`}
                            className="relative z-10 -m-2 p-2 flex-shrink-0 text-zinc-500 hover:text-teal-ink dark:text-zinc-400 dark:hover:text-teal transition-colors duration-200"
                        >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                                <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z" />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Description */}
                {repo.description && (
                    <p className="font-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 flex-1">
                        {repo.description}
                    </p>
                )}

                {/* Topics (featured only) */}
                {featured && repo.topics.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                        {repo.topics.slice(0, 5).map((t) => (
                            <li
                                key={t}
                                className="font-mono text-xs tracking-[0.08em] uppercase px-2 py-0.5 border rounded-sm border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
                            >
                                {t}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Language + stars/forks */}
                <div className="flex items-center justify-between mt-auto pt-1">
                    {repo.primaryLanguage ? (
                        <LanguageDot color={repo.primaryLanguage.color} name={repo.primaryLanguage.name} />
                    ) : (
                        <span />
                    )}
                    <StarForkCount stars={repo.stargazerCount} forks={repo.forkCount} />
                </div>
            </div>
        </div>
    )
}

export default async function ProjectsPage() {
    const pinned = await getPinnedRepos()
    // No token / API error → fall back to public, non-fork repos, most-starred first
    const repos = pinned.length > 0
        ? pinned
        : (await getPublicRepos()).sort((a, b) => b.stargazerCount - a.stargazerCount).slice(0, 6)

    return (
        <div className="mx-auto max-w-5xl px-6 py-16">

            {/* ── Hero ── */}
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block w-6 h-px bg-teal" />
                    <span className="text-xs tracking-[0.2em] uppercase font-mono text-teal-ink dark:text-teal">
                        Open source &amp; side projects
                    </span>
                </div>
                <h1 className="font-serif text-5xl sm:text-6xl leading-[1.05] tracking-[-0.02em] text-zinc-900 dark:text-zinc-100 mb-4">
                    Projects<em className="text-teal-ink dark:text-teal">.</em>
                </h1>
                <p className="font-mono text-sm leading-relaxed max-w-xl text-zinc-600 dark:text-zinc-400">
                    Things I&apos;ve built, shipped, and open-sourced. Pulled live from GitHub.
                </p>
            </header>

            {/* ── Featured ── */}
            {repos.length > 0 ? (
                <section className="mb-14" aria-labelledby="featured-heading">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="inline-block w-4 h-px bg-teal" />
                        <h2 id="featured-heading" className="font-mono text-xs tracking-[0.15em] uppercase text-teal-ink dark:text-teal">
                            Featured
                        </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {repos.map((repo) => (
                            <RepoCard key={repo.name} repo={repo} featured />
                        ))}
                    </div>
                </section>
            ) : (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
                    <a
                        href="https://github.com/SebastianPellitero"
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm tracking-[0.15em] uppercase text-teal-ink border-b border-teal-ink dark:text-teal dark:border-teal pb-0.5 hover:opacity-60 transition-opacity"
                    >
                        Projects are on GitHub →
                    </a>
                </div>
            )}

        </div>
    )
}
