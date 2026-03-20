import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import {appNavItems} from "../../../lib";

export default function Footer() {

    const year = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.column}>
                    <Link to="/" className={styles.brand}>
                        <span className={styles.logo} aria-hidden>
                            KP
                        </span>

                        <span className={styles.brandName}>KinoPokaz</span>
                    </Link>

                    <p className={styles.tagline}>Каталог фильмов и персональные подборки</p>
                </div>

                <nav className={styles.nav} aria-label="Навигация в подвале">
                    {appNavItems.map((item) => (
                        <Link
                            key={item.id}
                            to={item.to}
                            className={styles.navLink}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className={styles.bottom}>
                <p className={styles.copy}>© {year} KinoPokaz</p>
            </div>
        </footer>
    );
}
