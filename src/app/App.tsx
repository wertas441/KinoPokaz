import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'

import HomePage from "../pages/HomePage/HomePage.tsx";
import MoviesPage from "../pages/MoviesPage/MoviesPage.tsx";
import FavoriteMoviePage from "../pages/FavoriteMoviePage/FavoriteMoviePage.tsx";

export default function App() {

  return (
      <BrowserRouter>
        <Routes>
            <Route path={`/`} element={ <HomePage /> } />

            <Route path={`/movies`} element={ <MoviesPage /> } />
            <Route path={`/favorites`} element={ <FavoriteMoviePage /> } />
        </Routes>
      </BrowserRouter>
  )
}

