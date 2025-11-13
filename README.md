# 🎬 Movie Explorer

A modern, responsive React application for exploring movies using the OMDb API. Built with React, Vite, and Tailwind CSS.

## ✨ Features

- 🔍 **Search Movies** - Search for movies by title with real-time results
- 🎬 **Movie Details** - Comprehensive movie information with posters, ratings, and more
- ❤️ **Favorites System** - Add/remove movies from favorites with localStorage persistence
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 🔄 **Pagination** - Navigate through search results efficiently
- ⚡ **Fast Performance** - Built with Vite for optimal performance

## 🚀 Live Demo

https://movie-explorer-2523.vercel.app/

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **API**: OMDb API
- **State Management**: React Hooks + localStorage
- **Icons**: Emoji-based icons

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OMDb API key ([Get it here](http://www.omdbapi.com/apikey.aspx))

### Steps

1. **Clone the repository**
   git clone https://github.com/your-username/movie-explorer.git
   cd movie-explorer
2. Install dependencies
   npm install

3. Set up environment variables
    cp .env.example .env
   
4. Start development server
   npm run dev

5. Build for production
   npm run build

# 🎯 Project Structure

   movie-explorer/
 ├── public/
 │   └── placeholder-movie.jpg
 ├── src/
 │   ├── components/         
 │   │   ├── (Modular components)
 │   ├── hooks/              
 │   │   └── useLocalStorage.js
 │   ├── pages/              
 │   ├── Home.jsx
 │   │   └── MovieDetail.jsx
 │   ├── services/          
 │   │   └── movieApi.js
 │   ├── App.jsx
 │   ├── main.jsx
 │   └── index.css
 ├── .env.example
 ├── tailwind.config.js
 ├── vite.config.js
 └── package.json

# 🎨 Key Features Explained

# Search Functionality

- Real-time movie search with OMDb API
- Loading states with elegant spinners
- Error handling for failed requests
- Pagination for large result sets

# Movie Details

- Comprehensive movie information display
- Genre badges with gradient styling
- IMDb ratings and metadata
- Full-size poster images
- Responsive layout

# Favorites System

- ❤️ Add/remove movies from favorites
- 💾 Persistent storage using localStorage
- 🔄 Sync across browser sessions
- 📱 Easy access from navigation

# Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

# 📱 Screenshots

# Home Page

<img width="1904" height="866" alt="Screenshot 2025-11-13 110122" src="https://github.com/user-attachments/assets/082b46c9-64a9-4105-8d19-fc1300da8873" />

# Search Results

<img width="1893" height="859" alt="Screenshot 2025-11-13 110223" src="https://github.com/user-attachments/assets/49d66276-2691-43e8-80c5-539cbf854f7d" />

# Movie Details

<img width="1011" height="733" alt="Screenshot 2025-11-13 110316" src="https://github.com/user-attachments/assets/f0b57216-12bc-4798-a167-65961bad8e77" />

# Favorites Page

<img width="1773" height="842" alt="Screenshot 2025-11-13 110356" src="https://github.com/user-attachments/assets/f19d625e-a8b4-4fda-8c92-9c6fe209b584" />

   
