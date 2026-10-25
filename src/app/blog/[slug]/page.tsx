import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPostsMeta, getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";

export async function generateStaticParams() {
    return getAllPostsMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    try {
        const post = getPostBySlug(slug);
        return {
            title: post.title,
            description: post.description,
            openGraph: { type: "article", title: post.title, description: post.description, publishedTime: post.date || undefined },
        };
    } catch {
        return {};
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    let post;
    try {
        post = getPostBySlug(slug);
    } catch {
        notFound();
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <header className="mb-10">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {new Date(post.date).toLocaleDateString("en-NL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}{" "}
                    · {post.readingMinutes} min read
                </p>

                <h1 className="mt-2 font-serif text-4xl tracking-tight text-zinc-900 dark:text-zinc-100">
                    {post.title}
                </h1>

                {post.description ? (
                    <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{post.description}</p>
                ) : null}
            </header>

            <article className="prose prose-zinc dark:prose-invert max-w-none prose-pre:p-0">
                <MDXRemote
                    source={post.content}
                    options={{
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [
                                rehypeSlug,
                                [rehypeAutolinkHeadings, { behavior: "wrap" }],
                                [
                                    rehypeShiki,
                                    {
                                        theme: "github-dark",
                                        // You can add more languages if you need:
                                        // langs: ["ts", "tsx", "js", "css", "bash", "json"],
                                    },
                                ],
                            ],
                        },
                    }}
                />
            </article>
        </div>
    );
}