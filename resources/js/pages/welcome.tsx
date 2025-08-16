import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import DitheredHeroBook from '@/components/rive/dithered-hero-book';

export default function Welcome() {
	return (
		<>
			<Head title="Home" />
			<PublicLayout>
				{/* Content */}
				<div className="flex flex-col items-center justify-center max-w-screen-2xl mx-auto px-4 py-12">
					<section className="w-full flex flex-row items-center justify-center pt-24 pb-20 md:pt-32 md:pb-28 gap-16">
						<div className="flex flex-col items-start justify-center gap-4">
							<h1 className="text-5xl md:text-6xl text-black dark:text-white mb-2 leading-tighter drop-shadow-lg">
								<span className="font-title-shaded text-[96px]">W</span>hat lore lies within your Grimoire?
							</h1>
							<p className="text-lg text-black/70 dark:text-white/70">
								Use a universal worldbuilding tool to elevate your storytelling. Tailored for the imaginative mind.
							</p>
						</div>
						<div className="flex items-center justify-center w-1/2">
							<DitheredHeroBook className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] drop-shadow-2xl" />
						</div>
					</section>
				</div>
			</PublicLayout>
		</>
	);
}


