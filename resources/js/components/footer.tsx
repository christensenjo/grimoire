import { Link } from '@inertiajs/react';
import { Github, Mail, MessageCircle, Twitter } from 'lucide-react';

const footerLinks = {
    product: [
        { label: 'Features', href: route('features') },
        { label: 'Pricing', href: route('pricing') },
        { label: 'Library', href: route('library') },
        { label: 'Integrations', href: route('integrations') },
    ],
    company: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
    ],
    resources: [
        { label: 'Documentation', href: '#' },
        { label: 'Templates', href: '#' },
        { label: 'Community', href: '#' },
        { label: 'Support', href: '#' },
    ],
    legal: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookie Policy', href: '#' },
    ],
};

const socialLinks = [
    { label: 'Twitter', href: '#', icon: Twitter },
    { label: 'GitHub', href: '#', icon: Github },
    { label: 'Discord', href: '#', icon: MessageCircle },
    { label: 'Email', href: '#', icon: Mail },
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-tome/10 bg-parchment-100 py-12 dark:border-parchment/10 dark:bg-jet">
            <div className="mx-auto max-w-screen-2xl px-4">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
                    {/* Logo and description */}
                    <div className="lg:col-span-2">
                        <Link href={route('home')} className="mb-4 inline-flex items-center gap-2 font-title text-2xl text-tome dark:text-parchment">
                            <img
                                src="/images/logos/castlebooks_square/castlebook_parchment.svg"
                                alt="Grimoire Logo"
                                className="hidden h-8 w-8 dark:block"
                            />
                            <img
                                src="/images/logos/castlebooks_square/castlebook_jet.svg"
                                alt="Grimoire Logo"
                                className="block h-8 w-8 dark:hidden"
                            />
                            Grimoire
                        </Link>
                        <p className="mb-4 text-sm text-tome/70 dark:text-parchment/70 font-serif">
                            The modern worldbuilding platform for storytellers, dungeon masters, and creative minds.
                        </p>
                        {/* Social links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-tome/20 text-tome transition-all hover:border-magic hover:text-magic dark:border-parchment/20 dark:text-parchment"
                                        aria-label={social.label}
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="mb-4 font-semibold text-tome dark:text-parchment font-serif">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-tome/70 transition-colors hover:text-magic dark:text-parchment/70">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-tome dark:text-parchment font-serif">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-tome/70 transition-colors hover:text-magic dark:text-parchment/70">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-tome dark:text-parchment font-serif">Resources</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-tome/70 transition-colors hover:text-magic dark:text-parchment/70">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-tome dark:text-parchment font-serif">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-tome/70 transition-colors hover:text-magic dark:text-parchment/70">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-tome/10 pt-8 md:flex-row dark:border-parchment/10">
                    <p className="text-sm text-tome/60 dark:text-parchment/60">Copyright 2026 Grimoire. All Rights Reserved.</p>
                    <p className="text-sm text-tome/60 dark:text-parchment/60">
                        Made with{' '}
                        <span className="text-magic" aria-label="love">
                            ♥
                        </span>{' '}
                        for worldbuilders everywhere
                    </p>
                </div>
            </div>
        </footer>
    );
}
