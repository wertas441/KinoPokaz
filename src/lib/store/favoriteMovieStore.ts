import { createEvent, createStore } from "effector";

export interface FavoriteMovie {
    id: number;
    title: string;
    year: number;
    poster: string;
    rating: number;
    genres?: string[];
}

const initialState = JSON.parse(localStorage.getItem("favorites") || "[]");

export const addFavorite = createEvent<FavoriteMovie>();
export const removeFavorite = createEvent<number>();
export const resetFavorites = createEvent();

export const $favoriteMovies = createStore<FavoriteMovie[]>(initialState)
    .on(addFavorite, (state, movie) => {
        const isExist = state.some((item) => item.id === movie.id);

        if (isExist) return state;

        return [...state, movie];
    })

    .on(removeFavorite, (state, movieId) => {
        return state.filter((movie) => movie.id !== movieId);
    })

    .on(resetFavorites, () => []);

$favoriteMovies.watch((state) => {
    localStorage.setItem("favorites", JSON.stringify(state));
});

export const isFavoriteCheck = (id: number, favorites: FavoriteMovie[]) => {
    return favorites.some(movie => movie.id === id)
}
