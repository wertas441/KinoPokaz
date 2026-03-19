import type {ReactNode} from "react";
import Header from "../components/UI/header/Header.tsx";
import Footer from "../components/UI/footer/Footer.tsx";

export default function LayoutWrapper({children}: {children: ReactNode}) {

    return (
        <>
            <Header />

            {children}

            <Footer />
        </>
    )
}