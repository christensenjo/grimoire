import PublicNav from '@/components/public-nav';
import { useAppearance } from '@/hooks/use-appearance';
import type { PropsWithChildren } from 'react';
import { FilmGrain, Shader, SolidColor } from 'shaders/react';

type ShaderBackgroundLayoutProps = PropsWithChildren<{
    showNav?: boolean;
}>;

export default function ShaderBackgroundLayout({ children, showNav = true }: ShaderBackgroundLayoutProps) {
    const { isDark } = useAppearance();
    const shaderColor = isDark ? '#13181B' : '#F8F7F2';
    const filmGrainStrength = isDark ? 0.03 : 1;

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-0 z-0">
                <Shader className="size-full">
                    <SolidColor color={shaderColor} />
                    <FilmGrain strength={filmGrainStrength} />
                </Shader>
            </div>

            {showNav && (
                <div className="relative z-10">
                    <PublicNav />
                </div>
            )}

            <div className="relative z-10">{children}</div>
        </div>
    );
}
