import { introProjects } from '@/data/intro'

function getArcOffset(i: number, total: number): { isTop: boolean; startOffset: string } {
    let angle = (i / total) * 2 * Math.PI - Math.PI / 2
    while (angle >= Math.PI) angle -= 2 * Math.PI
    while (angle < -Math.PI) angle += 2 * Math.PI
    const isTop = angle < 0
    const offset = isTop ? (angle + Math.PI) / Math.PI : angle / Math.PI
    return { isTop, startOffset: `${(offset * 100).toFixed(2)}%` }
}

export default function ProjectsRing({ radius = 215 }: { radius?: number }) {
    const cx = 350
    const cy = 350
    const textR = radius + 14
    const topArc    = `M ${cx - textR},${cy} A ${textR},${textR} 0 0,1 ${cx + textR},${cy}`
    const bottomArc = `M ${cx + textR},${cy} A ${textR},${textR} 0 0,1 ${cx - textR},${cy}`

    return (
        <svg
            data-projects-ring
            viewBox="0 0 700 700"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <path id="proj-top-arc"    d={topArc} />
                <path id="proj-bottom-arc" d={bottomArc} />
            </defs>

            {introProjects.map((project, i) => {
                const angle = (i / introProjects.length) * 2 * Math.PI - Math.PI / 2
                const ix = cx + Math.cos(angle) * radius
                const iy = cy + Math.sin(angle) * radius

                return (
                    <g key={project.name} data-project-item>
                        <g transform={`translate(${ix},${iy})`}>
                            <circle r="3" fill="#2dd4bf" opacity="0.7" />
                        </g>
                    </g>
                )
            })}

            {introProjects.map((project, i) => {
                const { isTop, startOffset } = getArcOffset(i, introProjects.length)
                return (
                    <text
                        key={`label-${project.name}`}
                        data-project-label
                        fontFamily="DM Mono, monospace"
                        fontSize="8"
                        letterSpacing="1.5"
                        fill="#3f3f46"
                        textAnchor="middle"
                    >
                        <textPath
                            href={isTop ? '#proj-top-arc' : '#proj-bottom-arc'}
                            startOffset={startOffset}
                        >
                            {project.name.toUpperCase()}
                        </textPath>
                    </text>
                )
            })}
        </svg>
    )
}
