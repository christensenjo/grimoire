export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md">
                <img
                    src="/images/logos/castlebooks_square/castlebook_jet.svg"
                    alt="Castlebooks logo"
                    className="size-8 dark:hidden"
                />
                <img
                    src="/images/logos/castlebooks_square/castlebook_parchment.svg"
                    alt="Castlebooks logo"
                    className="hidden size-8 dark:block"
                />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">Grimoire</span>
                <span className="text-xs text-muted-foreground">Worldbuilding Studio</span>
            </div>
        </>
    );
}
