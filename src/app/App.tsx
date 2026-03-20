import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import LayoutWrapper from "../lib/LayoutWrapper.tsx";
import HomePage from "../pages/HomePage/HomePage.tsx";
import MoviesPage from "../pages/MoviesPage/MoviesPage.tsx";
import FavoriteMoviePage from "../pages/FavoriteMoviePage/FavoriteMoviePage.tsx";
import MovieDetailsPage from "../pages/MovieDetailsPage/MovieDetailsPage.tsx";

export default function App() {

    return (
        <BrowserRouter>
            <LayoutWrapper>
                <Routes>
                    <Route path="/" element={<HomePage />} />

                    <Route path="/movies" element={<MoviesPage />} />
                    <Route path="/movies/:id" element={<MovieDetailsPage />} />

                    <Route path="/favorites" element={<FavoriteMoviePage />} />
                </Routes>
            </LayoutWrapper>
        </BrowserRouter>
    );
}

