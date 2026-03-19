import styles from "./MoviesPage.module.css";
import type { Movie } from "../../types/Movie.ts";
import MovieCard from "../../components/UI/MovieCard/MovieCard.tsx";
import { useMemo } from "react";
import FilterInput from "../../components/inputs/FIlterInput/FilterInput.tsx";
import { useSearchParams } from "react-router";

const movies: Movie[] = [
    { id: 1, title: "Интерстеллар", year: 2014, rating: 8.6, poster: "...", genres: ["Фантастика", "Драма"] },
    { id: 2, title: "Дюна", year: 2021, rating: 8.1, poster: "...", genres: ["Фантастика", "Приключения"] },
    { id: 3, title: "Начало", year: 2010, rating: 8.8, poster: "...", genres: ["Фантастика", "Триллер"] },
    { id: 4, title: "Одержимость", year: 2014, rating: 8.5, poster: "...", genres: ["Драма", "Музыка"] },
    { id: 5, title: "Бегущий по лезвию 2049", year: 2017, rating: 8.0, poster: "...", genres: ["Фантастика", "Триллер"] },
    { id: 6, title: "Гранд Будапешт", year: 2014, rating: 8.1, poster: "...", genres: ["Комедия", "Драма"] },
];

export default function MoviesPage() {

    const [searchParams, setSearchParams] = useSearchParams();

    const nameFilter = searchParams.get("name") || "";
    const genresFilter = searchParams.getAll("genre");
    const fromYearFilter = searchParams.get("from") || "";
    const toYearFilter = searchParams.get("to") || "";
    const fromRatingFilter = searchParams.get("fromRating") || "";
    const toRatingFilter = searchParams.get("toRating") || "";

    const sortBy = searchParams.get("sort") || "rating";

    const updateSearchParam = (key: string, value: string | string[] | number) => {
        const newParams = new URLSearchParams(searchParams);

        if (value === "") {
            newParams.delete(key);
        } else if (Array.isArray(value)) {
            newParams.delete(key);

            value.forEach(v => newParams.append(key, v));
        } else {
            newParams.set(key, String(value));
        }

        setSearchParams(newParams);
    };

    const handleGenreChange = (genre: string) => {
        const nextGenres = genresFilter.includes(genre)
            ? genresFilter.filter(g => g !== genre)
            : [...genresFilter, genre];

        updateSearchParam("genre", nextGenres);
    };

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
                            onClick={() => setSearchParams({})}
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
                                placeholder="От..."
                                value={fromYearFilter}
                                onChange={(val) => updateSearchParam("from", val)}
                            />

                            <FilterInput
                                id="toYearFilter"
                                placeholder={`До...`}
                                value={toYearFilter}
                                onChange={(val) => updateSearchParam("to", val)}
                            />
                        </div>
                    </div>

                    <div className={styles.filterSection}>
                        <span className={styles.label}>Рейтинг (0 - 10)</span>
                        <div className={styles.yearRow}>
                            <FilterInput
                                id="fromRatingFilter"
                                placeholder="От..."
                                value={fromRatingFilter}
                                onChange={(val) => updateSearchParam("fromRating", val)}
                            />

                            <FilterInput
                                id="toYearFilter"
                                placeholder={`До...`}
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

                    <div className={styles.grid}>
                        {filteredMovies.map(movie => (
                            <MovieCard
                                key={movie.id}
                                {...movie}
                            />
                        ))}
                    </div>

                    {filteredMovies.length === 0 && <p className={styles.empty}>По вашему запросу ничего не найдено</p>}
                </section>
            </div>
        </main>
    );
}