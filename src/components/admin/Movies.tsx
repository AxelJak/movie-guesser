import { useState } from 'react';
import { useQuery, useZero } from '@rocicorp/zero/react';
import { Movie, MovieList, Schema } from '../../schema';
import Input from '../Input';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export default function Movies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [selectedListId, setSelectedListId] = useState('');
  const z = useZero<Schema>();
  // const movieQuery = z.query.movie;
  // const [movies] = useQuery(movieQuery);
  const listQuery = z.query.list;
  const [lists] = useQuery(listQuery);

  function addMovie(movie: Movie) {
    z.mutate.movie.upsert(movie);
  }

  function addToList(list: MovieList) {
    z.mutate.movie_list.insert(list);
  }

  const searchTMDB = async () => {
    let url = `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1`;
    if (customSearchQuery !== '') {
      url = customSearchQuery;
    }
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TMDB_API_KEY}`,
        }
      };
      const response = await fetch(url, options) 
      const data = await response.json();
      const filteredResults = data.results.filter((movie: TMDBMovie) => !!movie.poster_path && !!movie.release_date);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching TMDB:', error);
    }
  };

  const handleAddMovie = async (tmdbMovie: TMDBMovie) => {
    const movie: Movie = {
      id: tmdbMovie.id.toString(),
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      poster_path: tmdbMovie.poster_path,
      backdrop_path: tmdbMovie.backdrop_path,
      release_date: tmdbMovie.release_date,
      vote_average: tmdbMovie.vote_average,
      vote_count: tmdbMovie.vote_count,
    };

    addMovie(movie);
    
    if (selectedListId) {
      addToList({
        movie_id: movie.id,
        list_id: selectedListId,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Search Movies</h2>
        <div className="flex gap-4 mb-4">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                searchTMDB();
              }
            }}
            placeholder="Search for movies..."
            className="flex-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            onClick={searchTMDB}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Search
          </button>
        </div>
        <div className="flex gap-4 mb-4">
          <Input
            type="text"
            value={customSearchQuery}
            onChange={(e: any) => setCustomSearchQuery(e.target.value)}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                searchTMDB();
              }
            }}
            placeholder="https://api.themoviedb.org/3..."
            className="flex-1 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            onClick={searchTMDB}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Get lucky
          </button>
        </div>
        
        <div className="mb-4">
          <select
            value={selectedListId}
            onChange={(e) => setSelectedListId(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a list</option>
            {lists?.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>
      </div>

        <div className="bg-white shadow sm:rounded-lg p-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {searchResults.map((movie) => (
              <div key={movie.id} className="border rounded-lg p-4">
                {movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto rounded-lg mb-2"
                  />
                )}
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{movie.release_date}</p>
                <button
                  onClick={() => handleAddMovie(movie)}
                  className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                >
                  Add Movie
                </button>
              </div>
            ))}
          </div>
        </div>

      {/* <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Added Movies</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {movies?.map((movie) => (
            <div key={movie.id} className="border rounded-lg p-4">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto rounded-lg mb-2"
                />
              )}
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="text-sm text-gray-600">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div> */}
    </div> 
  );
}
