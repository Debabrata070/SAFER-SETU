 
function MovieSearch() {
  const handleMaintenance = () => {
    alert("Feature under maintenance 🚧");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="border p-3 rounded-lg w-full">
        <p className="text-xs text-gray-400 mb-1">Movie</p>
        <input
          placeholder="Choose a movie"
          className="outline-none font-semibold w-full min-w-0 text-sm sm:text-base"
          readOnly
        />
      </div>

      <div className="border p-3 rounded-lg w-full">
        <p className="text-xs text-gray-400 mb-1">City</p>
        <input
          placeholder="Select city"
          className="outline-none font-semibold w-full min-w-0 text-sm sm:text-base"
          readOnly
        />
      </div>

      <div className="border p-3 rounded-lg w-full">
        <p className="text-xs text-gray-400 mb-1">Show Time</p>
        <input
          placeholder="Coming soon"
          className="outline-none font-semibold w-full min-w-0 text-sm sm:text-base"
          readOnly
        />
      </div>

      <button
        type="button"
        onClick={handleMaintenance}
        className="font-semibold w-full text-sm sm:text-base"
      >
        Search
      </button>
    </div>
  );
}

export default MovieSearch;
