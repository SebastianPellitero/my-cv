import {
    siReact, siTypescript, siNextdotjs, siCss, siTailwindcss,
    siJest, siGraphql, siNodedotjs, siGo, siPostgresql, siGit, siW3schools,
} from 'simple-icons'
import { skills } from '@/data/intro'

const ICON_MAP: Record<string, { path: string; hex: string }> = {
    react:       siReact,
    typescript:  siTypescript,
    nextdotjs:   siNextdotjs,
    css:         siCss,
    tailwindcss: siTailwindcss,
    jest:        siJest,
    graphql:     siGraphql,
    nodedotjs:   siNodedotjs,
    go:          siGo,
    postgresql:  siPostgresql,
    git:         siGit,
    w3schools:   siW3schools,
}

function getArcOffset(i: number, total: number): { isTop: boolean; startOffset: string } {
    let angle = (i / total) * 2 * Math.PI - Math.PI / 2
    while (angle >= Math.PI) angle -= 2 * Math.PI
    while (angle < -Math.PI) angle += 2 * Math.PI
    const isTop = angle < 0
    const offset = isTop ? (angle + Math.PI) / Math.PI : angle / Math.PI
    return { isTop, startOffset: `${(offset * 100).toFixed(2)}%` }
}

export default function SkillsRing({ radius = 120 }: { radius?: number }) {
    const cx = 350
    const cy = 350
    const textR = radius + 22
    const topArc    = `M ${cx - textR},${cy} A ${textR},${textR} 0 0,1 ${cx + textR},${cy}`
    const bottomArc = `M ${cx + textR},${cy} A ${textR},${textR} 0 0,1 ${cx - textR},${cy}`

    return (
        <svg
            data-skills-ring
            viewBox="0 0 700 700"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <path id="skills-top-arc"    d={topArc} />
                <path id="skills-bottom-arc" d={bottomArc} />
            </defs>

            {skills.map((skill, i) => {
                const angle = (i / skills.length) * 2 * Math.PI - Math.PI / 2
                const ix = cx + Math.cos(angle) * radius
                const iy = cy + Math.sin(angle) * radius
                const icon = ICON_MAP[skill.iconKey]

                return (
                    <g key={skill.label} data-skill-item>
                        <g transform={`translate(${ix},${iy})`}>
                            {icon ? (
                                <path
                                    d={icon.path}
                                    transform="translate(-10,-10) scale(0.8333)"
                                    fill={`#${icon.hex}`}
                                    opacity="0.9"
                                />
                            ) : (
                                <>
                                    <circle r="8" fill={skill.color} />
                                    <text
                                        fontSize="7" textAnchor="middle" dy="2.5"
                                        fill="#000" fontFamily="DM Mono, monospace"
                                    >
                                        {skill.abbr}
                                    </text>
                                </>
                            )}
                        </g>
                    </g>
                )
            })}

            {skills.map((skill, i) => {
                const { isTop, startOffset } = getArcOffset(i, skills.length)
                return (
                    <text
                        key={`label-${skill.label}`}
                        data-skill-label
                        fontFamily="DM Mono, monospace"
                        fontSize="7"
                        letterSpacing="1.5"
                        fill="#52525b"
                        textAnchor="middle"
                    >
                        <textPath
                            href={isTop ? '#skills-top-arc' : '#skills-bottom-arc'}
                            startOffset={startOffset}
                        >
                            {skill.label.toUpperCase()}
                        </textPath>
                    </text>
                )
            })}
        </svg>
    )
}
