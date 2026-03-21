import { NavLink } from "react-router-dom";
import { useUnit } from "effector-react";
import styles from "./Header.module.css";
import { appNavItems } from "../../../lib";
import { $compareMovies, openComparePanel } from "../../../lib/store/compareMovieStore.ts";
import {MemoLink} from "../../../lib/utils";

export default function Header() {

    const compareMovies = useUnit($compareMovies);
    const compareCount = compareMovies.length;

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <MemoLink to="/" className={styles.brand} aria-label="KinoPokaz — на главную">
                    <span className={styles.logo} aria-hidden>
                        KP
                    </span>

                    <span className={styles.brandText}>KinoPokaz</span>
                </MemoLink>

                <nav className={styles.nav} aria-label="Основная навигация">
                    {appNavItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.to}
                            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ""}`.trim()}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.actions}>
                    <button
                        className={styles.compare}
                        type="button"
                        onClick={() => openComparePanel()}
                        aria-label={
                            compareCount > 0
                                ? `Открыть сравнение, выбрано фильмов: ${compareCount}`
                                : "Открыть сравнение фильмов"
                        }
                    >
                        Сравнение
                    </button>
                </div>
            </div>
        </header>
    );
}
