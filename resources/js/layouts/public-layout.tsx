import type { PropsWithChildren } from 'react';

import PublicNav from '@/components/public-nav';

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="relative min-h-screen w-full bg-background">
            <PublicNav />

            <div className="relative z-10">{children}</div>
        </div>
    );
}
