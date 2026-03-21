

export function formatPremiereDate(iso?: string): string | undefined {
    if (!iso) return undefined;

    try {
        return new Intl.DateTimeFormat("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(iso));
    } catch {
        return undefined;
    }
}
