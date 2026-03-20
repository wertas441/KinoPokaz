import { useCallback, useMemo } from "react";
import { useUnit } from "effector-react";
import MovieCard from "../../components/UI/movieCard/MovieCard.tsx";
import ModalWindow from "../../components/UI/modalWindows/modalWindow/ModalWindow.tsx";
import styles from "./FavoriteMoviePage.module.css";
import { $favoriteMovies, resetFavorites } from "../../lib/store/favoriteMovieStore.ts";
import { $compareMovies, isInCompareCheck } from "../../lib/store/compareMovieStore.ts";
import useMovieGridClick from "../../lib/hooks/useMovieGridClick.ts";
import { useModalWindow } from "../../lib/hooks/useModalWindow.ts";
import type { Movie } from "../../types/movie.ts";

export default function FavoriteMoviePage() {

    const favoriteMovies = useUnit($favoriteMovies);
    const compareMovies = useUnit($compareMovies);

    const moviesForGrid = useMemo<Movie[]>(() => {

        return favoriteMovies.map((m) => ({
            id: m.id,
            title: m.title,
            year: m.year,
            rating: m.rating,
            poster: m.poster,
            genres: m.genres ?? [],
        }))
    }, [favoriteMovies]);

    const gridClickHandler = useMovieGridClick(favoriteMovies, moviesForGrid);

    const { isModalWindowOpen, toggleModalWindow } = useModalWindow();

    const confirmClearFavorites = useCallback(() => {
        resetFavorites();

        toggleModalWindow();
    }, [toggleModalWindow]);

    return (
        <main className={styles.page}>
            <ModalWindow
                isOpen={isModalWindowOpen}
                onClose={toggleModalWindow}
                title="Очистить избранное?"
                description="Вы уверены, что хотите полностью очистить список избранного?"
                onConfirm={confirmClearFavorites}
            />

            <section className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Избранные фильмы</h2>

                        <p className={styles.subtitle}>Сохранено: {favoriteMovies.length}</p>
                    </div>

                    {favoriteMovies.length > 0 && (
                        <button
                            type="button"
                            className={styles.resetButton}
                            onClick={toggleModalWindow}
                        >
                            Очистить избранное
                        </button>
                    )}
                </div>

                {favoriteMovies.length > 0 ? (
                    <div
                        className={`${styles.grid} ${favoriteMovies.length === 1 ? styles.gridSingle : ""}`}
                        onClick={gridClickHandler}
                    >
                        {favoriteMovies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                genres={movie.genres ?? []}
                                {...movie}
                                isFavorite
                                isInCompare={isInCompareCheck(movie.id, compareMovies)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className={styles.empty}>
                        Пока нет избранных фильмов. Добавь фильмы на странице списка, и они появятся здесь.
                    </p>
                )}
            </section>
        </main>
    )
}