import { useEffect, useState } from 'react';
import StarRating from '../StarRating';
import { useKey } from '../useKey';
import Loader from './Loader';

const APIKEY = 'dcd9531d';

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

export default SelectedMovie;