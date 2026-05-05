import { introProjects } from '@/data/intro'

export default function ProjectsRing({ radius = 210 }: { radius?: number }) {
    void radius // radius is applied via GSAP in ImpressFlow
    return (
        <div data-projects-ring className="absolute inset-0">
            {introProjects.map((project) => (
                <a
                    key={project.name}
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    data-project-item
                    className="absolute"
                    style={{ top: '50%', left: '50%' }}
                >
                    <div className="px-3 py-1.5 rounded-sm border border-zinc-700 bg-zinc-900/80 hover:border-teal transition-colors duration-200 whitespace-nowrap">
                        <span className="font-['DM_Mono',monospace] text-[0.6rem] tracking-[0.08em] uppercase text-zinc-400 hover:text-teal transition-colors duration-200">
                            {project.name}
                        </span>
                    </div>
                </a>
            ))}
        </div>
    )
}
