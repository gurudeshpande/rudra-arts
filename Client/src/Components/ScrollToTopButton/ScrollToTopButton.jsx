import { useEffect, useState } from "react";
import { FaArrowUp, FaWhatsapp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show buttons when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Cleanup
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll
    });
  };

  return (
    isVisible && (
      <div className="fixed bottom-14 right-6 z-50 flex flex-col gap-4">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/917028996666?text=Hello%20Rudra%20Arts!%20I%20am%20interested%20in%20your%20products."
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center p-3 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-all duration-300"
        >
          <FaWhatsapp className="text-xl" />
        </a>

        {/* Scroll To Top Button */}
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-customBrown text-white shadow-lg hover:bg-yellow-500 transition-all duration-300"
        >
          <FaArrowUp className="text-xl" />
        </button>
      </div>
    )
  );
};

export default ScrollToTopButton;
