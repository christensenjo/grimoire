import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthImageLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const titleFirstLetter = title?.[0]?.toUpperCase() ?? '';
    const titleRemainder = title?.slice(1) ?? '';

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <div className="grid overflow-hidden rounded-xl border bg-background/90 md:grid-cols-2">
                    <div className="flex flex-col gap-6 p-6 md:p-10">
                        <Link href={route('home')} className="flex items-center gap-2 font-medium">
                            <div className="flex h-9 w-9 items-center justify-center">
                                <img
                                    src="/images/logos/castlebooks_square/castlebook_jet.svg"
                                    alt="Castlebooks logo"
                                    className="h-9 w-9 dark:hidden"
                                />
                                <img
                                    src="/images/logos/castlebooks_square/castlebook_parchment.svg"
                                    alt="Castlebooks logo"
                                    className="hidden h-9 w-9 dark:block"
                                />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2">
                            {title && (
                                <h1 className="text-xl font-medium">
                                    <span className="font-title-shaded text-3xl leading-none">{titleFirstLetter}</span>
                                    {titleRemainder}
                                </h1>
                            )}
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>

                        {children}
                    </div>
                    <div className="relative hidden md:block">
                        <img
                            src="/images/hero-placeholder.svg"
                            alt="Authentication illustration"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
