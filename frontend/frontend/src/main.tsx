import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

const isDev = import.meta.env.MODE === 'development'

if (isDev) {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <HashRouter>
                <App />
            </HashRouter>
        </StrictMode>,
    )
} else {
    createRoot(document.getElementById('root')!).render(
        <HashRouter>
            <App />
        </HashRouter>
    )
}

// createRoot(document.getElementById('root')!).render(
//     <StrictMode>
//         <HashRouter>
//             <App />
//         </HashRouter>
//     </StrictMode>,
// )