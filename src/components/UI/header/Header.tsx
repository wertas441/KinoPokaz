import styles from "./Header.module.css";

const navItems = [
    {
        id: 1,
        label: "Список всех фильмов",
        link: "/movies",
    },
    {
        id: 2,
        label: "Избранное",
        link: "/favorites",
    },
] as const;

export default function Header() {

    return (
        <header className={styles.header}>
            <div className={styles.inner}>

                <div className={styles.mainLogo}>
                    <div className={styles.logo}>KP</div>
                    <h1 className={styles.title}>KinoPokaz</h1>
                </div>

                <nav className={styles.nav} aria-label="Основная навигация">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            className={styles.link}
                            href={item.link}
                        >
                            {item.label}
                        </a>
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