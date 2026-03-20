import {addFavorite, type FavoriteMovie, isFavoriteCheck, removeFavorite} from "../store/favoriteMovieStore.ts";
import { addToCompare, movieToCompareMovie } from "../store/compareMovieStore.ts";
import { type MouseEvent } from "react";
import type { Movie } from "../../types/movie.ts";

export interface MovieGridClickOptions {
    onRequestAddFavorite?: (movie: Movie) => void;
}

export default function useMovieGridClick(favoriteMovies: FavoriteMovie[], movies?: Movie[], options?: MovieGridClickOptions) {

    return (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        const compareButton = target.closest<HTMLButtonElement>('button[data-action="compare"]');

        if (compareButton) {
            const movieCard = compareButton.closest<HTMLElement>("[data-movie-id]");
            const movieId = Number(movieCard?.dataset.movieId);

            if (!movies || !Number.isFinite(movieId)) return;
            const movie = movies.find((item) => item.id === movieId);

            if (!movie) return;
            addToCompare(movieToCompareMovie(movie));

            return;
        }

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

        if (options?.onRequestAddFavorite) {
            options.onRequestAddFavorite(movie);

            return;
        }

        addFavorite({
            id: movie.id,
            title: movie.title,
            year: movie.year,
            poster: movie.poster,
            rating: movie.rating,
            genres: movie.genres,
        });
    }
}