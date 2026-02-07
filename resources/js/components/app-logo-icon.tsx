import { cn } from '@/lib/utils';
import { type ComponentPropsWithoutRef } from 'react';

export default function AppLogoIcon({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
    return (
        <div className={cn('flex aspect-square items-center justify-center', className)} {...props}>
            <img
                src="/images/logos/castlebooks_square/castlebook_jet.svg"
                alt="Castlebooks logo"
                className="size-full dark:hidden"
            />
            <img
                src="/images/logos/castlebooks_square/castlebook_parchment.svg"
                alt="Castlebooks logo"
                className="hidden size-full dark:block"
            />
        </div>
    );
}
