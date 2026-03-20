import type { ReactNode } from "react";
import Header from "../components/UI/header/Header.tsx";
import Footer from "../components/UI/footer/Footer.tsx";
import CompareMoviesModal from "../components/UI/modalWindows/compareMoviesModal/CompareMoviesModal.tsx";
import styles from "./LayoutWrapper.module.css";

export default function LayoutWrapper({ children }: { children: ReactNode }) {
    return (
        <div className={styles.root}>
            <Header />

            <div className={styles.content}>{children}</div>

            <Footer />

            <CompareMoviesModal />
        </div>
    );
}