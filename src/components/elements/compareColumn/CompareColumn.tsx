import styles from "./CompareColumn.module.css";
import type {CompareMovie} from "../../../lib/store/compareMovieStore.ts";

function formatGenres(genres: string[]): string {
    if (!genres.length) return "—";

    return genres.join(", ");
}

export default function CompareColumn({ movie }: { movie: CompareMovie | null }) {

    if (!movie) {
        return (
            <div className={styles.column}>
                <div className={styles.placeholder}>Добавьте фильм из каталога или избранного</div>
            </div>
        );
    }

    return (
        <div className={styles.column}>
            <dl className={styles.rows}>
                <div className={styles.row}>
                    <dt>Название</dt>

                    <dd>{movie.title}</dd>
                </div>

                <div className={styles.row}>
                    <dt>Год</dt>

                    <dd>{movie.year > 0 ? movie.year : "—"}</dd>
                </div>

                <div className={styles.row}>
                    <dt>Рейтинг</dt>

                    <dd>{Number.isFinite(movie.rating) ? movie.rating.toFixed(1) : "—"}</dd>
                </div>

                <div className={styles.row}>
                    <dt>Продолжительность (в минутах)</dt>

                    <dd>{movie.movieLength}</dd>
                </div>

                <div className={styles.row}>
                    <dt>Жанры</dt>

                    <dd>{formatGenres(movie.genres)}</dd>
                </div>
            </dl>
        </div>
    );
}