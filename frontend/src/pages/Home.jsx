import { Link } from "react-router-dom";

const movies = [
  { id: 1, title: "Inception", rating: "8.8", img: "https://image.tmdb.org/t/p/w500/9gk7admal4zl6hYyrStg8Y8J968.jpg" },
  { id: 2, title: "Interstellar", rating: "8.6", img: "https://image.tmdb.org/t/p/w500/gEU2QniL6C8z1dY4uvReqETvDn.jpg" },
  { id: 3, title: "The Dark Knight", rating: "9.0", img: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
  { id: 4, title: "Avengers: Endgame", rating: "8.4", img: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
];

function Home() {
  return (
    <div className="p-5 max-w-6xl mx-auto">
      <nav className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-movie-yellow">IMDB-Lite</h1>
        <div className="flex gap-4">
          <Link to="/register" className="bg-movie-yellow text-black px-4 py-2 rounded font-bold hover:bg-yellow-400 transition">
            Sign Up
          </Link>
          <Link to="/login" className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 transition text-white">
  Login
</Link>
        </div>
      </nav>

      <h2 className="text-xl mb-4 font-semibold text-gray-300">Top Rated Movies</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-movie-gray p-4 rounded-lg shadow-lg hover:scale-105 transition duration-300">
            <div className="h-64 bg-gray-700 rounded mb-3 overflow-hidden">
               <img src={movie.img} alt={movie.title} className="w-full h-full object-cover"/>
            </div>
            <h3 className="text-lg font-bold text-white">{movie.title}</h3>
            <span className="text-movie-yellow">⭐ {movie.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;