import { Head } from '@inertiajs/react';
import { OmbreSynthesis7 } from '@ombre-ui/react';
import PublicNav from '@/components/public-nav';
import DitheredHeroBook from '@/components/rive/dithered-hero-book';

export default function Welcome() {

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
					<section className="w-full flex flex-row items-center justify-center pt-24 pb-20 md:pt-32 md:pb-28 gap-16">
						<div className="flex flex-col items-center justify-center">
							<h1 className="text-5xl md:text-6xl text-white font-title mb-2 leading-tight drop-shadow-lg">
								What lore lies within your Grimoire?
							</h1>
							<p className="text-lg text-white/70">
								Use a universal worldbuilding tool to elevate your storytelling. Tailored for the imaginative mind.
							</p>
						</div>
						<div className="flex items-center justify-center">
							<DitheredHeroBook className="w-[320px] h-[320px] md:w-[400px] md:h-[400px] drop-shadow-2xl" />
						</div>
					</section>
					<div className="w-full hidden">
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut maximus enim, vitae facilisis erat. Curabitur volutpat ut turpis in hendrerit. Aenean interdum congue dui, suscipit commodo purus pellentesque porttitor. Sed euismod egestas nulla, quis gravida arcu malesuada eu. Etiam egestas tellus enim, eget faucibus purus blandit id. Integer ultricies, mi in interdum aliquet, erat lacus commodo nisl, eu porttitor lacus lacus non ex. Morbi molestie purus eget erat laoreet varius.
						</p>
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							Curabitur pretium ultricies eros, ac hendrerit velit venenatis venenatis. Cras laoreet, quam nec vehicula tristique, velit ante ullamcorper nulla, congue tempor risus enim a nibh. Quisque nec dolor justo. Mauris in varius nulla. Vivamus lobortis est et lorem sodales, vel dapibus odio posuere. Donec cursus nibh a hendrerit pharetra. Duis efficitur at turpis a gravida. Pellentesque condimentum eros eget elit auctor hendrerit. Sed sit amet lacus est. Curabitur id turpis non neque consequat ullamcorper. Quisque consequat non augue non dictum. Nunc ullamcorper odio ac tortor tincidunt, quis tristique nisl sodales. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce vitae interdum lectus.
						</p>
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							Sed maximus enim a fermentum scelerisque. Aenean a tortor purus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce cursus imperdiet orci, nec sagittis quam feugiat venenatis. Phasellus condimentum ullamcorper diam, porta imperdiet lorem pulvinar lobortis. Nam vel urna nisl. Suspendisse quis lobortis sem, eu consequat magna. Integer vulputate convallis sem ut tincidunt. Cras interdum non eros id porta. Praesent semper tortor vel justo rhoncus pellentesque. Vestibulum lacinia nunc et erat vehicula, sit amet hendrerit purus pharetra. Vivamus sollicitudin varius placerat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
						</p>
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							Vivamus et interdum lectus, eget hendrerit quam. Donec sodales porta pretium. Aliquam maximus efficitur odio scelerisque gravida. Cras in tempor ligula. Aenean ac ultrices justo, nec porta eros. Curabitur velit metus, tincidunt eget rutrum quis, tincidunt eget odio. Nullam faucibus nulla vel massa placerat, non finibus elit consequat. Suspendisse vitae turpis felis. Aenean purus felis, volutpat in lectus a, euismod volutpat lectus. Maecenas fringilla libero nec dictum posuere. Sed lorem magna, tempor quis tincidunt sit amet, cursus at enim. Sed semper nisl tellus, non suscipit ligula faucibus id. Fusce ac diam in eros aliquam convallis. Vestibulum tincidunt tortor dui, eu rhoncus felis lacinia et. Ut tincidunt justo in nisl molestie, eget tempus urna dictum.
						</p>
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							Mauris diam risus, tempor eu vestibulum sed, elementum et sem. Phasellus viverra odio at mauris mollis sodales. Nam sed augue at mauris malesuada consequat. Donec placerat erat massa, ac lobortis lectus facilisis non. Vestibulum a accumsan libero. In ultrices dictum diam. Maecenas rutrum ligula augue, in congue ligula dapibus nec. Aenean sed massa at mi vestibulum sollicitudin eu sit amet enim. Nunc arcu tortor, molestie a luctus nec, gravida at dolor.
						</p>
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							Vestibulum tincidunt elit a tortor mattis placerat. Suspendisse non mollis nisi. Mauris eget consequat felis. Vestibulum sed sapien at tortor suscipit tincidunt. Pellentesque varius urna in mi commodo luctus. Maecenas sit amet lorem et tortor dignissim sagittis. Maecenas molestie risus vel erat venenatis cursus. Sed fermentum nec neque eleifend viverra. Integer metus tellus, tempor sit amet efficitur ac, hendrerit vitae nisi. Vivamus lectus lorem, faucibus a vestibulum et, tincidunt condimentum leo.
						</p>
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							Suspendisse et ornare ipsum. Phasellus ultrices, elit pellentesque auctor aliquet, dolor ex convallis ipsum, at dictum ipsum enim sed justo. Nunc id sem quis erat varius molestie. Nunc eu nulla mauris. Ut egestas nulla purus, sit amet elementum augue scelerisque a. Vivamus mattis urna ante, non ultricies sem mattis eget. Integer vehicula leo nec rhoncus lacinia. Cras varius enim ac tempor congue. Nullam eros odio, auctor sed ex eget, pharetra gravida augue. Aliquam sed lorem turpis. Phasellus consequat sit amet nibh a fermentum.
						</p>
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							In rutrum nunc velit, sit amet bibendum felis semper sit amet. Vivamus maximus, ante ac pharetra feugiat, turpis dui pretium justo, et lobortis quam sem in quam. Sed tristique tristique dolor, nec semper libero porttitor elementum. Etiam dictum elementum libero sed molestie. Fusce quis luctus ex. Donec interdum ac dolor ut fringilla. Sed pharetra pulvinar nulla et posuere. Morbi dignissim eleifend elit in ultricies. Mauris sed sapien eros. Vestibulum id mollis eros. Quisque quis felis porttitor massa gravida sagittis nec et elit. Proin nisl tellus, rhoncus nec maximus ut, posuere nec ligula.
						</p>
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							Nunc vehicula bibendum ex et aliquet. Aenean sed vulputate nunc. Duis venenatis diam eu orci condimentum, ultricies interdum erat vulputate. Vivamus efficitur nisl a augue convallis, in suscipit neque tempor. Duis porttitor maximus leo, et varius magna porttitor facilisis. Mauris nisi arcu, elementum ac quam quis, dignissim hendrerit enim. Maecenas viverra blandit laoreet. Cras laoreet, eros nec convallis tincidunt, eros ante ullamcorper orci, eu ullamcorper nisi enim id felis. Suspendisse rutrum nibh diam, a volutpat lorem gravida ut. In non massa quis massa consectetur faucibus vel vitae eros. Cras pharetra malesuada lacus, sed placerat purus cursus vel. Nullam ac diam id arcu elementum sagittis at ac justo. Cras id orci non velit tristique venenatis a in arcu. Nunc quis venenatis ligula.
						</p>
						<p className="mb-6 leading-relaxed text-lg text-white/90">
							In laoreet viverra tellus, vitae accumsan urna consectetur quis. Suspendisse potenti. Pellentesque quis ipsum sapien. Fusce non erat in nisi blandit tempor dapibus id purus. Aliquam sagittis sodales placerat. Vivamus sit amet maximus ipsum. Nunc nisi mauris, aliquet at erat vel, maximus ullamcorper risus.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}


