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
        <main className="mx-auto max-w-3xl px-4 py-10">
            <header className="mb-10">
                <p className="text-sm text-neutral-500">
                    {new Date(post.date).toLocaleDateString("en-NL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}{" "}
                    · {post.readingMinutes} min read
                </p>

                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">
                    {post.title}
                </h1>

                {post.description ? (
                    <p className="mt-4 text-lg text-neutral-600">{post.description}</p>
                ) : null}
            </header>

            <article className="prose prose-neutral max-w-none prose-pre:p-0">
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
        </main>
    );
}