import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allNotes, backlinksFor, GARDEN_PREVIEW, getNote, relatedByTag, type Note } from "@/lib/garden";
import { MDXContent } from "@/components/garden/MDXContent";
import { FormattedDate, StageBadge, TagLinks } from "@/components/garden/NoteList";
import { SITE_URL } from "@/lib/site";

const SITE_NAME = "Sebastian Pellitero";

export const dynamicParams = false;

export function generateStaticParams() {
    return allNotes.map((n) => ({ slug: n.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const note = getNote((await params).slug);
    if (!note) return {};
    return {
        title: note.title,
        description: note.description,
        alternates: { canonical: `/garden/${note.slug}` },
        openGraph: {
            type: "article",
            siteName: SITE_NAME,
            url: `/garden/${note.slug}`,
            authors: [SITE_NAME],
            images: [GARDEN_PREVIEW],
            title: note.title,
            description: note.description,
            publishedTime: note.created,
            modifiedTime: note.updated,
            tags: note.tags,
        },
    };
}

function NoteLinks({ id, title, notes, empty }: { id: string; title: string; notes: Note[]; empty?: string }) {
    if (notes.length === 0 && !empty) return null;
    return (
        <section aria-labelledby={id}>
            <h2 id={id} className="garden-subheading mb-3">
                {title}
            </h2>
            {notes.length === 0 ? (
                <p className="garden-soft">{empty}</p>
            ) : (
                <ul className="space-y-2">
                    {notes.map((n) => (
                        <li key={n.slug}>
                            <Link href={`/garden/${n.slug}`} className="pencil-link">
                                {n.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default async function NotePage({ params }: Props) {
    const { slug } = await params;
    const note = getNote(slug);
    if (!note) notFound();

    const backlinks = backlinksFor(slug);
    const related = relatedByTag(note).filter((n) => !backlinks.includes(n));

    // Article data for search engines: who wrote the note and when (schema.org, read from the page as JSON-LD)
    const url = `${SITE_URL}/garden/${note.slug}`;
    const articleData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: note.title,
        description: note.description,
        datePublished: note.created,
        dateModified: note.updated ?? note.created,
        keywords: note.tags.join(", "),
        url,
        mainEntityOfPage: url,
        author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    };

    return (
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
            {/* "<" is escaped so note text can never close the script tag */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData).replace(/</g, "\\u003c") }}
            />
            <nav aria-label="Breadcrumb" className="mb-8">
                <Link href="/garden" className="pencil-link garden-soft">
                    Back to my Zettelkasten garden
                </Link>
            </nav>

            {/* Wide screens: the note on the left at a readable line length, its linked notes in a column on the right */}
            <div className="grid gap-x-20 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <article>
                <header className="mb-8">
                    <div className="garden-soft flex flex-wrap items-center gap-x-5 gap-y-1">
                        <StageBadge stage={note.stage} />
                        <span>
                            Planted <FormattedDate iso={note.created} />
                            {note.updated && (
                                <>
                                    , last tended <FormattedDate iso={note.updated} />
                                </>
                            )}
                        </span>
                    </div>
                    <h1 className="garden-title mt-4">{note.title}</h1>
                    <p className="garden-soft mt-5 text-[1.375rem] leading-snug">{note.description}</p>
                    <div className="mt-4">
                        <TagLinks tags={note.tags} />
                    </div>
                </header>

                <hr className="pencil-rule mb-10" />

                {/* drop typography's decorative backticks around inline code and quote marks around blockquotes; colours come from garden.css */}
                <div className="prose max-w-[46rem] prose-code:before:content-none prose-code:after:content-none prose-blockquote:[&_p]:before:content-none prose-blockquote:[&_p]:after:content-none">
                    <MDXContent code={note.body} />
                </div>
            </article>

            <footer className="mt-16 lg:mt-0">
                <hr className="pencil-rule mb-10 lg:hidden" />
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
                    <NoteLinks id="backlinks" title="Linked from" notes={backlinks} empty="No notes link here yet." />
                    <NoteLinks id="related" title="Related by tag" notes={related} />
                </div>
            </footer>
            </div>
        </div>
    );
}
