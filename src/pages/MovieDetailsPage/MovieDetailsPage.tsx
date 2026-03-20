import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieDetails } from "../../lib/controllers/movie.ts";
import type { MovieDetails } from "../../types/movie.ts";
import styles from "./MovieDetailsPage.module.css";
import {formatPremiereDate} from "../../lib";

export default function MovieDetailsPage() {

    const { id } = useParams<{ id: string }>();

    const [movieData, setMovieData] = useState<MovieDetails | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setIsLoading(false);

            return;
        }

        let cancelled = false;
        setIsLoading(true);

        const getData = async () => {
            const data = await getMovieDetails(id);

            if (!cancelled) {
                setMovieData(data);

                setIsLoading(false);
            }
        };

        void getData();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const premiereLines = useMemo(() => {
        if (!movieData) return [];

        const lines = [];

        const world = formatPremiereDate(movieData.premiereWorld);
        const russia = formatPremiereDate(movieData.premiereRussia);

        if (world) lines.push({ label: "Мировая премьера", value: world });
        if (russia) lines.push({ label: "Премьера в России", value: russia });

        return lines;
    }, [movieData]);

    if (!id) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.muted}>Не указан идентификатор фильма.</p>
                    <Link className={styles.backLink} to="/movies">
                        ← К каталогу
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.muted} aria-live="polite">
                        Загрузка…
                    </p>
                </div>
            </div>
        );
    }

    if (!movieData) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <p className={styles.error}>Фильм не найден или данные временно недоступны.</p>
                    <Link className={styles.backLink} to="/movies">
                        ← К каталогу
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <nav className={styles.breadcrumbs} aria-label="Навигация">
                    <Link className={styles.backLink} to="/movies">
                        ← К каталогу
                    </Link>
                </nav>

                <article className={styles.layout}>
                    <div className={styles.posterWrap}>
                        {movieData.poster ? (
                            <img
                                className={styles.poster}
                                src={movieData.poster}
                                alt=""
                                decoding="async"
                            />
                        ) : (
                            <div className={styles.posterFallback} aria-hidden>
                                <span className={styles.posterFallbackLabel}>
                                    {movieData.title.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={styles.main}>
                        <header className={styles.header}>
                            <h1 className={styles.title}>{movieData.title}</h1>
                            <div className={styles.metaRow}>
                                {movieData.year > 0 && (
                                    <span className={styles.metaBadge}>{movieData.year}</span>
                                )}

                                <span className={styles.ratingBadge} title="Рейтинг">
                                    {movieData.rating.toFixed(1)}
                                </span>
                            </div>
                        </header>

                        {movieData.genres.length > 0 && (
                            <ul className={styles.genres} aria-label="Жанры">
                                {movieData.genres.map((g) => (
                                    <li key={g} className={styles.genreTag}>
                                        {g}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {premiereLines.length > 0 && (
                            <dl className={styles.premiere}>
                                {premiereLines.map(({ label, value }) => (
                                    <div key={label} className={styles.premiereRow}>
                                        <dt className={styles.premiereLabel}>{label}</dt>

                                        <dd className={styles.premiereValue}>{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        {movieData.description ? (
                            <section className={styles.descriptionBlock} aria-labelledby="description-heading">
                                <h2 id="description-heading" className={styles.sectionTitle}>
                                    Описание
                                </h2>

                                <p className={styles.description}>{movieData.description}</p>
                            </section>
                        ) : (
                            <p className={styles.muted}>Описание отсутствует.</p>
                        )}
                    </div>
                </article>
            </div>
        </div>
    );
}
