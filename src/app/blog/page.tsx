import Link from "next/link";
import { getAllPostsMeta } from "@/lib/posts";

export default function BlogPage() {
    const posts = getAllPostsMeta();

    return (
        <main className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-3xl font-semibold">Blog</h1>
            <p className="mt-2 text-neutral-600">Notes, experiments, and occasional frontend sorcery.</p>
            <ul className="mt-10 space-y-6">
                {posts.map((p) => (
                    <li key={p.slug} className="rounded-2xl border border-neutral-200 p-5">
                        <p className="text-sm text-neutral-500">
                            {new Date(p.date).toLocaleDateString("en-NL", { year: "numeric", month: "short", day: "numeric" })} ·{" "}
                            {p.readingMinutes} min read
                        </p>

                        <Link href={`/blog/${p.slug}`} className="mt-1 block text-xl font-semibold">
                            {p.title}
                        </Link>

                        {p.description ? <p className="mt-2 text-neutral-600">{p.description}</p> : null}

                        {p.tags?.length ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {p.tags.map((t) => (
                                    <span key={t} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </li>
                ))}
            </ul>
        </main>
    );
}