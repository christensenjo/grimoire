import AuthImageLayout from '@/layouts/auth/auth-image-layout';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import ShaderBackgroundLayout from '@/layouts/shader-background-layout';

type AuthLayoutVariant = 'default' | 'image';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    variant?: AuthLayoutVariant;
}

export default function AuthLayout({ children, title, description, variant = 'default', ...props }: AuthLayoutProps) {
    const LayoutComponent = variant === 'image' ? AuthImageLayout : AuthLayoutTemplate;

    return (
        <ShaderBackgroundLayout showNav={false}>
            <LayoutComponent title={title} description={description} {...props}>
                {children}
            </LayoutComponent>
        </ShaderBackgroundLayout>
    );
}
