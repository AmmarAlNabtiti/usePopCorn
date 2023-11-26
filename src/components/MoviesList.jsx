import Movie from './Movie';

function MoviesList({ movies, handleSelectMovie }) {


    return (
        <ul className="list list-movies">
            {movies?.map((movie, i) => (
                <Movie handleSelectMovie={handleSelectMovie} key={i} movie={movie} />
            ))}
        </ul>
    );
};


export default MoviesList;