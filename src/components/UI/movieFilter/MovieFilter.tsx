import FilterInput from "../../inputs/filterInput/FilterInput.tsx";
import styles from "./MovieFilter.module.css";
import {useMovieFilter} from "../../../lib/hooks/useMovieFilter.ts";
import {MOVIE_GENRE_OPTIONS} from "../../../lib/utils/movie.ts";
import {memo} from "react";

function MovieFilter() {

    const {
        genresFilter,
        fromYearFilter,
        toYearFilter,
        fromRatingFilter,
        toRatingFilter,
        updateSearchParam,
        handleGenreChange,
        clearSearchParams,
    } = useMovieFilter();

    return (
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

            <div className={styles.filterSection}>
                <span className={styles.label}>Жанры</span>

                <div className={styles.checkboxList}>
                    {MOVIE_GENRE_OPTIONS.map(({ slug, label }) => (
                        <label key={slug} className={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={genresFilter.includes(slug)}
                                onChange={() => handleGenreChange(slug)}
                            />

                            {label}
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
                        placeholder="До 2026"
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
                        id="toRatingFilter"
                        placeholder="До 10"
                        value={toRatingFilter}
                        onChange={(val) => updateSearchParam("toRating", val)}
                    />
                </div>
            </div>
        </aside>
    );
}

export default memo(MovieFilter);