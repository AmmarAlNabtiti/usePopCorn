import { useEffect, useState } from 'react';

const APIKEY = 'dcd9531d';

export function useMovies(query, setQuery) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    // QUERY MOVIES API
    useEffect(() => {
        setIsLoading(true);
        setError('');
        setQuery(query.toLowerCase().trim());
        const controller = new AbortController();

        fetch(`https://www.omdbapi.com/?s=${query}&apikey=${APIKEY}`, {
            signal: controller.signal
        })
            .then((res) => res.json())
            .then((movie) => {
                (movie.Response === 'False') && setError(movie['Error']);
                setMovies(movie.Search);
                // handleCloseMovieDetails();
                setIsLoading(false);

            }).catch((err) => {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }

                console.error("Error fetching data:", err);
                setIsLoading(false);
            }).finally(() => {
                if (query.length < 3) {
                    setMovies([]);
                    setError('');
                }
            });

        return () => {
            controller.abort();
        };

    }, [query, setQuery]);

    return { isLoading, movies, error };
} 