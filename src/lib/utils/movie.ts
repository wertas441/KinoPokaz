import type {MovieListRequestOptions} from "../../types/movie.ts";
import type {CompareMovie} from "../store/compareMovieStore.ts";

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

export function buildYearQuery(fromYear?: string, toYear?: string): string | undefined {
    const from = fromYear?.trim() ? parseInt(fromYear, 10) : NaN;
    const to = toYear?.trim() ? parseInt(toYear, 10) : NaN;

    if (!Number.isNaN(from) && !Number.isNaN(to)) return `${from}-${to}`;

    if (!Number.isNaN(from)) return `${from}-9999`;

    if (!Number.isNaN(to)) return `1874-${to}`;

    return undefined;
}

export function buildRatingKpQuery(fromRating?: string, toRating?: string): string | undefined {
    const from = fromRating?.trim() ? parseFloat(fromRating) : NaN;
    const to = toRating?.trim() ? parseFloat(toRating) : NaN;

    if (!Number.isNaN(from) && !Number.isNaN(to)) return `${from}-${to}`;

    if (!Number.isNaN(from)) return `${from}-10`;

    if (!Number.isNaN(to)) return `0-${to}`;

    return undefined;
}

export function getSortQueryParams(sortBy: MovieListRequestOptions["sortBy"]): Record<string, string> {
    switch (sortBy) {
        case "year": return {field: "year", type: "-1"};

        case "title": return {field: "title", type: "-1"};

        case "rating": return {field: "rating.kp", type: "-1"};

        default: return {field: "rating.kp", type: "-1"};
    }
}

export function isCompareMovie(value: unknown): value is CompareMovie {
    if (typeof value !== "object" || value === null) return false;

    const o = value as Record<string, unknown>;

    return typeof o.id === "number" && typeof o.title === "string";
}
