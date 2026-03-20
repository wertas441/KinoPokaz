import {addFavorite, isFavoriteCheck, removeFavorite} from "../store/favoriteMovieStore.ts";
import { addToCompare, movieToCompareMovie } from "../store/compareMovieStore.ts";
import { type MouseEvent } from "react";
import type { Movie } from "../../types/movie.ts";

export default function useMovieGridClick(movies: Movie[], handleRequestAddFavorite?: (movie: Movie) => void) {

    return (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        const compareButton = target.closest<HTMLButtonElement>('button[data-action="compare"]');

        if (compareButton) {
            const movieCard = compareButton.closest<HTMLElement>("[data-movie-id]");
            const movieId = Number(movieCard?.dataset.movieId);

            const movie = movies.find((item) => item.id === movieId);

            if (!movie) return;
            addToCompare(movieToCompareMovie(movie));

            return;
        }

        const favoriteButton = target.closest<HTMLButtonElement>('button[data-action="toggle-favorite"]');
        const movieCard = favoriteButton?.closest<HTMLElement>("[data-movie-id]");

        const movieId = Number(movieCard?.dataset.movieId);

        if (isFavoriteCheck(movieId)) {
            removeFavorite(movieId);

            return;
        }

        const movie = movies.find((item) => item.id === movieId);
        if (!movie) return;

        if (handleRequestAddFavorite) {
            handleRequestAddFavorite(movie);

            return;
        }

        addFavorite({
            id: movie.id,
            title: movie.title,
            year: movie.year,
            poster: movie.poster,
            rating: movie.rating,
            genres: movie.genres,
            movieLength: movie.movieLength,
        });
    }
}