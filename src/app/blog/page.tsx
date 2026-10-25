import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export const metadata: Metadata = {
    title: "Blog",
    description: "Notes, experiments, and occasional frontend sorcery.",
};

export default function BlogPage() {
    const posts = getAllPostsMeta();

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="font-serif text-4xl text-zinc-900 dark:text-zinc-100">Blog</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Notes, experiments, and occasional frontend sorcery.</p>
            <ul className="mt-10 space-y-6">
                {posts.map((p) => (
                    <li key={p.slug} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {new Date(p.date).toLocaleDateString("en-NL", { year: "numeric", month: "short", day: "numeric" })} ·{" "}
                            {p.readingMinutes} min read
                        </p>

                        <Link href={`/blog/${p.slug}`} className="mt-1 block text-xl font-semibold text-zinc-900 hover:text-teal-ink dark:text-zinc-100 dark:hover:text-teal">
                            {p.title}
                        </Link>

                        {p.description ? <p className="mt-2 text-zinc-600 dark:text-zinc-400">{p.description}</p> : null}

                        {p.tags?.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {p.tags.map((t) => (
                                    <span key={t} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </li>
                ))}
            </ul>
        </div>
    );
}
