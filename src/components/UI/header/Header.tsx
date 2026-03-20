import { NavLink, Link } from "react-router-dom";
import styles from "./Header.module.css";
import {appNavItems} from "../../../lib";

export default function Header() {

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link to="/" className={styles.brand} aria-label="KinoPokaz — на главную">
                    <span className={styles.logo} aria-hidden>
                        KP
                    </span>

                    <span className={styles.brandText}>KinoPokaz</span>
                </Link>

                <nav className={styles.nav} aria-label="Основная навигация">
                    {appNavItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.to}
                            className={({ isActive }) =>
                                `${styles.link} ${isActive ? styles.linkActive : ""}`.trim()
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.actions}>
                    <button className={styles.compare} type="button">
                        Сравнение
                    </button>
                </div>
            </div>
        </header>
    );
}
