import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import Searchbar from "../component/Searchbar";
import Movecard from "../component/Movecard";
import Footer from "../component/footer";

const SCROLL_WHITE_AFTER = 28;

function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_WHITE_AFTER);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Fixed home header: transparent on hero, solid white after scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-out ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <Navbar homeSticky scrolled={scrolled} />
      </header>

      <div
        className="
          min-h-screen
          bg-cover
          bg-center
          flex
          flex-col
        "
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1546349749-c95c55859424?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
        }}
      >
        {/* Offset for fixed navbar — keeps search bar aligned under nav */}
        <div className="h-[4.5rem] sm:h-[5rem] shrink-0" aria-hidden="true" />

        <div className="text-center text-yellow-50 mt-2 sm:mt-4 text-2xl sm:text-4xl font-bold px-4 drop-shadow-md">
          Book Your Next Adventure
        </div>

        <div
          className="
            flex
            flex-1
            justify-center
            items-start
            px-4
            sm:px-6
            md:px-8
            lg:px-10
            py-6
            sm:py-8
            md:py-10
          "
        >
          <Searchbar />
        </div>

        <div
          className="
            px-4
            sm:px-6
            md:px-8
            lg:px-10
            pb-6
            sm:pb-8
            md:pb-10
          "
        >
          <Movecard />
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Home;
