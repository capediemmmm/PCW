import { Routes, Route } from 'react-router-dom'
import Home from './pages/home/Home'
import MainPage from './pages/main_page/MainPage'
import Settings from './pages/settings/Settings'
import NotFound from "./pages/notfound/Notfound";

import './App.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/index" element={<MainPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App
