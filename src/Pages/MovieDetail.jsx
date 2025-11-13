import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '../hooks/UseLocalStorage'

const API_KEY =  import.meta.env.VITE_OMDB_API_KEY || '81db19ce'

const MovieDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useLocalStorage('movieFavorites', [])

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
        )
        const data = await response.json()
        setMovie(data)
      } catch (error) {
        console.error('Error fetching movie details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id])

  const toggleFavorite = () => {
    if (!movie) return

    const movieToSave = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Type: movie.Type
    }

    const isCurrentlyFavorite = favorites.some(fav => fav.imdbID === movie.imdbID)
    
    if (isCurrentlyFavorite) {
      setFavorites(prev => prev.filter(fav => fav.imdbID !== movie.imdbID))
    } else {
      setFavorites(prev => [...prev, movieToSave])
    }
  }

  const isFavorite = favorites.some(fav => fav.imdbID === id)

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!movie || movie.Response === 'False') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          ← Back to search
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          ← Back to Search
        </button>
        
        <button
          onClick={() => navigate('/?favorites=true')}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          ❤️ View Favorites
        </button>
      </div>

      {/* Movie Details */}
      <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="lg:flex">
          {/* Poster Section */}
          <div className="lg:w-1/3 p-8 flex justify-center lg:justify-start">
            <div className="relative">
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600/1f2937/ffffff?text=No+Poster'}
                alt={movie.Title}
                className="w-full max-w-sm rounded-lg shadow-2xl"
              />
              <button
                onClick={toggleFavorite}
                className={`absolute top-4 right-4 p-3 bg-gray-900 bg-opacity-80 rounded-full hover:scale-110 transition-all text-2xl ${
                  isFavorite ? 'text-red-500 animate-pulse' : 'text-white'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
              {isFavorite && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  FAVORITE
                </div>
              )}
            </div>
          </div>
          
          {/* Details Section */}
          <div className="lg:w-2/3 p-8">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold">{movie.Title}</h1>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {movie.imdbRating}/10
                  </div>
                  <div className="text-sm text-gray-400">IMDb Rating</div>
                </div>
              </div>
              
              {/* Enhanced Genre Display */}
              {movie.Genre && movie.Genre !== 'N/A' && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">Genre</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.Genre.split(', ').map((genre, index) => (
                      <span
                        key={index}
                        className="bg-linear-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {movie.Year}
                </span>
                <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {movie.Rated}
                </span>
                <span className="bg-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {movie.Runtime}
                </span>
                <span className="bg-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {movie.Type}
                </span>
              </div>

              <div className="flex items-center gap-4 text-gray-300 mb-4">
                <span>{movie.Language}</span>
                <span>•</span>
                <span>{movie.Country}</span>
                <span>•</span>
                <span>{movie.Released}</span>
              </div>
            </div>

            {/* Favorite Status */}
            {isFavorite && (
              <div className="mb-6 p-4 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg">
                <p className="text-white font-semibold flex items-center gap-2">
                  ❤️ This movie is in your favorites!
                </p>
              </div>
            )}

            {/* Plot */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-blue-400">Plot</h3>
              <p className="text-gray-300 leading-relaxed text-lg">{movie.Plot}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-400 mb-1">Director</h4>
                  <p className="text-white">{movie.Director}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-400 mb-1">Writers</h4>
                  <p className="text-white">{movie.Writer}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-400 mb-1">Actors</h4>
                  <p className="text-white">{movie.Actors}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-400 mb-1">Release Date</h4>
                  <p className="text-white">{movie.Released}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-400 mb-1">Box Office</h4>
                  <p className="text-white">{movie.BoxOffice || 'N/A'}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-400 mb-1">Awards</h4>
                  <p className="text-white">{movie.Awards}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-700 pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{movie.imdbRating}</div>
                  <div className="text-sm text-gray-400">IMDb Rating</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{movie.imdbVotes}</div>
                  <div className="text-sm text-gray-400">Votes</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{movie.Metascore || 'N/A'}</div>
                  <div className="text-sm text-gray-400">Metascore</div>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{movie.Type}</div>
                  <div className="text-sm text-gray-400">Type</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail