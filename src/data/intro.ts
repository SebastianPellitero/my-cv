export type Skill = {
    label: string
    abbr: string
    color: string
    iconKey: string
}

export type IntroProject = {
    name: string
    url: string
}

export type ThirdRingItem = {
    id: string
    label: string
    url?: string
}

export const skills: Skill[] = [
    { label: 'React',      abbr: 'Re', color: '#61dafb', iconKey: 'react'       },
    { label: 'TypeScript', abbr: 'TS', color: '#3178c6', iconKey: 'typescript'  },
    { label: 'Next.js',    abbr: 'Nx', color: '#e2e8f0', iconKey: 'nextdotjs'   },
    { label: 'CSS',        abbr: 'CS', color: '#563d7c', iconKey: 'css'         },
    { label: 'Tailwind',   abbr: 'Tw', color: '#38bdf8', iconKey: 'tailwindcss' },
    { label: 'Testing',    abbr: 'Jt', color: '#99425b', iconKey: 'jest'        },
    { label: 'GraphQL',    abbr: 'GQ', color: '#e10098', iconKey: 'graphql'     },
    { label: 'Node.js',    abbr: 'No', color: '#68a063', iconKey: 'nodedotjs'   },
    { label: 'Go',         abbr: 'Go', color: '#00ADD8', iconKey: 'go'          },
    { label: 'PostgreSQL', abbr: 'PG', color: '#336791', iconKey: 'postgresql'  },
    { label: 'Git',        abbr: 'Gt', color: '#F05032', iconKey: 'git'         },
    { label: 'A11y',       abbr: 'Ac', color: '#2dd4bf', iconKey: 'w3schools'   },
]

export const introProjects: IntroProject[] = [
    { name: 'my-cv',     url: 'https://github.com/SebastianPellitero/my-cv' },
    { name: 'project-2', url: 'https://github.com/SebastianPellitero' },
    { name: 'project-3', url: 'https://github.com/SebastianPellitero' },
    { name: 'project-4', url: 'https://github.com/SebastianPellitero' },
    { name: 'project-5', url: 'https://github.com/SebastianPellitero' },
    { name: 'project-6', url: 'https://github.com/SebastianPellitero' },
]

export const thirdRingItems: ThirdRingItem[] = [
    { id: 'item-1', label: '' },
    { id: 'item-2', label: '' },
    { id: 'item-3', label: '' },
    { id: 'item-4', label: '' },
    { id: 'item-5', label: '' },
    { id: 'item-6', label: '' },
    { id: 'item-7', label: '' },
    { id: 'item-8', label: '' },
]
