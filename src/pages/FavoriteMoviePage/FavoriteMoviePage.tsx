import { useCallback } from "react";
import { useUnit } from "effector-react";
import MovieCard from "../../components/UI/movieCard/MovieCard.tsx";
import ModalWindow from "../../components/UI/modalWindows/modalWindow/ModalWindow.tsx";
import styles from "./FavoriteMoviePage.module.css";
import { $favoriteMovies, resetFavorites } from "../../lib/store/favoriteMovieStore.ts";
import { $compareMovies } from "../../lib/store/compareMovieStore.ts";
import useMovieGridClick from "../../lib/hooks/useMovieGridClick.ts";
import { useModalWindow } from "../../lib/hooks/useModalWindow.ts";

export default function FavoriteMoviePage() {

    const movies = useUnit($favoriteMovies);
    const compareMovies = useUnit($compareMovies);

    const gridClickHandler = useMovieGridClick(movies);

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

                        <p className={styles.subtitle}>Сохранено: {movies.length}</p>
                    </div>

                    {movies.length > 0 && (
                        <button
                            type="button"
                            className={styles.resetButton}
                            onClick={toggleModalWindow}
                        >
                            Очистить избранное
                        </button>
                    )}
                </div>

                {movies.length > 0 ? (
                    <div
                        className={`${styles.grid} ${movies.length === 1 ? styles.gridSingle : ""}`}
                        onClick={gridClickHandler}
                    >
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                {...movie}
                                isFavorite
                                isInCompare={compareMovies.some((m) => m.id === movie.id)}
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