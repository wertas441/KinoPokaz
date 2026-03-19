import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'

import HomePage from "../pages/HomePage/HomePage.tsx";
import MoviesPage from "../pages/MoviesPage/MoviesPage.tsx";

export default function App() {

  return (
      <BrowserRouter>
        <Routes>
            <Route path={`/`} element={ <HomePage /> } />

            <Route path={`/movies`} element={ <MoviesPage /> } />

        </Routes>
      </BrowserRouter>
  )
}

