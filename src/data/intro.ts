import {
    type SimpleIcon,
    siReact, siTypescript, siNextdotjs, siRedux, siReactquery, siAngular, siVuedotjs,
    siCss, siTailwindcss, siJest, siGraphql, siNodedotjs, siPython, siOpenjdk, siDotnet,
    siPostgresql, siDocker, siOllama, siRaspberrypi, siGit, siW3schools, siClaude, siApachespark,
} from 'simple-icons'

// One item on an orbit ring: a simple-icons logo, an image in /public, or (neither) a lettered badge
export type OrbitItem = {
    label: string
    abbr: string
    icon?: SimpleIcon
    img?: string
}

export const skills: OrbitItem[] = [
    { label: 'React',          abbr: 'Re', icon: siReact },
    { label: 'TypeScript',     abbr: 'TS', icon: siTypescript },
    { label: 'Next.js',        abbr: 'Nx', icon: siNextdotjs },
    { label: 'React Native',   abbr: 'RN', icon: siReact },
    { label: 'Redux',          abbr: 'Rx', icon: siRedux },
    { label: 'TanStack Query', abbr: 'TQ', icon: siReactquery },
    { label: 'Angular',        abbr: 'Ng', icon: siAngular },
    { label: 'Vue',            abbr: 'Vu', icon: siVuedotjs },
    { label: 'CSS',            abbr: 'CS', icon: siCss },
    { label: 'Tailwind',       abbr: 'Tw', icon: siTailwindcss },
    { label: 'Testing',        abbr: 'Jt', icon: siJest },
    { label: 'GraphQL',        abbr: 'GQ', icon: siGraphql },
    { label: 'Node.js',        abbr: 'No', icon: siNodedotjs },
    { label: 'Python',         abbr: 'Py', icon: siPython },
    { label: 'Java',           abbr: 'Jv', icon: siOpenjdk },
    { label: '.NET',           abbr: 'Nt', icon: siDotnet },
    { label: 'PostgreSQL',     abbr: 'PG', icon: siPostgresql },
    { label: 'Docker',         abbr: 'Dk', icon: siDocker },
    { label: 'AWS',            abbr: 'AW', img: '/intro/aws.png' },
    { label: 'Azure',          abbr: 'Az', img: '/intro/azure.svg' }, // from devicon (MIT); simple-icons dropped Microsoft brands
    { label: 'Ollama',         abbr: 'Ol', icon: siOllama },
    { label: 'Raspberry Pi',   abbr: 'Pi', icon: siRaspberrypi },
    { label: 'Git',            abbr: 'Gt', icon: siGit },
    { label: 'A11y',           abbr: 'Ac', icon: siW3schools },
]

// Logos are the companies' site icons (Spark Digital's from its old wordmark;
// ThingsCubed's redrawn as SVG so it sits on the light tile without its dark backdrop)
export const companies: OrbitItem[] = [
    { label: 'Foleon',        abbr: 'Fo', img: '/intro/foleon.png' },
    { label: 'ThingsCubed',   abbr: 'TC', img: '/intro/thingscubed.svg' },
    { label: 'Spark Digital', abbr: 'SD', img: '/intro/sparkdigital.png' },
    { label: 'Globant',       abbr: 'G',  img: '/intro/globant.png' },
    { label: 'GlobalLogic',   abbr: 'GL', img: '/intro/globallogic.png' },
]

// What I'm working on right now (inner ring)
export const learning: OrbitItem[] = [
    { label: 'WAS exam (A11y cert)', abbr: 'WAS', img: '/intro/iaap-was.png' },
    { label: 'Python',               abbr: 'Py', icon: siPython },
    { label: 'Data engineer path',   abbr: 'DE', icon: siApachespark },
    { label: 'Claude courses',       abbr: 'Cl', icon: siClaude },
]
