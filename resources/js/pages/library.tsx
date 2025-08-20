import { Head } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';

export default function Library() {
	return (
		<>
			<Head title="Home" />
			<PublicLayout>
				<div className="flex flex-col items-center justify-center max-w-screen-lg mx-auto px-4 py-12">
					<h1 className="text-5xl text-white font-serif mb-8 text-center">Library...</h1>
					<div className="w-full">
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut maximus enim, vitae facilisis erat. Curabitur volutpat ut turpis in hendrerit. Aenean interdum congue dui, suscipit commodo purus pellentesque porttitor. Sed euismod egestas nulla, quis gravida arcu malesuada eu. Etiam egestas tellus enim, eget faucibus purus blandit id. Integer ultricies, mi in interdum aliquet, erat lacus commodo nisl, eu porttitor lacus lacus non ex. Morbi molestie purus eget erat laoreet varius.
						</p>
					</div>
				</div>
			</PublicLayout>
		</>
	);
}