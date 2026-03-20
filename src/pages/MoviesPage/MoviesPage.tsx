import styles from "./MoviesPage.module.css";
import MovieCard from "../../components/UI/movieCard/MovieCard.tsx";
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import { useUnit } from "effector-react";
import {
    addFavorite,
    $favoriteMovies,
} from "../../lib/store/favoriteMovieStore.ts";
import { $compareMovies } from "../../lib/store/compareMovieStore.ts";
import {useMovieFilter} from "../../lib/hooks/useMovieFilter.ts";
import useMovieGridClick from "../../lib/hooks/useMovieGridClick.ts";
import { useModalWindow } from "../../lib/hooks/useModalWindow.ts";
import ModalWindow from "../../components/UI/modalWindows/modalWindow/ModalWindow.tsx";
import MovieFilter from "../../components/UI/movieFilter/MovieFilter.tsx";
import {getMovieList} from "../../lib/controllers/movie.ts";
import type {Movie} from "../../types/movie.ts";

const PAGE_SIZE = 50;
const LOAD_AHEAD_PX = "400px";

export default function MoviesPage() {

    const [movies, setMovies] = useState<Movie[]>([]);

    const [totalInCatalog, setTotalInCatalog] = useState(0);
    const [listPage, setListPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadMoreLock = useRef(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const [pendingFavoriteMovie, setPendingFavoriteMovie] = useState<Movie | null>(null);
    const { isModalWindowOpen, toggleModalWindow } = useModalWindow();

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

    const genreKey = useMemo(() => [...genresFilter].sort().join("|"), [genresFilter]);

    useLayoutEffect(() => {
        document.title = "Каталог фильмов | KinoPokaz";
    }, []);

    useLayoutEffect(() => {
        let cancelled = false;

        const getData = async () => {
            setIsLoading(true);

            try {
                const { movies, pages, page, total } = await getMovieList(1, PAGE_SIZE, genresFilter);

                if (cancelled) return;

                setMovies(movies);
                setListPage(page);
                setHasMore(pages > 0 && page < pages && movies.length > 0);
                setTotalInCatalog(total);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        void getData();

        return () => {
            cancelled = true;
        };
    }, [genreKey, genresFilter]);

    const loadNextPage = useCallback(async () => {
        if (loadMoreLock.current || !hasMore || isLoading || isLoadingMore) return;

        loadMoreLock.current = true;
        setIsLoadingMore(true);

        try {
            const { movies, pages, page, total } = await getMovieList(listPage + 1, PAGE_SIZE, genresFilter);

            setMovies((prev) => {
                return [...prev, ...movies];
            });

            setListPage(page);
            setHasMore(pages > 0 && page < pages && movies.length > 0);

            if (total > 0) setTotalInCatalog(total);
        } finally {
            loadMoreLock.current = false;

            setIsLoadingMore(false);
        }
    }, [hasMore, isLoading, isLoadingMore, listPage, genresFilter]);

    const handleRequestAddFavorite = useCallback((movie: Movie) => {
        setPendingFavoriteMovie(movie);

        toggleModalWindow();
    }, [toggleModalWindow]);

    const closeFavoriteModal = useCallback(() => {
        toggleModalWindow();

        setPendingFavoriteMovie(null);
    }, [toggleModalWindow]);

    const confirmAddFavorite = useCallback(() => {
        if (!pendingFavoriteMovie) return;

        addFavorite({
            id: pendingFavoriteMovie.id,
            title: pendingFavoriteMovie.title,
            year: pendingFavoriteMovie.year,
            poster: pendingFavoriteMovie.poster,
            rating: pendingFavoriteMovie.rating,
            genres: pendingFavoriteMovie.genres,
            movieLength: pendingFavoriteMovie.movieLength,
        });

        closeFavoriteModal();
    }, [pendingFavoriteMovie, closeFavoriteModal]);

    const gridClickHandler = useMovieGridClick(movies, handleRequestAddFavorite);

    const favoriteMovies = useUnit($favoriteMovies);
    const compareMovies = useUnit($compareMovies);

    const filteredMovies = useMemo(() => {
        return movies
            .filter((movie) => {
                const matchesName = (movie.title ?? '').toLowerCase().includes(nameFilter.toLowerCase());
                const matchesGenre =
                    genresFilter.length === 0 ||
                    genresFilter.every((slug) => movie.genres?.some((g) => g.toLowerCase() === slug));

                const matchesFromYear = fromYearFilter === "" || movie.year >= parseInt(fromYearFilter);
                const matchesToYear = toYearFilter === "" || movie.year <= parseInt(toYearFilter);

                const matchesFromRating = fromRatingFilter === "" || movie.rating >= parseFloat(fromRatingFilter);
                const matchesToRating = toRatingFilter === "" || movie.rating <= parseFloat(toRatingFilter);

                return matchesName && matchesGenre && matchesFromYear && matchesToYear && matchesFromRating && matchesToRating;
            })
            .sort((a, b) => {
                if (sortBy === "rating") return b.rating - a.rating;
                if (sortBy === "year") return b.year - a.year;
                if (sortBy === "title") return (a.title ?? '').localeCompare(b.title ?? '', 'ru');
                return 0;
            });

    }, [movies, nameFilter, genresFilter, fromYearFilter, toYearFilter, fromRatingFilter, toRatingFilter, sortBy]);

    useEffect(() => {
        if (isLoading || !hasMore) return;

        const node = sentinelRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                
                if (entry?.isIntersecting) void loadNextPage();
            },

            {root: null, rootMargin: LOAD_AHEAD_PX, threshold: 0},
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [isLoading, hasMore, loadNextPage, filteredMovies.length, movies.length]);

    return (
        <main className={styles.page}>
            <ModalWindow
                isOpen={isModalWindowOpen}
                onClose={closeFavoriteModal}
                title="Добавить в избранное?"
                description={
                    pendingFavoriteMovie
                        ? `Вы уверены, что хотите добавить «${pendingFavoriteMovie.title}» (${pendingFavoriteMovie.year}) в избранное?`
                        : ""
                }
                onConfirm={confirmAddFavorite}
            />

            <div className={styles.container}>

                <MovieFilter />

                <section className={styles.content}>

                    {!isLoading && (
                        <div className={styles.contentHeader}>
                            <div className={styles.contentHeaderTitles}>
                                <h2 className={styles.contentTitle}>
                                    Найдено: {filteredMovies.length}
                                </h2>

                                {totalInCatalog > 0 && (
                                    <p className={styles.contentSubtitle}>
                                        В каталоге {totalInCatalog.toLocaleString()} фильмов · в ленте {movies.length}
                                    </p>
                                )}
                            </div>

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
                                        isFavorite={favoriteMovies.some((m) => m.id === movie.id)}
                                        isInCompare={compareMovies.some((m) => m.id === movie.id)}
                                    />
                                ))}
                            </div>

                            {filteredMovies.length === 0 && (
                                <p className={styles.empty}>По вашему запросу ничего не найдено</p>
                            )}

                            {hasMore && (
                                <div
                                    ref={sentinelRef}
                                    className={styles.scrollSentinel}
                                    aria-hidden
                                />
                            )}

                            {isLoadingMore && hasMore && (
                                <div
                                    className={styles.loadMoreStatus}
                                    role="status"
                                    aria-live="polite"
                                    aria-busy="true"
                                    aria-label="Загрузка следующих фильмов"
                                >
                                    <div className={`${styles.spinner} ${styles.spinnerSmall}`} aria-hidden />

                                    <p className={styles.loadMoreText}>Подгружаем ещё…</p>
                                </div>
                            )}

                            {!hasMore && movies.length > 0 && (
                                <p className={styles.endHint}>Вы дошли до конца подборки</p>
                            )}
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}