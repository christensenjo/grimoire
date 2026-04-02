import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import AppearanceToggleTab from '@/components/appearance-tabs';
import { AppHeader } from '@/components/app-header';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import CTASection from '@/components/cta-section';
import DashboardPreview from '@/components/dashboard-preview';
import DeleteUser from '@/components/delete-user';
import Features from '@/components/features';
import Footer from '@/components/footer';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import HowItWorks from '@/components/how-it-works';
import { Icon as AppIcon } from '@/components/icon';
import Integrations from '@/components/integrations';
import InputError from '@/components/input-error';
import { Lombardic } from '@/components/lombardic';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import Pricing from '@/components/pricing';
import PublicNav from '@/components/public-nav';
import TextLink from '@/components/text-link';
import TrustBanner from '@/components/trust-banner';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import WhyChooseUs from '@/components/why-choose-us';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon as UiIcon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem as BreadcrumbItemType, type NavGroup, type NavItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Bell,
    BookOpen,
    ChevronRight,
    FileText,
    LayoutGrid,
    MessageSquare,
    MoveLeft,
    MoveRight,
    Settings,
    Sparkles,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItemType[] = [
    {
        title: 'Components',
        href: '/components',
    },
];

const demoBreadcrumbs: BreadcrumbItemType[] = [
    { title: 'Library', href: '/library' },
    { title: 'Characters', href: '/library/characters' },
    { title: 'Aldren the Sage', href: '/library/characters/aldrin' },
];

const demoNavGroups: NavGroup[] = [
    {
        title: 'Workspace',
        items: [
            { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            { title: 'Library', href: '/library', icon: BookOpen },
        ],
    },
    {
        title: 'AI Companion',
        items: [
            { title: 'Story Seeds', href: '#', icon: Sparkles, disabled: true },
        ],
    },
];

const demoNavFooterItems: NavItem[] = [
    { title: 'Settings', href: '/settings/profile', icon: Settings },
    { title: 'Feedback', href: 'https://example.com', icon: MessageSquare, isExternal: true },
];

function PlaygroundSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-4">
            <div>
                <h2 className="text-xl font-semibold text-tome dark:text-parchment">{title}</h2>
                {description && <p className="text-sm text-tome/70 dark:text-parchment/70">{description}</p>}
            </div>
            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{children}</div>
        </section>
    );
}

function DemoCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card className="border-tome/10 bg-parchment-50 dark:border-parchment/10 dark:bg-jet/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-base text-tome dark:text-parchment">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
}

export default function Components() {
    const { auth } = usePage<SharedData>().props;
    const [dropdownChecked, setDropdownChecked] = useState(true);
    const [dropdownRadio, setDropdownRadio] = useState('system');
    const [toggleGroupValue, setToggleGroupValue] = useState('left');
    const [collapsibleOpen, setCollapsibleOpen] = useState(true);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Components" />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-x-hidden rounded-xl bg-parchment p-6 text-tome shadow-sm dark:bg-jet dark:text-parchment">
                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-medium text-tome/70 dark:text-parchment/70 font-serif">Component Playground</p>
                        <h1 className="text-balance text-3xl font-semibold font-serif">
                            <Lombardic text="Inspect and tweak every UI building block" />
                        </h1>
                        <p className="max-w-3xl text-pretty text-sm text-tome/70 dark:text-parchment/70 font-serif">
                            This page renders every component so you can inspect styles and interactions in one place. The background swaps
                            between parchment and jet based on theme.
                        </p>
                    </div>
                    <Separator />
                </section>

                <PlaygroundSection title="App components" description="App-specific building blocks and helpers.">
                    <DemoCard title="App Header">
                        <AppHeader breadcrumbs={demoBreadcrumbs} />
                    </DemoCard>
                    <DemoCard title="Branding">
                        <div className="flex items-center gap-4">
                            <AppLogo />
                            <AppLogoIcon className="h-10 w-10" />
                        </div>
                    </DemoCard>
                    <DemoCard title="Headings">
                        <Lombardic text="Title text" className="text-3xl font-semibold font-serif" letterClassName="text-xl tracking-wide" />
                        <Heading title="Quest log" description="Keep track of your current objectives." />
                        <HeadingSmall title="Side quests" description="Optional tasks and lore hooks." />
                    </DemoCard>
                    <DemoCard title="Breadcrumbs">
                        <Breadcrumbs breadcrumbs={demoBreadcrumbs} />
                    </DemoCard>
                    <DemoCard title="User info">
                        <UserInfo user={auth.user} showEmail />
                    </DemoCard>
                    <DemoCard title="User menu content">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Open user menu</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64" align="start">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </DemoCard>
                    <DemoCard title="Navigation blocks">
                        <div className="flex flex-col gap-4">
                            <NavMain groups={demoNavGroups} />
                            <NavFooter items={demoNavFooterItems} />
                        </div>
                    </DemoCard>
                    <DemoCard title="Sidebar user">
                        <NavUser />
                    </DemoCard>
                    <DemoCard title="Appearance toggles">
                        <div className="flex flex-wrap items-center gap-3">
                            <AppearanceToggleDropdown />
                            <AppearanceToggleTab />
                        </div>
                    </DemoCard>
                    <DemoCard title="Helpers">
                        <div className="flex flex-col gap-2">
                            <TextLink href={route('features')}>Learn more about features</TextLink>
                            <InputError message="This field is required." />
                            <AppIcon iconNode={Bell} className="h-5 w-5 text-magic" />
                        </div>
                    </DemoCard>
                    <DemoCard title="Delete user flow">
                        <DeleteUser />
                    </DemoCard>
                </PlaygroundSection>

                <PlaygroundSection title="UI components" description="Shadcn/Base UI building blocks.">
                    <DemoCard title="Alert">
                        <Alert>
                            <Sparkles className="h-4 w-4" />
                            <AlertTitle>New quest available</AlertTitle>
                            <AlertDescription>Visit the guild hall to start your next adventure.</AlertDescription>
                        </Alert>
                    </DemoCard>
                    <DemoCard title="Avatar">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                <AvatarFallback>AA</AvatarFallback>
                            </Avatar>
                            <Avatar className="h-12 w-12">
                                <AvatarFallback>GM</AvatarFallback>
                            </Avatar>
                        </div>
                    </DemoCard>
                    <DemoCard title="Badge">
                        <div className="flex flex-wrap gap-2">
                            <Badge>Primary</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="destructive">Danger</Badge>
                        </div>
                    </DemoCard>
                    <DemoCard title="Breadcrumb">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/library">Library</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbEllipsis />
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/library/characters">Characters</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Aldren</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </DemoCard>
                    <DemoCard title="Button">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button>Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                            <Button size="icon" aria-label="Icon button">
                                <Sparkles className="h-4 w-4" />
                            </Button>
                        </div>
                    </DemoCard>
                    <DemoCard title="Card">
                        <Card className="border-tome/10 bg-parchment dark:border-parchment/10 dark:bg-jet">
                            <CardHeader>
                                <CardTitle>Explorer notes</CardTitle>
                                <CardDescription>Recent discoveries from your sessions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-tome/70 dark:text-parchment/70">
                                    Track campaign lore, NPC details, and location changes.
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button size="sm">Open notes</Button>
                            </CardFooter>
                        </Card>
                    </DemoCard>
                    <DemoCard title="Checkbox">
                        <div className="flex items-center gap-2">
                            <Checkbox id="subscribe" defaultChecked />
                            <Label htmlFor="subscribe">Notify me about new lore drops</Label>
                        </div>
                    </DemoCard>
                    <DemoCard title="Collapsible">
                        <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen}>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Quick summary</p>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        {collapsibleOpen ? 'Hide' : 'Show'}
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="mt-2 text-sm text-tome/70 dark:text-parchment/70">
                                Your party is camped outside the Crystal Pass, preparing for the next encounter.
                            </CollapsibleContent>
                        </Collapsible>
                    </DemoCard>
                    <DemoCard title="Dialog">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Open dialog</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New campaign</DialogTitle>
                                    <DialogDescription>Create a fresh setting for your next adventure.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-2">
                                    <Label htmlFor="campaign-name">Campaign name</Label>
                                    <Input id="campaign-name" placeholder="Shadows of Eldoria" />
                                </div>
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    <Button>Create</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </DemoCard>
                    <DemoCard title="Dropdown menu">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Open menu</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Profile</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <UserRound />
                                        View profile
                                    </DropdownMenuItem>
                                    <DropdownMenuCheckboxItem checked={dropdownChecked} onCheckedChange={() => setDropdownChecked((value) => !value)}>
                                        Enable alerts
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={dropdownRadio} onValueChange={setDropdownRadio}>
                                    <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>
                                            <FileText />
                                            Export
                                            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </DemoCard>
                    <DemoCard title="Icon">
                        <div className="flex items-center gap-3">
                            <UiIcon iconNode={Bell} className="h-6 w-6 text-magic" />
                            <AppIcon iconNode={ChevronRight} className="h-6 w-6 text-armor" />
                        </div>
                    </DemoCard>
                    <DemoCard title="Input and label">
                        <div className="grid gap-2">
                            <Label htmlFor="name">World name</Label>
                            <Input id="name" placeholder="Eldoria" />
                        </div>
                    </DemoCard>
                    <DemoCard title="Navigation menu">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="grid gap-2 p-3">
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                <span className="text-sm font-medium">Locations</span>
                                                <span className="text-xs text-muted-foreground">Browse maps and regions</span>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                                <span className="text-sm font-medium">Characters</span>
                                                <span className="text-xs text-muted-foreground">Meet your party and NPCs</span>
                                            </NavigationMenuLink>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Docs</NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                            <NavigationMenuIndicator />
                        </NavigationMenu>
                    </DemoCard>
                    <DemoCard title="Placeholder pattern">
                        <div className="relative h-24 overflow-hidden rounded-md border border-dashed border-tome/30 dark:border-parchment/20">
                            <PlaceholderPattern className="h-full w-full text-tome/20 dark:text-parchment/20" />
                            <div className="absolute inset-0 flex items-center justify-center text-xs text-tome/60 dark:text-parchment/60">
                                Empty state
                            </div>
                        </div>
                    </DemoCard>
                    <DemoCard title="Select">
                        <Select defaultValue="arcane">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a school" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Arcane arts</SelectLabel>
                                    <SelectItem value="arcane">Arcane</SelectItem>
                                    <SelectItem value="divine">Divine</SelectItem>
                                    <SelectItem value="primal">Primal</SelectItem>
                                    <SelectSeparator />
                                    <SelectItem value="void">Void</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </DemoCard>
                    <DemoCard title="Separator">
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-tome/70 dark:text-parchment/70">Left</span>
                            <Separator className="flex-1" />
                            <span className="text-xs text-tome/70 dark:text-parchment/70">Right</span>
                        </div>
                    </DemoCard>
                    <DemoCard title="Sheet">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline">Open sheet</Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetHeader>
                                    <SheetTitle>Notifications</SheetTitle>
                                    <SheetDescription>Recent updates from your campaigns.</SheetDescription>
                                </SheetHeader>
                                <div className="space-y-3 p-4">
                                    <div className="rounded-md border border-border p-3 text-sm">New entry added to Eldoria</div>
                                    <div className="rounded-md border border-border p-3 text-sm">Lyra leveled up</div>
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button variant="secondary">Close</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </DemoCard>
                    <DemoCard title="Sidebar (all subcomponents)">
                        <div className="h-[360px] overflow-hidden rounded-lg border border-tome/10 bg-parchment-50 dark:border-parchment/10 dark:bg-jet/50">
                            <SidebarProvider defaultOpen className="min-h-0 h-full">
                                <Sidebar collapsible="none">
                                    <SidebarHeader>
                                        <SidebarMenu>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton tooltip="Dashboard" variant="ghost" className="justify-start">
                                                    <LayoutGrid className="size-4" />
                                                    Dashboard
                                                </SidebarMenuButton>
                                                <SidebarMenuAction>
                                                    <Settings className="size-4" />
                                                </SidebarMenuAction>
                                                <SidebarMenuBadge>3</SidebarMenuBadge>
                                            </SidebarMenuItem>
                                        </SidebarMenu>
                                        <SidebarInput placeholder="Search..." />
                                    </SidebarHeader>
                                    <SidebarSeparator />
                                    <SidebarContent>
                                        <SidebarGroup>
                                            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                                            <SidebarGroupAction>
                                                <Sparkles className="size-4" />
                                            </SidebarGroupAction>
                                            <SidebarGroupContent>
                                                <SidebarMenu>
                                                    <SidebarMenuItem>
                                                        <SidebarMenuButton isActive tooltip="Overview">
                                                            Overview
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                    <SidebarMenuItem>
                                                        <SidebarMenuButton tooltip="Settings">Settings</SidebarMenuButton>
                                                        <SidebarMenuSub>
                                                            <SidebarMenuSubItem>
                                                                <SidebarMenuSubButton size="sm">Profile</SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        </SidebarMenuSub>
                                                    </SidebarMenuItem>
                                                </SidebarMenu>
                                            </SidebarGroupContent>
                                        </SidebarGroup>
                                        <SidebarMenuSkeleton showIcon />
                                    </SidebarContent>
                                    <SidebarFooter>
                                        <SidebarMenu>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton tooltip="Log out">Log out</SidebarMenuButton>
                                            </SidebarMenuItem>
                                        </SidebarMenu>
                                    </SidebarFooter>
                                    <SidebarRail className="hidden" />
                                </Sidebar>
                                <SidebarInset className="flex min-h-0 h-full flex-1 flex-col gap-3 p-4">
                                    <div className="flex items-center gap-2">
                                        <SidebarTrigger />
                                        <p className="text-sm text-tome/70 dark:text-parchment/70">Toggle sidebar</p>
                                    </div>
                                    <p className="text-sm text-tome/70 dark:text-parchment/70">
                                        SidebarInset keeps the content aligned with the sidebar layout.
                                    </p>
                                </SidebarInset>
                            </SidebarProvider>
                        </div>
                    </DemoCard>
                    <DemoCard title="Skeleton">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </DemoCard>
                    <DemoCard title="Tabs">
                        <Tabs defaultValue="overview">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="stats">Stats</TabsTrigger>
                                <TabsTrigger value="notes">Notes</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview">Summary of the setting.</TabsContent>
                            <TabsContent value="stats">Key metrics and campaign status.</TabsContent>
                            <TabsContent value="notes">Lore notes and highlights.</TabsContent>
                        </Tabs>
                    </DemoCard>
                    <DemoCard title="Toggle">
                        <div className="flex items-center gap-2">
                            <Toggle aria-label="Toggle left">
                                <MoveLeft />
                            </Toggle>
                            <Toggle variant="outline" aria-label="Toggle right">
                                <MoveRight />
                            </Toggle>
                        </div>
                    </DemoCard>
                    <DemoCard title="Toggle group">
                        <ToggleGroup
                            type="single"
                            value={toggleGroupValue}
                            onValueChange={(value) => value && setToggleGroupValue(value)}
                            variant="outline"
                        >
                            <ToggleGroupItem value="left" aria-label="Align left">
                                <MoveLeft />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="right" aria-label="Align right">
                                <MoveRight />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </DemoCard>
                    <DemoCard title="Tooltip">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline">Hover me</Button>
                                </TooltipTrigger>
                                <TooltipContent>Tooltip content</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </DemoCard>
                </PlaygroundSection>

                <section className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-semibold text-tome dark:text-parchment">Marketing sections</h2>
                        <p className="text-sm text-tome/70 dark:text-parchment/70">Full-width sections used on public pages.</p>
                    </div>
                    <div className="flex flex-col gap-8 rounded-xl border border-tome/10 bg-parchment-50 p-4 dark:border-parchment/10 dark:bg-jet/50">
                        <PublicNav />
                        <TrustBanner />
                        <Features />
                        <HowItWorks />
                        <Integrations />
                        <WhyChooseUs />
                        <Pricing />
                        <CTASection />
                        <DashboardPreview />
                        <Footer />
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
