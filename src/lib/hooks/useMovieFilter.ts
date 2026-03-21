import {useMemo} from "react";
import {useSearchParams} from "react-router";
import {type MovieGenreSlug, parseGenreParam} from "../utils/movie.ts";

export function useMovieFilter() {

    const [searchParams, setSearchParams] = useSearchParams();

    const genresFilter = useMemo(() => {

        return searchParams
            .getAll("genre")
            .map(parseGenreParam)
            .filter((slug): slug is NonNullable<typeof slug> => Boolean(slug));
    }, [searchParams]);

    const fromYearFilter = searchParams.get("from") || "";
    const toYearFilter = searchParams.get("to") || "";
    const fromRatingFilter = searchParams.get("fromRating") || "";
    const toRatingFilter = searchParams.get("toRating") || "";

    const sortBy = searchParams.get("sort") || "rating";

    const updateSearchParam = (key: string, value: string | string[] | number) => {
        const newParams = new URLSearchParams(searchParams);

        if (value === "") {
            newParams.delete(key);
        } else if (Array.isArray(value)) {
            newParams.delete(key);

            value.forEach(v => newParams.append(key, v));
        } else {
            newParams.set(key, String(value));
        }

        setSearchParams(newParams);
    };

    const handleGenreChange = (genre: MovieGenreSlug) => {
        const nextGenres = genresFilter.includes(genre)
            ? genresFilter.filter(g => g !== genre)
            : [...genresFilter, genre];

        updateSearchParam("genre", nextGenres);
    };

    const clearSearchParams = () => setSearchParams({});

    return {
        genresFilter,
        fromYearFilter,
        toYearFilter,
        fromRatingFilter,
        toRatingFilter,
        sortBy,
        updateSearchParam,
        handleGenreChange,
        clearSearchParams
    }
}