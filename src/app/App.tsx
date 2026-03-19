import {BrowserRouter, Routes, Route} from 'react-router';
import './App.css'

import HomePage from "../pages/HomePage.tsx";

export default function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={ <HomePage /> } />

        </Routes>
      </BrowserRouter>
  )
}

