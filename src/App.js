import { useState } from "react";
import { useMovies } from './useMovies';
import { useLocalStorage } from './useLocalStorage';
import Navbar from './components/Navbar';
import Search from './components/Search';
import NumResults from './components/NumResults';
import Box from './components/Box';
import Loader from './components/Loader';
import MoviesList from './components/MoviesList';
import ErrorMessage from './components/ErrorMessage';
import SelectedMovie from './components/SelectedMovie';
import WatchedSummary from './components/WatchedSummary';
import WatchedMoviesList from './components/WatchedMoviesList';
import Logo from './components/Logo';
import Main from './components/Main';


export default function App() {
  const [query, setQuery] = useState("interstellar");
  const [selectedId, setSelectedId] = useState(null);
  const { isLoading, movies, error } = useMovies(query, setQuery);
  const [watched, setWatched] = useLocalStorage();

  // HANDLERS
  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => id === selectedId ? setSelectedId(null) : id);
  };
  const handleCloseMovieDetails = () => {
    setSelectedId(null);
  };
  const handleAddToWatchlist = (movie) => {
    setWatched([...watched, movie]);
  };
  const handleDelete = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>

        <Box>
          {
            isLoading && <Loader />
          }
          {
            !isLoading && !error && <MoviesList handleCloseMovieDetails={handleCloseMovieDetails} handleSelectMovie={handleSelectMovie} movies={movies} />
          }
          {
            (error) && <ErrorMessage message={error} />
          }
        </Box>

        <Box>
          <>
            {selectedId ? <SelectedMovie handleCloseMovieDetails={handleCloseMovieDetails} handleAddToWatchlist={handleAddToWatchlist} watched={watched} selectedId={selectedId} /> :
              <>
                <WatchedSummary watched={watched} />
                <WatchedMoviesList handleDelete={handleDelete} watched={watched} />
              </>
            }
          </>

        </Box>
      </Main>
    </>
  );
}





