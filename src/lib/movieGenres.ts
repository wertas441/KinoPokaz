
export const MOVIE_GENRE_OPTIONS = [
    { slug: "драма", label: "Драма" },
    { slug: "комедия", label: "Комедия" },
    { slug: "боевик", label: "Боевик" },
    { slug: "триллер", label: "Триллер" },
    { slug: "фантастика", label: "Фантастика" },
    { slug: "приключения", label: "Приключения" },
    { slug: "криминал", label: "Криминал" },
    { slug: "детектив", label: "Детектив" },
    { slug: "ужасы", label: "Ужасы" },
    { slug: "мелодрама", label: "Мелодрама" },
    { slug: "семейный", label: "Семейный" },
    { slug: "мультфильм", label: "Мультфильм" },
    { slug: "военный", label: "Военный" },
    { slug: "биография", label: "Биография" },
    { slug: "история", label: "История" },
] as const;

export type MovieGenreSlug = (typeof MOVIE_GENRE_OPTIONS)[number]["slug"];

export function parseGenreParam(raw: string): MovieGenreSlug | undefined {
    const t = raw.trim().toLowerCase();

    const found = MOVIE_GENRE_OPTIONS.find((g) => g.slug === t || g.label.toLowerCase() === t);
    return found?.slug;
}
