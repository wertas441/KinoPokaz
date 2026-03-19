import {useSearchParams} from "react-router";

export function useMovieFilter() {

    const [searchParams, setSearchParams] = useSearchParams();

    const nameFilter = searchParams.get("name") || "";
    const genresFilter = searchParams.getAll("genre");
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

    const handleGenreChange = (genre: string) => {
        const nextGenres = genresFilter.includes(genre)
            ? genresFilter.filter(g => g !== genre)
            : [...genresFilter, genre];

        updateSearchParam("genre", nextGenres);
    };

    const clearSearchParams = () => setSearchParams({});

    return {
        nameFilter,
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