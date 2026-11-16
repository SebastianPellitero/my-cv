import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { allNotes, allTags, STAGES } from "@/lib/garden";
import { NoteList, TagLinks } from "@/components/garden/NoteList";

const title = "My Zettelkasten garden";
const description = "Small, linked notes on accessibility and frontend engineering that grow over time.";

export const metadata: Metadata = {
    title,
    description,
    // One address for search engines: the ?stage= views are the same page, filtered
    alternates: { canonical: "/garden" },
    openGraph: { type: "website", siteName: "Sebastian Pellitero", title, description, url: "/garden" },
};

// ?stage= filter makes this page render per request; the note and tag pages stay static
export default async function GardenPage({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
    const { stage } = await searchParams;
    const active = STAGES.find((s) => s === stage);
    const notes = active ? allNotes.filter((n) => n.stage === active) : allNotes;

    return (
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
            <figure className="memory-frame mb-10 sm:mb-14">
                <Image
                    className="memory"
                    src="/garden/memory.webp"
                    alt="A thread of memory drops into a wide stone basin of glowing blue water, with a fire burning behind it."
                    width={1000}
                    height={570}
                    sizes="(min-width: 1280px) 1200px, 100vw"
                    priority
                />
            </figure>

            {/* Wide screens: title on the left, what the garden is on the right */}
            <header className="mb-10 grid gap-x-16 gap-y-5 lg:grid-cols-[1.3fr_1fr] lg:items-end">
                <h1 className="garden-title">My Zettelkasten garden</h1>
                <p className="garden-soft max-w-2xl text-[1.375rem] leading-snug lg:pb-2">
                    Small, linked notes that grow over time. Seedlings are rough ideas, budding notes are taking shape,
                    evergreen notes are settled.
                </p>
            </header>

            <div className="mb-5 flex flex-col gap-3">
                <nav aria-label="Filter by stage" className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <span className="garden-soft">Stage</span>
                    <Link href="/garden" aria-current={active ? undefined : "page"} className="pencil-circle">
                        All
                    </Link>
                    {STAGES.map((s) => (
                        <Link
                            key={s}
                            href={`/garden?stage=${s}`}
                            aria-current={active === s ? "page" : undefined}
                            className="pencil-circle capitalize"
                        >
                            {s}
                        </Link>
                    ))}
                </nav>
                {allTags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="garden-soft">Tags</span>
                        <TagLinks tags={allTags} />
                    </div>
                )}
            </div>

            <hr className="pencil-rule mb-10" />

            <NoteList notes={notes} />
        </div>
    );
}
