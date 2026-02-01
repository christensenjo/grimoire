import PublicLayout from '@/layouts/public-layout';
import { Head } from '@inertiajs/react';

export default function Integrations() {
    return (
        <>
            <Head title="Integrations" />
            <PublicLayout>
                <div className="mx-auto flex max-w-screen-lg flex-col items-center justify-center px-4 py-12">
                    <h1 className="mb-8 text-center font-serif text-5xl text-black dark:text-white">Integrations</h1>
                    <div className="w-full">
                        <p className="mb-6 text-lg leading-relaxed text-black/80 dark:text-white/80">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut maximus enim, vitae facilisis erat. Curabitur
                            volutpat ut turpis in hendrerit. Aenean interdum congue dui, suscipit commodo purus pellentesque porttitor. Sed euismod
                            egestas nulla, quis gravida arcu malesuada eu. Etiam egestas tellus enim, eget faucibus purus blandit id. Integer
                            ultricies, mi in interdum aliquet, erat lacus commodo nisl, eu porttitor lacus lacus non ex. Morbi molestie purus eget
                            erat laoreet varius.
                        </p>
                    </div>
                </div>
            </PublicLayout>
        </>
    );
}
