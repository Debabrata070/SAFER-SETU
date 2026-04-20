import { Link } from "react-router-dom";
import { useState } from "react";
import ProfileDropdown from "./ProfileDrapdown";

/**
 * @param {{ homeSticky?: boolean; scrolled?: boolean }} props
 * homeSticky + scrolled: used only on Home (fixed bar, white bg when scrolled). Defaults keep other pages unchanged.
 */
export default function Navbar({ homeSticky = false, scrolled = false }) {
  const [show, setShow] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navLinkClass =
    homeSticky && scrolled
      ? "text-gray-800 hover:text-blue-600"
      : homeSticky && !scrolled
        ? "text-white hover:text-blue-200 drop-shadow-sm"
        : "text-gray-700 hover:text-blue-500";

  const iconRowClass =
    homeSticky && !scrolled
      ? "hover:bg-white/15 text-white"
      : "hover:bg-gray-100 text-gray-800";

  const burgerClass =
    homeSticky && !scrolled ? "text-white text-2xl" : "text-gray-900 text-2xl";

  const outerClass = homeSticky
    ? "px-3 sm:px-5 py-2 sm:py-2.5"
    : "pt-3 mt-3 px-2 sm:px-4";

  const barClass = homeSticky
    ? "px-3 sm:px-5 py-3 flex items-center justify-between relative bg-transparent border-0 shadow-none rounded-none"
    : "shadow-md px-4 sm:px-6 py-4 flex items-center justify-between border rounded-lg relative";

  return (
    <>
      <div className={outerClass}>
        <nav className={barClass}>
          <div className="flex items-center gap-2">
            <svg
              width="160"
              height="50"
              viewBox="0 0 160 50"
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 sm:w-40"
            >
              <g transform="translate(0,5)">
                <circle cx="25" cy="20" r="18" fill="#2563EB" />
                <path
                  d="M5 28 C18 5, 32 5, 45 20"
                  stroke="white"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <polygon
                  points="28,10 42,16 28,20 32,26 24,20 12,22"
                  fill="white"
                />
              </g>

              <text
                x="50"
                y="31"
                fontFamily="Poppins, Arial, sans-serif"
                fontSize="20"
                fontWeight="600"
                fill="#091fed"
              >
                SafarSetu
              </text>
            </svg>
          </div>

          <ul className={`hidden lg:flex gap-8 font-bold ${navLinkClass}`}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/movies">Movies</Link>
            </li>
            <li>
              <Link to="/flights">Flights</Link>
            </li>
            <li>
              <Link to="/hotels">Hotels</Link>
            </li>
            <li>
              <Link to="/events">Events</Link>
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-2 sm:gap-4">
            <button type="button" className={`p-2 rounded-full ${iconRowClass}`}>
              🔍
            </button>
            <button type="button" className={`p-2 rounded-full ${iconRowClass}`}>
              🔔
            </button>
            <button
              type="button"
              onClick={() => setShow(!show)}
              className={`rounded-full p-2 ${iconRowClass}`}
            >
              👤
            </button>

            <div
              className={`
      absolute
      right-0
      top-14
      z-50
      origin-top-right
      transform
      transition-all
      duration-500
      ease-out
      ${
        show
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-3 pointer-events-none"
      }
    `}
            >
              <ProfileDropdown close={() => setShow(false)} />
            </div>
          </div>

          <button
            type="button"
            className={`lg:hidden p-2 ${burgerClass}`}
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Menu"
          >
            ☰
          </button>
        </nav>

        {mobileMenu && (
          <div className="lg:hidden bg-white shadow-lg rounded-lg mt-2 p-4 space-y-4 border">
            <Link
              to="/"
              className="block hover:shadow-md p-2 rounded cursor-pointer hover:text-blue-500"
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="block hover:shadow-md p-2 rounded cursor-pointer hover:text-blue-500"
            >
              Movies
            </Link>
            <Link
              to="/flights"
              className="block hover:shadow-md p-2 rounded cursor-pointer hover:text-blue-500"
            >
              Flights
            </Link>
            <Link
              to="/hotels"
              className="block hover:shadow-md p-2 rounded cursor-pointer hover:text-blue-500"
            >
              Hotels
            </Link>
            <Link
              to="/events"
              className="block hover:shadow-md p-2 rounded cursor-pointer hover:text-blue-500"
            >
              Events
            </Link>
            <Link
              to="/wishlist"
              className="block hover:shadow-md p-2 rounded cursor-pointer hover:text-blue-500"
            >
              Wishlist
            </Link>
            <Link
              to="/profile"
              className="block hover:shadow-md p-2 rounded cursor-pointer hover:text-blue-500"
            >
              Profile
            </Link>
            <Link
              to="/contact"
              className="block hover:shadow-md p-2 rounded cursor-pointer hover:text-blue-500"
            >
              Contact Us
            </Link>
          </div>
        )}

        {!homeSticky && (
          <div className="text-center text-yellow-50 mt-8 sm:mt-10 text-2xl sm:text-4xl font-bold px-4">
            Book Your Next Adventure
          </div>
        )}
      </div>
    </>
  );
}
