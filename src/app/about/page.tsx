'use client'

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';


type CardProps = {
    children: React.ReactNode;
    variant: 'fade' | 'slide' | 'horizontal';
};

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);


function Card({ children, index }: { children: React.ReactNode; index: number }) {


    return (
        <section

            className="card h-screen w-screen flex justify-center flex-col bg-white border-b border-gray-200 p-20"
        >
            {children}
        </section>
    );
}


// components/ExperienceCard.tsx
type ExperienceCardProps = {
    company: string;
    period: string;
    context: string;
    achievements: string[];
    techStack: string[];
};

function ExperienceCard({
    company,
    period,
    context,
    achievements,
    techStack,
}: ExperienceCardProps) {
    return (
        <div className="experience flex flex-col gap-8 max-w-3xl w-full px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
                <h2 className="text-4xl md:text-5xl font-bold text-red-600">{company}</h2>
                <h3 className="text-lg text-gray-500">{period}</h3>
            </div>

            {/* Context */}
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Context</h3>
                <p className="text-gray-700 leading-relaxed">{context}</p>
            </div>

            {/* Achievements */}
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Achievements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {achievements.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Tech Stack</h3>
                <div className="text-gray-700 text-sm flex flex-wrap gap-x-3 gap-y-2">
                    {techStack.map((tech, index) => (
                        <span key={index} className="bg-gray-200 rounded px-2 py-1">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}




export default function AboutMe() {
    const container = useRef(null);

    const ref = useRef<HTMLDivElement | null>(null);


    useGSAP(() => {
        const experience = gsap.utils.toArray(".experience");

        let scrollTween = gsap.to(experience,
            { scrollTrigger: ".experience", rotation: "+=360", duration: 3, scrub: 1 });

        //gsap.to(".experience", { scrollTrigger: ".card", rotation: "+=360", duration: 3, scrub: 1, pin: true, markers: true });

        ScrollTrigger.create({
            trigger: ".card",
            // containerAnimation: scrollTween,
            start: "center 65%",
            end: "center 51%",
            markers: true,
            onEnter: () => console.log("enter"),
            onLeave: () => console.log("leave"),
            onEnterBack: () => console.log("enterBack"),
            onLeaveBack: () => console.log("leaveBack"),
            // onToggle: self => console.log("active", self.isActive),
        });
    }, { scope: container });

    return (
        <div ref={container}>

            <Card index={0}>
                <ExperienceCard
                    company="Foleon"
                    period="2021 – Today"
                    context="Working as a Frontend Developer on the creation of new features and maintenance of a content creator platform using React with TypeScript. I also contributed to an architectural redesign that affected the entire product."
                    achievements={[
                        "Completed and delivered a major feature after two years of code refactor",
                        "Led the migration from Cypress to Playwright and integrated screenshot testing and code coverage tooling",
                        "Collaborated on epic planning with Product Owners, Designers, and Stakeholders",
                        "Improved team processes and communication",
                        "Researched and implemented best practices in the CI pipeline",
                        "Contributed to the transition toward a continuous deployment strategy",
                    ]}
                    techStack={["React", "TypeScript", "Playwright", "Cypress"]}
                />
            </Card>

            <Card index={1}>
                <ExperienceCard
                    company="Things Cubed"
                    period="2020 - 2021"
                    context="Working in the development team at a IOT startup company, aimed to improve and display telemetry data of various machine dedicated sensors."
                    achievements={[
                        "Collaborating with another college in a total UI/UX refactor.",
                        "Desiging and restructuring all the components from Dev-Express to React.",
                        "Migrating the frotend part of the application to React and Material UI.",
                        "Making, updating and maintaining the documentation of the frontend architecture.",
                        "Optimizing the page load time, reducing it by 90%."
                    ]}
                    techStack={["ReactJS", "Redux", "MDB", "Dev-Express"]}
                />
            </Card>

            <Card index={2}>
                <ExperienceCard
                    company="MacMillan (Spark Digital client)"
                    period="2019 - 2020"
                    context="Working in the development team in a small concultant company, providing solution to the McMillan University, and developing an education application using accessibility first."
                    achievements={[
                        "Being the accessibility reference of the team, in charge of creating a complete navigation using the keyboard, and the layout of 3 different screen readers.",
                        "Collaborating into building new components in a canvas oriented project.",
                        "Successfully launching and presenting the product."

                    ]}
                    techStack={["ReactJS", "Redux-Saga", "Canvas"]}
                />
            </Card>
            <Card index={3}>
                <ExperienceCard
                    company="La Galaxy & Claro (GlobalLogic clients)"
                    period="2019 - 2019"
                    context="Worked remotely in a consultant company where i participated in two different projects."
                    achievements={[
                        "Effectively collaborating with a team of designers on a significant rework of the back-office architecture.",
                        "Communicated and presented updates to stakeholders.",
                        "Successfully implemented and enhanced an internal notification tool based on Angular."

                    ]}
                    techStack={["Javascript", "TypeScript", "Angular4", " ReactJS", "Material-UI"]}
                />
            </Card>
            <Card index={4}>
                <ExperienceCard
                    company="Dell EMC & Reed (Globant clients)"
                    period="2016 - 2019"
                    context="Working in a leading software development company in Argentina, I was involved in various projects and inside tools."
                    achievements={[
                        "Collaborated on the redesign of the landing page focusing on enhacing user engagement and experience.",
                        "Tested, adapted, and develop various A/B tests for different features to improve functionality and user satisfaction.",
                        "Optimized performance and refactored features using mobile-first and responsibe apporoach, ensuring seamless functionality across devises.",
                        "Designed, developed, and thoroughly tested an entire application using React within a gamification envirroment, enhancing user interaction and retention strategies."]}
                    techStack={["Javascript", "Jquery", "Scss", "HTML", " ASP.NET Razor", "React", "Redux"]}
                />
            </Card>
        </div >
    );
}
