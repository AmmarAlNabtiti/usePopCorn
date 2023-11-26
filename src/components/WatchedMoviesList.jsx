import WatchedMovie from './WatchedMovie';

function WatchedMoviesList({ watched, handleDelete }) {
    return (
        <ul className="list">
            {watched.map((movie, i) => (
                <WatchedMovie key={i} movie={movie} handleDelete={handleDelete} />
            ))}
        </ul>
    );
}

export default WatchedMoviesList;
