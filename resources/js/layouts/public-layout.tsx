import { OmbreSynthesis7 } from '@ombre-ui/react';
import PublicNav from '@/components/public-nav';
import { useAppearance } from '@/hooks/use-appearance';
import type { PropsWithChildren } from 'react';

export default function PublicLayout({ children }: PropsWithChildren) {
	const { appearance } = useAppearance();
	const ombreColor = appearance === 'light' ? '#F8F7F2' : '#13181B';

	console.log(appearance);

	return (appearance === 'light' ? (
		<div className="relative min-h-screen w-full bg-[#F8F7F2]">
			<div className="fixed inset-0 z-0 h-screen w-screen pointer-events-none mix-blend-color-dodge">
				<OmbreSynthesis7
					colorA="#13181B"
					colorB="#13181B"
					colorC="#13181B"
					colorD="#13181B"
					backgroundColor={ombreColor}
					frequency={0.01}
					speed={0.01}
					amplitude={0.01}
					smoothness={0.9}
				/>
			</div>

			<PublicNav />

			<div className="relative z-10">{children}</div>
		</div>
	) : (
		<div className="relative min-h-screen w-full bg-[#13181B]">
			<div className="fixed inset-0 z-0 h-screen w-screen pointer-events-none">
				<OmbreSynthesis7
					colorA="#13181B"
					colorB="#13181B"
					colorC="#13181B"
					colorD="#13181B"
					backgroundColor={ombreColor}
					frequency={0.01}
					speed={0.01}
					amplitude={0.01}
					smoothness={0.9}
				/>
			</div>

			<PublicNav />

			<div className="relative z-10">{children}</div>
		</div>
	));
}


