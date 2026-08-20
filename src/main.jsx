import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'
// Compiled Tailwind output from the original static build — imported last so
// every historical utility class resolves exactly as it did on the static site.
import './styles/legacy.css'
// Page-specific component styles extracted verbatim from the static pages.
import './styles/gallery.css'
import './styles/notice.css'
import './styles/governing-body.css'

// GitHub Pages base path — matches repo name satarapolytechnicsatara
const basename = import.meta.env.BASE_URL || '/'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
