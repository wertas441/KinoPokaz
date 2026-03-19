import styles from "./MoviesPage.module.css";
import type { Movie } from "../../types/Movie.ts";
import MovieCard from "../../components/UI/MovieCard/MovieCard.tsx";
import { useMemo } from "react";
import FilterInput from "../../components/inputs/FIlterInput/FilterInput.tsx";
import { useUnit } from "effector-react";
import {
    $favoriteMovies,
    isFavoriteCheck,
} from "../../lib/store/favoriteMovieStore.ts";
import {useMovieFilter} from "../../lib/hooks/useMovieFilter.ts";
import useMovieGridClick from "../../lib/hooks/useMovieGridClick.ts";

const movies: Movie[] = [
    { id: 1, title: "Интерстеллар", year: 2014, rating: 8.6, poster: "...", genres: ["Фантастика", "Драма"] },
    { id: 2, title: "Дюна", year: 2021, rating: 8.1, poster: "...", genres: ["Фантастика", "Приключения"] },
    { id: 3, title: "Начало", year: 2010, rating: 8.8, poster: "...", genres: ["Фантастика", "Триллер"] },
    { id: 4, title: "Одержимость", year: 2014, rating: 8.5, poster: "...", genres: ["Драма", "Музыка"] },
    { id: 5, title: "Бегущий по лезвию 2049", year: 2017, rating: 8.0, poster: "...", genres: ["Фантастика", "Триллер"] },
    { id: 6, title: "Гранд Будапешт", year: 2014, rating: 8.1, poster: "...", genres: ["Комедия", "Драма"] },
];

export default function MoviesPage() {

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
        handleGenreChange,
        clearSearchParams,
    } = useMovieFilter();

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

    }, [nameFilter, genresFilter, fromYearFilter, toYearFilter, fromRatingFilter, toRatingFilter, sortBy]);

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <aside className={styles.filter}>
                    <div className={styles.filterHeader}>
                        <h2 className={styles.filterTitle}>Фильтры</h2>

                        <button
                            type="button"
                            className={styles.resetButton}
                            onClick={clearSearchParams}
                        >
                            Сбросить
                        </button>
                    </div>

                    <FilterInput
                        id="nameFilter"
                        placeholder="Поиск по названию..."
                        value={nameFilter}
                        onChange={(val) => updateSearchParam("name", val)}
                    />

                    <div className={styles.filterSection}>
                        <span className={styles.label}>Жанры</span>
                        <div className={styles.checkboxList}>
                            {["Фантастика", "Драма", "Приключения", "Триллер"].map(genre => (
                                <label key={genre} className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={genresFilter.includes(genre)}
                                        onChange={() => handleGenreChange(genre)}
                                    />

                                    {genre}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterSection}>
                        <span className={styles.label}>Год выпуска</span>
                        <div className={styles.yearRow}>
                            <FilterInput
                                id="fromYearFilter"
                                placeholder="От 1990"
                                value={fromYearFilter}
                                onChange={(val) => updateSearchParam("from", val)}
                            />

                            <FilterInput
                                id="toYearFilter"
                                placeholder={`До 2026`}
                                value={toYearFilter}
                                onChange={(val) => updateSearchParam("to", val)}
                            />
                        </div>
                    </div>

                    <div className={styles.filterSection}>
                        <span className={styles.label}>Рейтинг</span>
                        <div className={styles.yearRow}>
                            <FilterInput
                                id="fromRatingFilter"
                                placeholder="От 0"
                                value={fromRatingFilter}
                                onChange={(val) => updateSearchParam("fromRating", val)}
                            />

                            <FilterInput
                                id="toYearFilter"
                                placeholder={`До 10`}
                                value={toRatingFilter}
                                onChange={(val) => updateSearchParam("toRating", val)}
                            />
                        </div>
                    </div>
                </aside>

                <section className={styles.content}>
                    <div className={styles.contentHeader}>
                        <h2 className={styles.contentTitle}>Найдено: {filteredMovies.length}</h2>
                        <div className={styles.sort}>
                            <span className={styles.sortLabel}>Сортировка</span>

                            <select
                                className={styles.select}
                                value={sortBy}
                                onChange={(e) => updateSearchParam("sort", e.target.value)}
                            >

                                <option value="rating">по рейтингу</option>

                                <option value="year">по году</option>

                                <option value="title">по названию</option>
                            </select>
                        </div>
                    </div>

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

                    {filteredMovies.length === 0 && <p className={styles.empty}>По вашему запросу ничего не найдено</p>}
                </section>
            </div>
        </main>
    );
}