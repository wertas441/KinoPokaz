import styles from "./MoviesPage.module.css";
import MovieCard from "../../components/UI/MovieCard/MovieCard.tsx";
import {useLayoutEffect, useMemo, useState} from "react";
import { useUnit } from "effector-react";
import {
    $favoriteMovies,
    isFavoriteCheck,
} from "../../lib/store/favoriteMovieStore.ts";
import {useMovieFilter} from "../../lib/hooks/useMovieFilter.ts";
import useMovieGridClick from "../../lib/hooks/useMovieGridClick.ts";
import MovieFilter from "../../components/UI/movieFilter/MovieFilter.tsx";
import {getMovieList} from "../../lib/controllers/movie.ts";
import type {Movie} from "../../types/movie.ts";

export default function MoviesPage() {

    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const favoriteMovies = useUnit($favoriteMovies);

    const {
        nameFilter,
        genresFilter,
        fromYearFilter,
        toYearFilter,
        fromRatingFilter,
        toRatingFilter,
        sortBy,
        updateSearchParam,
    } = useMovieFilter();

    useLayoutEffect(() => {
        const getData = async () => {
            setIsLoading(true);

            try {
                const data = await getMovieList(1, 10);

                setMovies(data);
            } finally {
                setIsLoading(false);
            }
        };

        void getData();
    }, []);

    const gridClickHandler = useMovieGridClick(favoriteMovies, movies);

    const filteredMovies = useMemo(() => {
        return movies
            .filter((movie) => {
                const matchesName = movie.title.toLowerCase().includes(nameFilter.toLowerCase());
                const matchesGenre = genresFilter.length === 0 || movie.genres?.some(g => genresFilter.includes(g));

                const matchesFromYear = fromYearFilter === "" || movie.year >= parseInt(fromYearFilter);
                const matchesToYear = toYearFilter === "" || movie.year <= parseInt(toYearFilter);

                const matchesFromRating = fromRatingFilter === "" || movie.rating >= parseFloat(fromRatingFilter);
                const matchesToRating = toRatingFilter === "" || movie.rating <= parseFloat(toRatingFilter);

                return matchesName && matchesGenre && matchesFromYear && matchesToYear && matchesFromRating && matchesToRating;
            })
            .sort((a, b) => {
                if (sortBy === "rating") return b.rating - a.rating;
                if (sortBy === "year") return b.year - a.year;
                if (sortBy === "title") return a.title.localeCompare(b.title);
                return 0;
            });

    }, [movies, nameFilter, genresFilter, fromYearFilter, toYearFilter, fromRatingFilter, toRatingFilter, sortBy]);

    return (
        <main className={styles.page}>
            <div className={styles.container}>

                <MovieFilter />

                <section className={styles.content}>

                    {!isLoading && (
                        <div className={styles.contentHeader}>
                            <h2 className={styles.contentTitle}>
                                Найдено: {filteredMovies.length}
                            </h2>

                            <div className={styles.sort}>
                                <span className={styles.sortLabel}>Сортировка</span>

                                <select
                                    className={styles.select}
                                    value={sortBy}
                                    disabled={isLoading}
                                    onChange={(e) => updateSearchParam("sort", e.target.value)}
                                >

                                    <option value="rating">по рейтингу</option>
                                    <option value="year">по году</option>
                                    <option value="title">по названию</option>
                                </select>
                            </div>
                        </div>
                    )}


                    {isLoading ? (
                        <div
                            className={styles.loaderWrap}
                            role="status"
                            aria-live="polite"
                            aria-busy="true"
                            aria-label="Загрузка списка фильмов"
                        >
                            <div className={styles.spinner} aria-hidden />

                            <p className={styles.loaderText}>Загружаем подборку…</p>
                        </div>
                    ) : (
                        <>
                            <div
                                className={`${styles.grid} ${filteredMovies.length === 1 ? styles.gridSingle : ""}`}
                                onClick={gridClickHandler}
                            >
                                {filteredMovies.map(movie => (
                                    <MovieCard
                                        key={movie.id}
                                        {...movie}
                                        isFavorite={isFavoriteCheck(movie.id, favoriteMovies)}
                                    />
                                ))}
                            </div>

                            {filteredMovies.length === 0 && (
                                <p className={styles.empty}>По вашему запросу ничего не найдено</p>
                            )}
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}