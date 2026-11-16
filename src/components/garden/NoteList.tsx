import Link from 'next/link'
import { lastTouched, type Note } from '@/lib/garden'

// Pencil doodles in place of colour emoji: one leaf, two leaves, a tree
const STAGE: Record<Note['stage'], { label: string; doodle: string }> = {
    seedling: { label: 'Seedling', doodle: 'M12 21V11 M12 12c0-4 3-6 7-6 0 4-3 6-7 6Z' },
    budding: { label: 'Budding', doodle: 'M12 21V9 M12 13c0-4 3-6 7-6 0 4-3 6-7 6Z M12 16c0-3-2-5-6-5 0 3 2 5 6 5Z' },
    evergreen: { label: 'Evergreen', doodle: 'M12 21v-5 M12 3 7 9h3l-4 5h12l-4-5h3Z' },
}

// The word carries the meaning; the doodle is decoration
export function StageBadge({ stage }: { stage: Note['stage'] }) {
    const { label, doodle } = STAGE[stage]
    return (
        <span className="inline-flex items-center gap-1.5">
            <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'url(#pencil)' }}>
                <path d={doodle} />
            </svg>
            {label}
        </span>
    )
}

export function TagLinks({ tags }: { tags: string[] }) {
    if (tags.length === 0) return null
    return (
        <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Tags">
            {tags.map((t) => (
                <li key={t}>
                    <Link href={`/garden/tags/${t}`} className="pencil-link">
                        #{t}
                    </Link>
                </li>
            ))}
        </ul>
    )
}

export function FormattedDate({ iso }: { iso: string }) {
    return (
        <time dateTime={iso}>
            {new Date(iso).toLocaleDateString('en-NL', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
        </time>
    )
}

// Each note is a slip in the box (styles in app/garden/garden.css)
export function NoteList({ notes }: { notes: Note[] }) {
    if (notes.length === 0) return <p className="garden-soft">No notes here yet.</p>
    return (
        <ul className="slip-list grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((n) => (
                <li key={n.slug} className="slip flex flex-col">
                    <div className="garden-soft mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                        <StageBadge stage={n.stage} />
                        <FormattedDate iso={lastTouched(n)} />
                    </div>
                    <h2 className="garden-heading">
                        <Link href={`/garden/${n.slug}`} className="slip-link">
                            {n.title}
                        </Link>
                    </h2>
                    <p className="mt-2 mb-4">{n.description}</p>
                    <div className="mt-auto">
                        <TagLinks tags={n.tags} />
                    </div>
                </li>
            ))}
        </ul>
    )
}
