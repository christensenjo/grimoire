import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import ShaderBackgroundLayout from '@/layouts/shader-background-layout';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <ShaderBackgroundLayout showNav={false}>
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </ShaderBackgroundLayout>
    );
}
