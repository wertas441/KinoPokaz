import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useUnit } from "effector-react";
import {
    $compareMovies,
    $comparePanelOpen,
    closeComparePanel,
    clearCompare,
    type CompareMovie,
} from "../../../../lib/store/compareMovieStore.ts";
import styles from "./CompareMoviesModal.module.css";

function formatGenres(genres: string[]): string {
    if (!genres.length) return "—";

    return genres.join(", ");
}

function Column({ movie }: { movie: CompareMovie | null }) {
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
                    <dt>Жанры</dt>

                    <dd>{formatGenres(movie.genres)}</dd>
                </div>
            </dl>
        </div>
    );
}

export default function CompareMoviesModal() {

    const [movies, isOpen] = useUnit([$compareMovies, $comparePanelOpen]);
    const panelRef = useRef<HTMLDivElement>(null);

    const first = movies[0] ?? null;
    const second = movies[1] ?? null;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            e.preventDefault();

            closeComparePanel();
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        document.addEventListener("keydown", handleKeyDown);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = prev;
        };
    }, [isOpen, handleKeyDown]);

    useEffect(() => {
        if (!isOpen) return;

        const t = window.setTimeout(() => panelRef.current?.focus(), 0);

        return () => window.clearTimeout(t);
    }, [isOpen]);

    if (!isOpen) return null;

    const node = (
        <div
            className={styles.backdrop}
            role="presentation"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) closeComparePanel();
            }}
        >
            <div
                ref={panelRef}
                className={styles.panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="compare-modal-title"
                tabIndex={-1}
            >
                <div className={styles.head}>
                    <h2 id="compare-modal-title" className={styles.title}>
                        Сравнение фильмов
                    </h2>

                    <div className={styles.headActions}>
                        {movies.length > 0 && (
                            <button type="button" className={styles.textButton} onClick={() => clearCompare()}>
                                Очистить
                            </button>
                        )}

                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={() => closeComparePanel()}
                            aria-label="Закрыть"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className={styles.grid}>
                    <Column movie={first} />

                    <Column movie={second} />
                </div>
            </div>
        </div>
    );

    return createPortal(node, document.body);
}
