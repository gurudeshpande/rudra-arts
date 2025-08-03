import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useMediaQuery } from "react-responsive";

const Home = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const slides = [
    {
      type: "product",
      image: isMobile
        ? "/images/mobile/WhatsApp-Image-2025-07-19-at-15.32.21_918c279f-mobile.jpg"
        : "/images/WhatsApp Image 2025-07-19 at 15.32.21_918c279f.jpg",
      title: "Explore Our Collection",
      buttonText: "View Products",
    },
    {
      type: "achievement",
      image: isMobile
        ? "/images/mobile/IMG-20250617-WA0022-mobile.jpg"
        : "/images/IMG-20250617-WA0022.jpg",
      title: "Honored to Meet the President",
      description:
        "We were privileged to present our handcrafted talwar to the Honorable President of India, a moment of great pride for our artisans and tradition.",
      buttonText: "Read More",
    },
    {
      type: "about",
      image: isMobile ? "/images/mobile/img8-mobile.jpg" : "/images/img8.jpg",
      title: "A Tribute to Valor and Legacy",
      description:
        "Inspired by the indomitable spirit of Chhatrapati Shivaji Maharaj, this memento honors the courage, leadership, and sacrifice that defines our armed forces. A timeless symbol of bravery, crafted for those who serve the nation with pride.",
      buttonText: "Read More",
    },
    {
      type: "about",
      image: isMobile ? "/images/mobile/dhoop-mobile.jpg" : "/images/dhoop.jpg",
      title: "Explore Our Dhoop Collection",
      buttonText: "Shop Now",
    },
  ];

  const handleSlideAction = () => {
    if (slides[currentSlide].type === "product") {
      navigate("/Products");
    } else {
      navigate("/About");
    }
  };

  const startSlider = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(
      () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      },
      isMobile ? 7000 : 10000
    ); // Faster rotation on mobile
  };

  const stopSlider = () => {
    clearInterval(intervalRef.current);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    if (isPlaying) {
      stopSlider();
      startSlider();
    }
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    if (isPlaying) {
      stopSlider();
      startSlider();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSlider();
    } else {
      startSlider();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    startSlider();
    return () => stopSlider();
  }, []);

  // Enhanced touch handling for mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    stopSlider(); // Pause during swipe
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // More precise swipe threshold
      goToNext();
    } else if (touchStart - touchEnd < -75) {
      goToPrev();
    }
    if (isPlaying) startSlider(); // Resume if playing
  };

  return (
    <div className="relative w-full h-[70vh] md:h-[700px] flex items-center justify-center overflow-hidden bg-black pt-16 md:pt-20 mt-16 md:mt-20">
      {/* Image Carousel Background */}
      <div
        ref={sliderRef}
        className="absolute top-0 left-0 w-full h-full z-10 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out" // Faster transition on mobile
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover brightness-[0.6]"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Controls - Positioned for thumb reach */}
      {isMobile && (
        <>
          <button
            onClick={togglePlay}
            className="absolute top-24 right-4 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
          </button>
          <button
            onClick={goToPrev}
            className="absolute left-4 bottom-1/3 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition"
            aria-label="Previous slide"
          >
            <FaChevronLeft size={16} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 bottom-1/3 z-20 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition"
            aria-label="Next slide"
          >
            <FaChevronRight size={16} />
          </button>
        </>
      )}

      {/* Desktop Controls (unchanged) */}
      {!isMobile && (
        <>
          <button
            onClick={togglePlay}
            className="absolute top-24 right-6 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/80 transition"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>
          <button
            onClick={goToPrev}
            className="absolute left-6 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/80 transition"
            aria-label="Previous slide"
          >
            <FaChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 z-20 bg-black/50 text-white p-3 rounded-full hover:bg-black/80 transition"
            aria-label="Next slide"
          >
            <FaChevronRight size={20} />
          </button>
        </>
      )}

      {/* Slide Content */}
      <div className="z-10 text-white w-full px-4 md:px-8 lg:px-16 xl:px-24">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 flex items-center ${
              currentSlide === index ? "block" : "hidden"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full h-full flex flex-col justify-center">
              {index === 0 ? (
                <div
                  className={`w-full flex ${
                    isMobile
                      ? "justify-center text-center"
                      : "justify-start text-left"
                  } items-center px-4 sm:pl-8 md:pl-16 lg:pl-24 h-full`}
                >
                  <div
                    className={`flex flex-col ${
                      isMobile ? "items-center" : "items-start"
                    } space-y-4 sm:space-y-6 max-w-2xl`}
                  >
                    <motion.h1
                      className={`${
                        isMobile
                          ? "text-2xl"
                          : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                      } font-normal font-times`}
                      initial={{ opacity: 0, x: isMobile ? 0 : -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1 }}
                    >
                      {isMobile ? (
                        "Explore Our Collection"
                      ) : (
                        <>
                          Explore <br />
                          Our Collection
                        </>
                      )}
                    </motion.h1>

                    {slide.description && !isMobile && (
                      <motion.p
                        className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-times"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 1 }}
                      >
                        {slide.description}
                      </motion.p>
                    )}

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      <Link to="/Products">
                        <button
                          onClick={handleSlideAction}
                          className={`flex items-center gap-2 bg-customBrown text-white hover:bg-red-900 transition duration-500 ${
                            isMobile
                              ? "px-4 py-1.5 text-sm"
                              : "px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg"
                          } font-medium rounded font-times`}
                        >
                          {!isMobile && (
                            <img
                              src="/images/dhaltalwar.png"
                              alt="Left Icon"
                              className="w-4 h-4 sm:w-5 sm:h-5 invert"
                            />
                          )}
                          {slide.buttonText}
                          {!isMobile && (
                            <img
                              src="/images/dhaltalwar.png"
                              alt="Right Icon"
                              className="w-4 h-4 sm:w-5 sm:h-5 invert"
                            />
                          )}
                        </button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              ) : index === 3 ? (
                <div
                  className={`w-full flex ${
                    isMobile
                      ? "justify-center text-center"
                      : "justify-end text-right"
                  } items-center px-4 sm:pr-8 md:pr-16 lg:pr-24 h-full`}
                >
                  <div
                    className={`flex flex-col ${
                      isMobile ? "items-center" : "items-end"
                    } space-y-4 sm:space-y-6 max-w-2xl`}
                  >
                    <motion.h1
                      className={`${
                        isMobile
                          ? "text-2xl"
                          : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                      } font-normal font-times`}
                      initial={{ opacity: 0, x: isMobile ? 0 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1 }}
                    >
                      {slide.title}
                    </motion.h1>

                    {slide.description && !isMobile && (
                      <motion.p
                        className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-times"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 1 }}
                      >
                        {slide.description}
                      </motion.p>
                    )}

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      <Link to="/Products">
                        <button
                          onClick={handleSlideAction}
                          className={`flex items-center gap-2 bg-customBrown text-white hover:bg-red-900 transition duration-500 ${
                            isMobile
                              ? "px-4 py-1.5 text-sm"
                              : "px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg"
                          } font-medium rounded font-times`}
                        >
                          {!isMobile && (
                            <img
                              src="/images/dhaltalwar.png"
                              alt="Left Icon"
                              className="w-4 h-4 sm:w-5 sm:h-5 invert"
                            />
                          )}
                          {slide.buttonText}
                          {!isMobile && (
                            <img
                              src="/images/dhaltalwar.png"
                              alt="Right Icon"
                              className="w-4 h-4 sm:w-5 sm:h-5 invert"
                            />
                          )}
                        </button>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="text-center px-4">
                  <motion.h1
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className={`${
                      isMobile
                        ? "text-2xl mt-20"
                        : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-[6rem] sm:mt-[10rem]"
                    } font-normal font-times mb-3 sm:mb-4`}
                  >
                    {slide.title}
                  </motion.h1>

                  {slide.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 1 }}
                      className={`${
                        isMobile
                          ? "text-sm line-clamp-3"
                          : "text-base sm:text-lg md:text-xl lg:text-2xl"
                      } leading-relaxed font-times mb-4 sm:mb-8 max-w-3xl mx-auto`}
                    >
                      {slide.description}
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex justify-center"
                  >
                    <button
                      onClick={handleSlideAction}
                      className={`flex items-center gap-2 bg-customBrown text-white hover:bg-red-900 hover:text-white transition duration-500 ${
                        isMobile
                          ? "px-4 py-1.5 text-sm"
                          : "px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg"
                      } font-medium rounded font-times`}
                    >
                      {slide.buttonText}
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Home;
  