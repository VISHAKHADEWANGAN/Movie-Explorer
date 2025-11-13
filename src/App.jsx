import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Home from './Pages/Home'
import MovieDetail from './Pages/MovieDetail'

// Navigation component to handle the favorites button
function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const handleShowFavorites = () => {
    if (location.pathname === '/') {
      // If we're on home page, trigger favorites view
      window.dispatchEvent(new CustomEvent('showFavorites'))
    } else {
      // If we're on movie detail page, navigate to home with favorites
      navigate('/?favorites=true')
    }
  }

  const handleHomeClick = () => {
    // Always navigate to home and show search page (not favorites)
    if (location.pathname !== '/') {
      navigate('/')
    } else {
      // If already on home, reset to search view
      window.dispatchEvent(new CustomEvent('showSearch'))
    }
  }

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🎬 Movie Explorer
          </h1>
          
          <nav className="flex items-center gap-4">
            <button
              onClick={handleHomeClick}
              className="hover:text-blue-400 transition-colors px-3 py-2 rounded-lg hover:bg-gray-700 font-semibold"
            >
              Home
            </button>
            
            {/* Favorites Button in Navigation */}
            <button
              onClick={handleShowFavorites}
              className="flex items-center gap-2 hover:text-blue-400  hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              ❤️ FAVORITES
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Routes>
        </main>

        {/* <footer className="bg-gray-800 border-t border-gray-700 mt-12 ">
          <div className="container mx-auto px-4 py-6 text-center text-gray-400">
            <p>Powered by @Vish.. with OMDb API • Built with React & Tailwind CSS</p>
          </div>
        </footer> */}
      </div>
    </Router>
  )
}

export default App