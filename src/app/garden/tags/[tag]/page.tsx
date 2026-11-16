import type { Metadata } from "next";
import Link from "next/link";
import { allNotes, allTags, GARDEN_PREVIEW, isIndexableTag } from "@/lib/garden";
import { NoteList } from "@/components/garden/NoteList";

export const dynamicParams = false;

export function generateStaticParams() {
    return allTags.map((tag) => ({ tag }));
}

type Props = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { tag } = await params;
    const title = `#${tag} notes`;
    const description = `Notes tagged #${tag} in my Zettelkasten garden.`;
    return {
        title,
        description,
        alternates: { canonical: `/garden/tags/${tag}` },
        // Links on the page are still followed, so the notes it lists get found
        robots: isIndexableTag(tag) ? undefined : { index: false, follow: true },
        openGraph: { type: "website", siteName: "Sebastian Pellitero", title, description, url: `/garden/tags/${tag}`, images: [GARDEN_PREVIEW] },
    };
}

export default async function TagPage({ params }: Props) {
    const { tag } = await params;
    return (
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
            <nav aria-label="Breadcrumb" className="mb-8">
                <Link href="/garden" className="pencil-link garden-soft">
                    Back to my Zettelkasten garden
                </Link>
            </nav>
            <h1 className="garden-title mb-8">Notes tagged #{tag}</h1>
            <hr className="pencil-rule mb-10" />
            <NoteList notes={allNotes.filter((n) => n.tags.includes(tag))} />
        </div>
    );
}
