import styles from './MovieCard.module.css'
import type {Movie} from "../../../types/Movie.ts";

export default function MovieCard({id, poster, title, year, rating} : Movie) {

    const addToFavorite = () => {

    }

    const addToSort = () => {

    }

    return (
        <article className={styles.card}>
            <div className={styles.poster}>
                <img src={poster} alt={title} />
                <span className={styles.rating}>{rating}</span>
            </div>

            <div className={styles.cardBody}>
                <div>
                    <h3 className={styles.cardTitle}>{title}</h3>

                    <p className={styles.cardMeta}>{year}</p>

                    <div className={styles.actions}>
                        <button className={styles.actionButton} type="button">
                            В избранное
                        </button>

                        <button className={styles.actionButton} type="button">
                            Сравнить
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}