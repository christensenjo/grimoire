import { SidebarProvider } from '@/components/ui/sidebar';
import ShaderBackgroundLayout from '@/layouts/shader-background-layout';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppShell({ children, variant = 'header' }: AppShellProps) {
    const isOpen = usePage<SharedData>().props.sidebarOpen;

    if (variant === 'header') {
        return (
            <ShaderBackgroundLayout showNav={false}>
                <div className="flex min-h-dvh w-full flex-col">{children}</div>
            </ShaderBackgroundLayout>
        );
    }

    return (
        <ShaderBackgroundLayout showNav={false}>
            <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>
        </ShaderBackgroundLayout>
    );
}
