import { createEvent, createStore } from "effector";
import type {Movie} from "../../types/movie.ts";

const initialState = JSON.parse(localStorage.getItem("favorites") || "[]");

export const addFavorite = createEvent<Movie>();
export const removeFavorite = createEvent<number>();
export const resetFavorites = createEvent();

export const $favoriteMovies = createStore<Movie[]>(initialState)
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

export const isFavoriteCheck = (id: number) => {
    const data = $favoriteMovies.getState();

    return data.some(movie => movie.id === id)
}
