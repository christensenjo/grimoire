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
            <h1 className="mt-1 ml-2 grid flex-1 text-left text-3xl font-title-shaded">
                Grimoire
            </h1>
        </>
    );
}
