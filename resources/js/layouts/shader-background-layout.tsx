import { useEffect, useState, type PropsWithChildren } from 'react';
import { FilmGrain, Shader, SolidColor } from 'shaders/react';

import PublicNav from '@/components/public-nav';
import { useAppearance } from '@/hooks/use-appearance';

type ShaderBackgroundLayoutProps = PropsWithChildren<{
    showNav?: boolean;
}>;

export default function ShaderBackgroundLayout({ children, showNav = true }: ShaderBackgroundLayoutProps) {
    const { isDark } = useAppearance();
    const [mounted, setMounted] = useState(false);
    const shaderColor = isDark ? '#13181B' : '#F8F7F2';
    const filmGrainStrength = isDark ? 0.03 : 1;

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative min-h-dvh w-full overflow-hidden">
            <div
                className="pointer-events-none fixed inset-0 z-0"
                style={{ backgroundColor: shaderColor }}
            >
                {mounted ? (
                    <Shader className="size-full">
                        <SolidColor color={shaderColor} />
                        <FilmGrain strength={filmGrainStrength} />
                    </Shader>
                ) : null}
            </div>

            {showNav ? (
                <div className="relative z-10">
                    <PublicNav />
                </div>
            ) : null}

            <div className="relative z-10">{children}</div>
        </div>
    );
}
