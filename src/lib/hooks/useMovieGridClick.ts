import {addFavorite, type FavoriteMovie, isFavoriteCheck, removeFavorite} from "../store/favoriteMovieStore.ts";
import {type MouseEvent} from "react";
import type {Movie} from "../../types/Movie.ts";

export default function useMovieGridClick(favoriteMovies: FavoriteMovie[], movies?: Movie[]) {

    return (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        const favoriteButton = target.closest<HTMLButtonElement>('button[data-action="toggle-favorite"]');
        const movieCard = favoriteButton?.closest<HTMLElement>("[data-movie-id]");

        const movieId = Number(movieCard?.dataset.movieId);

        if (isFavoriteCheck(movieId, favoriteMovies)) {
            removeFavorite(movieId);
            return;
        }

        if (!movies) return;
        const movie = movies.find((item) => item.id === movieId);
        if (!movie) return;

        addFavorite({
            id: movie.id,
            title: movie.title,
            year: movie.year,
            poster: movie.poster,
            rating: movie.rating,
        });
    }
}