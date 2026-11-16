import Link from 'next/link'
import * as runtime from 'react/jsx-runtime'
import type { ComponentProps, ComponentType } from 'react'

// Elements notes can render. Add live demo components here later (phase 2) and use them in .mdx notes as <Name />
const components = {
    a: ({ href = '', ...props }: ComponentProps<'a'>) =>
        href.startsWith('/') ? <Link href={href} {...props} /> : <a href={href} {...props} />,
    // Keep one h1 per page: the note title. A `# Heading` in a note renders as h2
    h1: (props: ComponentProps<'h2'>) => <h2 {...props} />,
    // rehype-pretty-code already sets tabIndex=0 so long lines scroll by keyboard; give the region a name
    pre: (props: ComponentProps<'pre'> & { 'data-language'?: string }) => (
        <pre role="region" aria-label={`Code example${props['data-language'] ? ` (${props['data-language']})` : ''}`} {...props} />
    ),
}

// Velite compiles each note to a function body; run it with the React JSX runtime (at build time for static pages)
export function MDXContent({ code }: { code: string }) {
    const Content = new Function(code)({ ...runtime }).default as ComponentType<{ components: typeof components }>
    return <Content components={components} />
}
