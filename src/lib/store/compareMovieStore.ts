import { createEvent, createStore } from "effector";
import type { Movie } from "../../types/movie.ts";

export interface CompareMovie {
    id: number;
    title: string;
    year: number;
    rating: number;
    genres: string[];
    movieLength: number;
}

function loadInitial(): CompareMovie[] {
    try {
        const raw = localStorage.getItem('compareMovies');
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        return parsed.filter(
            (x): x is CompareMovie =>
                typeof x === "object" &&
                x !== null &&
                typeof (x as CompareMovie).id === "number" &&
                typeof (x as CompareMovie).title === "string",
        );
    } catch {
        return [];
    }
}

export const addToCompare = createEvent<CompareMovie>();
export const removeFromCompare = createEvent<number>();
export const clearCompare = createEvent();

export const openComparePanel = createEvent();
export const closeComparePanel = createEvent();

export const $compareMovies = createStore<CompareMovie[]>(loadInitial())
    .on(addToCompare, (state, movie) => {
        const at = state.findIndex((m) => m.id === movie.id);

        if (at >= 0) {
            return state.filter((m) => m.id !== movie.id);
        }

        if (state.length === 0) return [movie];
        if (state.length === 1) return [...state, movie];

        return [state[1], movie];
    })
    .on(removeFromCompare, (state, id) => state.filter((m) => m.id !== id))

    .on(clearCompare, () => []);

export const $comparePanelOpen = createStore(false)
    .on(openComparePanel, () => true)
    .on(closeComparePanel, () => false);

$compareMovies.watch((state) => {
    localStorage.setItem('compareMovies', JSON.stringify(state));
});

export const isInCompareCheck = (id: number) => {
    const data = $compareMovies.getState();

    return data.find((movie) => movie.id === id);
}

export function movieToCompareMovie(movie: Movie): CompareMovie {

    return {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        rating: movie.rating,
        genres: movie.genres ?? [],
        movieLength: movie.movieLength,
    };
}
