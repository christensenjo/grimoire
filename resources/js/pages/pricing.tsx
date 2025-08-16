import { Head } from '@inertiajs/react';
import { OmbreSynthesis7 } from '@ombre-ui/react';
import PublicNav from '@/components/public-nav';

export default function Pricing() {

	return (
		<>
			<Head title="Home" />
			<div className="relative min-h-screen w-full bg-[#13181B]">
				{/* Ombre background, fixed behind content */}
				<div className="fixed inset-0 z-0 h-screen w-screen pointer-events-none">
					<OmbreSynthesis7
						colorA="#13181B"
						colorB="#13181B"
						colorC="#13181B"
						colorD="#13181B"
						backgroundColor="#13181B"
						frequency={0.01}
						speed={0.01}
						amplitude={0.01}
						smoothness={0.9}
					/>
				</div>

				<PublicNav />

				{/* Content */}
				<div className="relative z-10 flex flex-col items-center justify-center max-w-screen-lg mx-auto px-4 py-12">
					<h1 className="text-5xl text-white font-sans mb-8 text-center">Pricing...</h1>
					<div className="w-full">
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut maximus enim, vitae facilisis erat. Curabitur volutpat ut turpis in hendrerit. Aenean interdum congue dui, suscipit commodo purus pellentesque porttitor. Sed euismod egestas nulla, quis gravida arcu malesuada eu. Etiam egestas tellus enim, eget faucibus purus blandit id. Integer ultricies, mi in interdum aliquet, erat lacus commodo nisl, eu porttitor lacus lacus non ex. Morbi molestie purus eget erat laoreet varius.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}