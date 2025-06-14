'use client'

import {
    useViewportScroll,
    motion,
    useTransform,
    useMotionValue,
    useScroll
} from 'framer-motion';
import { useRef } from 'react';

const Card = ({ children }: { children: React.ReactNode }) => (
    <section className="bg-white rounded-2xl shadow-md p-6 border-b-blue-700 border-2">{children}</section>
);

export default function AboutMe() {

    const container = useRef();
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"]
    })

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

    return (
        <>
            <Card>
                <motion.div style={{ scale, rotate }}>
                    <h2 className="text-5xl text-red-600">Foleon</h2>
                    <div>
                        <h3>Description</h3>
                        <p></p>
                        <h3>Achivements</h3>
                        <p></p>
                        <h3>Tech Stack</h3>
                        <p></p>
                    </div>
                </motion.div>
            </Card>
            <Card>
                <h2 className="text-5xl text-red-600">ThingsCubed</h2>
            </Card>
            <Card>
                <h2 className="text-5xl text-red-600">Sparks</h2>
            </Card>
            <Card>
                <h2 className="text-5xl text-red-600">GlobalLogic</h2>
            </Card>
            <Card>
                <h2 className="text-5xl text-red-600">Globant</h2>
            </Card>
        </>
    );
}
