import { useRive } from '@rive-app/react-canvas';

interface DitheredHeroBookProps {
    className?: string;
}

export default function DitheredHeroBook({ className }: DitheredHeroBookProps) {
    const { rive, RiveComponent } = useRive({
        src: '/assets/dither_effect.riv',
        artboard: "Artboard 2",
        stateMachines: "Default",
        autoplay: true,
    });

return (
    <RiveComponent
        className={className}
        onMouseEnter={() => rive && rive.play()}
        onMouseLeave={() => rive && rive.pause()}
    />
);
}