import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const trustLogos = [
    { name: 'Dungeons & Dragons', placeholder: 'D&D' },
    { name: 'Daggerheart', placeholder: 'DH' },
    { name: 'Pathfinder', placeholder: 'PF' },
    { name: 'STRPG', placeholder: 'SR' },
    { name: 'Video Games', placeholder: 'VG' },
    { name: 'Writing', placeholder: 'WR' },
    { name: 'Worldbuilding', placeholder: 'WB' },
    { name: 'Tabletop', placeholder: 'TT' },
];

export default function TrustBanner() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.scrollWidth / 2);
        }
    }, []);

    // For reduced motion, show static grid instead of animation
    if (shouldReduceMotion) {
        return (
            <section className="w-full bg-jet/10 py-8 dark:bg-parchment/10">
                <div className="mx-auto max-w-screen-2xl px-4">
                    <p className="mb-4 text-center text-sm font-medium text-tome/70 dark:text-parchment/70 font-serif">Built for use with</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {trustLogos.map((logo) => (
                            <div
                                key={logo.name}
                                className="flex items-center gap-3 rounded-lg border border-tome/20 bg-parchment-100/50 px-6 py-3 dark:border-parchment/20 dark:bg-jet/50"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded bg-magic/20 font-bold text-magic">
                                    {logo.placeholder}
                                </div>
                                <span className="text-sm font-medium whitespace-nowrap text-tome dark:text-parchment">{logo.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full overflow-hidden bg-jet/10 py-8 dark:bg-parchment/10">
            <div className="mx-auto max-w-screen-2xl px-4">
                <p className="mb-4 text-center text-base font-medium text-tome dark:text-parchment/70 font-serif">Built for use with</p>
            </div>
            <div ref={containerRef} className="relative overflow-hidden">
                <motion.div
                    className="flex gap-12"
                    animate={{
                        x: containerWidth > 0 ? [0, -containerWidth] : 0,
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 30,
                            ease: 'linear',
                        },
                    }}
                >
                    {/* Double the items for seamless loop */}
                    {[...trustLogos, ...trustLogos].map((logo, index) => (
                        <div
                            key={`${logo.name}-${index}`}
                            className="flex shrink-0 items-center gap-3 rounded-lg border border-tome/20 bg-parchment-100/50 px-6 py-3 dark:border-parchment/20 dark:bg-jet/50"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded bg-magic/20 font-bold text-magic">
                                {logo.placeholder}
                            </div>
                            <span className="text-sm font-medium whitespace-nowrap text-tome dark:text-parchment">{logo.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
