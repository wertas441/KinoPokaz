import {useLayoutEffect} from "react";

export default function HomePage() {

    useLayoutEffect(() => {
        document.title = "Главная | KinoPokaz";
    }, []);

    return (
        <>

        </>
    )
}
