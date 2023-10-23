import { useEffect, useRef, useState } from "react";
import StarRating from './StarRating';
import { useMovies } from './useMovies';
import { useLocalStorage } from './useLocalStorage';
import { useKey } from './useKey';
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const APIKEY = 'dcd9531d';

export default function App() {
  const [query, setQuery] = useState("");
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

function Navbar({ children }) {

  return (
    <>
      <nav className="nav-bar">
        {children}
      </nav>
    </>
  );
}

function Main({ children }) {



  return (
    <main className="main">
      {children}
    </main>
  );
}


// NAVBAR COMPONENTS
function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  const callback = () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  };

  useKey('Enter', callback);



  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResults({ movies = [] }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}


// MAIN COMPONENTS

// 1 ) Movies List


function MoviesList({ movies, handleSelectMovie }) {


  return (
    <ul className="list list-movies">
      {movies?.map((movie, i) => (
        <Movie handleSelectMovie={handleSelectMovie} key={i} movie={movie} />
      ))}
    </ul>
  );
};

function Movie({ movie, handleSelectMovie }) {




  return (
    <li onClick={() => handleSelectMovie(movie.imdbID)} key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function SelectedMovie({ selectedId, handleCloseMovieDetails, handleAddToWatchlist, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  useKey('Escape', handleCloseMovieDetails);
  const isWatched = watched.find((movie) => {
    return movie.imdbID === selectedId;
  });
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    Plot: plot,
    imdbRating,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie;


  useEffect(() => {

    const controller = new AbortController();

    async function getMovieDetail() {
      setIsLoading(true);

      const res = await fetch(`https://www.omdbapi.com/?i=${selectedId}&apikey=${APIKEY}`);
      const movie = await res.json();
      setIsLoading(false);
      setMovie(movie);
    }
    getMovieDetail();



  }, [selectedId]);

  useEffect(() => {
    !movie ? document.title = 'usePopCorn' : document.title = title;
    return () => document.title = 'usePopCorn';
  }, [movie]);




  const handleAdd = (movie) => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating
    };
    handleAddToWatchlist(newWatchedMovie);
    handleCloseMovieDetails();
  };

  return (
    <div className='details'>
      {isLoading ? <Loader /> :
        <>
          <header>
            <button onClick={handleCloseMovieDetails} className='btn-back'> &larr; </button>
            <img src={poster} alt={`poster of the ${title}`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>{released} &bull; {runtime}</p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            {!isWatched ?
              <div className='rating'>
                <StarRating onSetRating={setUserRating} />
                {userRating > 0 && <button onClick={handleAdd} className='btn-add '>Add to list</button>}
              </div> :
              <div className='rating'>
                <p>You rate this movie with {isWatched.userRating}⭐ </p>
              </div>
            }
            <p><em>{plot}</em></p>
            <p>Starring {actors}</p>
            <p>Diricted by {director}</p>
          </section>
        </>
      }
    </div>

  );
}

// 2 ) Watched List


function WatchedSummary({ watched }) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{Math.round(avgImdbRating)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{Math.round(avgUserRating)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.round(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, handleDelete }) {
  return (
    <ul className="list">
      {watched.map((movie, i) => (
        <WatchedMovie key={i} movie={movie} handleDelete={handleDelete} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, handleDelete }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button onClick={() => handleDelete(movie.imdbID)} className='btn-delete'>X</button>
      </div>
    </li>
  );
}


// GLOBAL COMPONENTS
function ToggleButton({ setIsOpen, isOpen }) {
  return (
    <button
      className="btn-toggle"
      onClick={() => setIsOpen((open) => !open)}
    >
      {isOpen ? "–" : "+"}
    </button>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && (children)}
    </div>
  );
}

function Loader() {
  return (
    <p className='loader'>Loader...</p>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>❌</span>{message}
    </p>
  );
}