import styles from './MovieCard.module.css'
import {memo, useMemo, useState} from "react";
import {Link} from "react-router-dom";

interface IProps {
    id: number;
    title: string;
    year: number;
    rating: number;
    poster: string;
    isFavorite: boolean;
    genres?: string[];
    isInCompare?: boolean;
}

function MovieCard(
    {
        id,
        poster,
        title,
        year,
        rating,
        genres,
        isFavorite,
        isInCompare = false,
    }: IProps) {

    const [isPosterBroken, setIsPosterBroken] = useState(false);

    const hasPoster = useMemo(() => {
        return Boolean(poster && poster !== "..." && !isPosterBroken);
    }, [poster, isPosterBroken]);

    return (
        <article className={styles.card} data-movie-id={id}>
           <Link to={`/movies/${id}`}>
               <div className={styles.poster}>
                   {hasPoster ? (
                       <img
                           src={poster}
                           alt={title}
                           loading="lazy"
                           onError={() => setIsPosterBroken(true)}
                       />
                   ) : (
                       <div className={styles.posterFallback} aria-hidden>
                        <span className={styles.posterFallbackLabel}>
                            {title.slice(0, 2).toUpperCase()}
                        </span>
                       </div>
                   )}

                   <span className={styles.rating}>
                    {Number.isFinite(rating) ? rating.toFixed(1) : '—'}
                </span>
               </div>
           </Link>

            <div className={styles.cardBody}>
                <div className={styles.mainContent}>
                    <Link to={`/movies/${id}`} className={styles.linkText}>
                        <h3 className={styles.cardTitle}>{title}</h3>
                    </Link>

                    <p className={styles.cardMeta}>{year}</p>

                    {genres && genres.length > 0 && (
                        <p className={styles.genres} title={genres.join(", ")}>
                            {genres.join(" · ")}
                        </p>
                    )}
                </div>

                <div className={styles.actions}>
                    <button
                        className={`${styles.actionButton} ${isFavorite ? styles.actionButtonActive : ""}`}
                        type="button"
                        data-action="toggle-favorite"
                        aria-pressed={isFavorite}
                        aria-label={isFavorite ? `Убрать "${title}" из избранного` : `Добавить "${title}" в избранное`}
                    >
                        {isFavorite ? "В избранном" : "В избранное"}
                    </button>

                    <button
                        className={`${styles.actionButton} ${isInCompare ? styles.actionButtonCompareActive : ""}`}
                        type="button"
                        data-action="compare"
                        aria-pressed={isInCompare}
                        aria-label={
                            isInCompare ? `Убрать «${title}» из сравнения` : `Добавить «${title}» в сравнение`
                        }
                    >
                        {isInCompare ? "В сравнении" : "Сравнить"}
                    </button>
                </div>
            </div>
        </article>
    )
}

export default memo(MovieCard);