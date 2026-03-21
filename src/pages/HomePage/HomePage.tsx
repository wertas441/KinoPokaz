import { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";

export default function HomePage() {

    useLayoutEffect(() => {
        document.title = "Главная | KinoPokaz";
    }, []);

    return (
        <main className={styles.page}>
            <div className={styles.inner}>
                <section className={styles.hero} aria-labelledby="home-hero-title">

                    <div className={styles.heroInner}>
                        <h1 id="home-hero-title" className={styles.title}>
                            <span className={styles.titleAccent}>KinoPokaz</span> - фильмы, которые хочется найти, а не листать часами
                        </h1>

                        <p className={styles.lead}>
                            Подбирайте картины по жанрам, году и рейтингу, сохраняйте понравившиеся в избранное и сравнивайте их,
                            весь необходимый функционал в одном месте
                        </p>

                        <div className={styles.ctaRow}>
                            <Link className={styles.btnPrimary} to="/movies">
                                Открыть каталог
                            </Link>

                            <Link className={styles.btnSecondary} to="/favorites">
                                Избранное
                            </Link>
                        </div>

                        <p className={styles.heroNote}>
                            Фильтры и сортировка синхронизируются с адресной строкой - можно поделиться подборкой ссылкой
                        </p>
                    </div>
                </section>

                <section className={styles.bottomCta} aria-labelledby="home-cta-title">
                    <h2 id="home-cta-title" className={styles.bottomTitle}>
                        Готовы выбрать фильм на вечер?
                    </h2>

                    <p className={styles.bottomText}>
                        Загляните в каталог - карточки с постерами и рейтингами, отдельная страница
                        для каждого фильма с описанием и датами премьер
                    </p>

                    <div className={styles.ctaRow}>
                        <Link className={styles.btnPrimary} to="/movies">
                            Перейти к фильмам
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
