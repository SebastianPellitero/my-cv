import { introProjects } from '@/data/intro'

export default function ProjectsRing({ radius = 210 }: { radius?: number }) {
    return (
        <div className="absolute inset-0">
            {introProjects.map((project, i) => {
                const angle = (i / introProjects.length) * 2 * Math.PI - Math.PI / 2
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                    <a
                        key={project.name}
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                        data-project-item
                        className="absolute"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        }}
                    >
                        <div className="px-3 py-1.5 rounded-sm border border-zinc-700 bg-zinc-900/80 hover:border-teal transition-colors duration-200 whitespace-nowrap">
                            <span className="font-['DM_Mono',monospace] text-[0.6rem] tracking-[0.08em] uppercase text-zinc-400 hover:text-teal transition-colors duration-200">
                                {project.name}
                            </span>
                        </div>
                    </a>
                )
            })}
        </div>
    )
}
