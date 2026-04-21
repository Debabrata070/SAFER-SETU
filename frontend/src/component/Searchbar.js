import { useState } from "react";
import FlightSearch from "./search/FlightSearch";
import HotelSearch from "./search/HotelSearch";
import TrainSearch from "./search/TrainSearch";
import MovieSearch from "./search/MovieSearch";


function SearchBar() {
  const [activeTab, setActiveTab] = useState("hotels");

  const handleMaintenanceTab = () => {
    alert("Feature under maintenance 🚧");
  };

  const handleTabChange = (tab) => {
    if (tab === "flights" || tab === "movies") {
      handleMaintenanceTab();
      return;
    }
    setActiveTab(tab);
  };

  const renderSearch = () => {
    switch (activeTab) {
      case "flights":
        return <FlightSearch />;
      case "hotels":
        return <HotelSearch />;
      case "trains":
        return <TrainSearch />;
      case "movies":
        return <MovieSearch />;
      default:
        return <FlightSearch />;
    }
  };
  

return (
  <div
    className="
      soft-panel
      rounded-xl
      w-full
      sm:w-[95%]
      md:w-[90%]
      lg:w-[80%]
      mx-auto
      p-4
      sm:p-5
      md:p-6
    "
  >
    <div
      className="
        flex
        flex-wrap
        justify-center
        sm:justify-start
        gap-2
        sm:gap-4
        md:gap-6
        border-b
        pb-3
        mb-4
        overflow-x-auto
        scrollbar-hide
      "
    >
      <button
        onClick={() => handleTabChange("flights")}
        className="
          tab-button
          text-sm
          sm:text-base
          whitespace-nowrap
        "
      >
        Flights
      </button>

      <button
        onClick={() => handleTabChange("hotels")}
        className={`tab-button ${
          activeTab === "hotels" ? "tab-button-active" : ""
        } text-sm sm:text-base whitespace-nowrap`}
      >
        Hotels
      </button>

      <button
        onClick={() => handleTabChange("trains")}
        className={`tab-button ${
          activeTab === "trains" ? "tab-button-active" : ""
        } text-sm sm:text-base whitespace-nowrap`}
      >
        Trains
      </button>

      <button
        onClick={() => handleTabChange("movies")}
        className="
          tab-button
          text-sm
          sm:text-base
          whitespace-nowrap
        "
      >
        Movies
      </button>
    </div>

    <div className="w-full overflow-hidden">
      {renderSearch()}
    </div>
  </div>
);
}

export default SearchBar; 

