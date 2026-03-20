import { useUnit } from "effector-react";
import MovieCard from "../../components/UI/movieCard/MovieCard.tsx";
import styles from "./FavoriteMoviePage.module.css";
import { $favoriteMovies, resetFavorites } from "../../lib/store/favoriteMovieStore.ts";
import useMovieGridClick from "../../lib/hooks/useMovieGridClick.ts";

export default function FavoriteMoviePage() {

    const favoriteMovies = useUnit($favoriteMovies);
    const gridClickHandler = useMovieGridClick(favoriteMovies);

    return (
        <main className={styles.page}>
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
                            onClick={() => resetFavorites()}
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
                                {...movie}
                                isFavorite
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