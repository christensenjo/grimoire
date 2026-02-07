import { cn } from '@/lib/utils';

interface LombardicProps {
    text: string;
    className?: string;
    letterClassName?: string;
}

export function Lombardic({ text, className, letterClassName }: LombardicProps) {
    if (!text) {
        return null;
    }

    const [firstLetter, ...rest] = Array.from(text);

    return (
        <span className={className}>
            <span className={cn('font-title', letterClassName)}>{firstLetter}</span>
            {rest.join('')}
        </span>
    );
}
