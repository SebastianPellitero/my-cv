export type Skill = {
    label: string
    abbr: string
    color: string
}

export type IntroProject = {
    name: string
    url: string
}

export const skills: Skill[] = [
    { label: 'React', abbr: 'Re', color: '#61dafb' },
    { label: 'TypeScript', abbr: 'TS', color: '#3178c6' },
    { label: 'Next.js', abbr: 'Nx', color: '#e2e8f0' },
    { label: 'CSS', abbr: 'CS', color: '#563d7c' },
    { label: 'Tailwind', abbr: 'Tw', color: '#38bdf8' },
    { label: 'Testing', abbr: 'Jt', color: '#99425b' },
    { label: 'GraphQL', abbr: 'GQ', color: '#e10098' },
    { label: 'Node.js', abbr: 'No', color: '#68a063' },
    { label: 'Go', abbr: 'Go', color: '#00ADD8' },
    { label: 'PostgreSQL', abbr: 'PG', color: '#336791' },
    { label: 'Git', abbr: 'Gt', color: '#F05032' },
    { label: 'A11y', abbr: 'Ac', color: '#2dd4bf' },
]

export const introProjects: IntroProject[] = [
    { name: 'my-cv', url: 'https://github.com/SebastianPellitero/my-cv' },
    { name: 'project-2', url: 'https://github.com/SebastianPellitero' },
    { name: 'project-3', url: 'https://github.com/SebastianPellitero' },
    { name: 'project-4', url: 'https://github.com/SebastianPellitero' },
    { name: 'project-5', url: 'https://github.com/SebastianPellitero' },
    { name: 'project-6', url: 'https://github.com/SebastianPellitero' },
]
