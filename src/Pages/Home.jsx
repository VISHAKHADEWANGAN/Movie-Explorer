import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLocalStorage } from '../hooks/UseLocalStorage'

const API_KEY =  import.meta.env.VITE_OMDB_API_KEY || '81db19ce'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [favorites, setFavorites] = useLocalStorage('movieFavorites', [])
  const [showFavorites, setShowFavorites] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  // Check URL parameters for favorites on component mount
  useEffect(() => {
    const favoritesParam = searchParams.get('favorites')
    if (favoritesParam === 'true') {
      setShowFavorites(true)
    }
  }, [searchParams])

  // Listen for custom event from navigation - Show Favorites
  useEffect(() => {
    const handleShowFavorites = () => {
      setShowFavorites(true)
      setSearchParams({ favorites: 'true' })
    }

    // Listen for custom event from navigation - Show Search
    const handleShowSearch = () => {
      setShowFavorites(false)
      setSearchParams({})
      setSearchTerm('')
      if (movies.length === 0) {
        loadPopularMovies()
      }
    }

    window.addEventListener('showFavorites', handleShowFavorites)
    window.addEventListener('showSearch', handleShowSearch)
    
    return () => {
      window.removeEventListener('showFavorites', handleShowFavorites)
      window.removeEventListener('showSearch', handleShowSearch)
    }
  }, [setSearchParams, movies.length])

  const searchMovies = async (page = 1) => {
    if (!searchTerm.trim()) {
      loadPopularMovies()
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchTerm)}&page=${page}`
      )
      const data = await response.json()
      
      if (data.Response === 'True') {
        setMovies(data.Search || [])
        setTotalResults(parseInt(data.totalResults))
      } else {
        setMovies([])
        setTotalResults(0)
      }
    } catch (error) {
      console.error('Error searching movies:', error)
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  const loadPopularMovies = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=avengers`
      )
      const data = await response.json()
      if (data.Response === 'True') {
        setMovies(data.Search || [])
      }
    } catch (error) {
      console.error('Error loading movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    setShowFavorites(false)
    setSearchParams({})
    searchMovies(1)
  }

  const toggleFavorite = (movie) => {
    const isCurrentlyFavorite = favorites.some(fav => fav.imdbID === movie.imdbID)
    
    if (isCurrentlyFavorite) {
      setFavorites(prev => prev.filter(fav => fav.imdbID !== movie.imdbID))
    } else {
      const movieToSave = {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Type: movie.Type
      }
      setFavorites(prev => [...prev, movieToSave])
    }
  }

  const clearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      setFavorites([])
    }
  }

  const showAllMovies = () => {
    setShowFavorites(false)
    setSearchParams({})
    if (!searchTerm) {
      loadPopularMovies()
    }
  }

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.imdbID === movieId)
  }

  const totalPages = Math.ceil(totalResults / 10)

  // Load popular movies on initial render
  useEffect(() => {
    loadPopularMovies()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {showFavorites ? 'Your Favorite Movies' : 'Discover Amazing Movies'}
        </h2>
        <p className="text-gray-400 mb-8">
          {showFavorites 
            ? `You have ${favorites.length} favorite movie${favorites.length !== 1 ? 's' : ''}`
            : 'Search for your favorite movies and explore details'
          }
        </p>
      </div>

      {/* Search Section - Only show when not viewing favorites */}
      {!showFavorites && (
        <div className="mb-12">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for movies by title..."
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  '🔍 Search'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Favorites Header with Clear Button */}
      {showFavorites && favorites.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-red-400">
            ❤️ Your Favorite Movies ({favorites.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={showAllMovies}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Show All Movies
            </button>
            <button
              onClick={clearFavorites}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* No Favorites State */}
      {!loading && showFavorites && favorites.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💔</div>
          <p className="text-xl text-gray-400 mb-4">No favorites yet</p>
          <p className="text-gray-500 mb-6">Start adding movies to your favorites by clicking the heart icon!</p>
          <button
            onClick={showAllMovies}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Browse Movies
          </button>
        </div>
      )}

      {/* No Search Results */}
      {!loading && !showFavorites && movies.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-xl text-gray-400 mb-2">No movies found for "{searchTerm}"</p>
          <p className="text-gray-500">Try searching for something else</p>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && ((showFavorites && favorites.length > 0) || (!showFavorites && movies.length > 0)) && (
        <>
          {!showFavorites && (
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'Popular Movies'}
              </h3>
              {totalResults > 0 && <span className="text-gray-400">{totalResults} results</span>}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {(showFavorites ? favorites : movies).map(movie => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                isFavorite={isFavorite(movie.imdbID)}
                onToggleFavorite={toggleFavorite}
                showFavorites={showFavorites}
              />
            ))}
          </div>

          {/* Pagination - Only show for search results */}
          {!showFavorites && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1))
                  searchMovies(currentPage - 1)
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1))
                  searchMovies(currentPage + 1)
                }}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// MovieCard Component
const MovieCard = ({ movie, isFavorite, onToggleFavorite, showFavorites }) => {
  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite(movie)
  }

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group ${
      showFavorites ? 'border-2 border-yellow-500' : ''
    }`}>
      <div className="relative">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450/1f2937/ffffff?text=No+Poster'}
          alt={movie.Title}
          className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity"
        />
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-2 bg-gray-900 bg-opacity-80 rounded-full hover:scale-110 transition-all text-lg ${
            isFavorite ? 'text-red-500' : 'text-white'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        <div className="absolute bottom-2 left-2 bg-blue-600 px-2 py-1 rounded text-sm font-semibold">
          {movie.Year}
        </div>
        {showFavorites && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-bold">
            FAVORITE
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          <Link to={`/movie/${movie.imdbID}`} className="hover:underline">
            {movie.Title}
          </Link>
        </h3>
        <p className="text-gray-400 text-sm capitalize">{movie.Type}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-blue-400 text-sm">View Details →</span>
          {isFavorite && !showFavorites && (
            <span className="text-red-400 text-sm">Favorited</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home