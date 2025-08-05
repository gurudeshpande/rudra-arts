import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../../Contexts/Contexts";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
  FiCheck,
  FiZoomIn,
  FiZoomOut,
  FiShare2,
} from "react-icons/fi";

const ProductDetails = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imageContainerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL_PRODUCTION}/api/products/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
        setSelectedImage(data.product_image?.[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleNextImage = () => {
    if (!product?.product_image) return;
    const nextIndex = (currentImageIndex + 1) % product.product_image.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(product.product_image[nextIndex]);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    scrollThumbnail(nextIndex);
  };

  const handlePrevImage = () => {
    if (!product?.product_image) return;
    const prevIndex =
      (currentImageIndex - 1 + product.product_image.length) %
      product.product_image.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(product.product_image[prevIndex]);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    scrollThumbnail(prevIndex);
  };

  const scrollThumbnail = (index) => {
    if (thumbnailContainerRef.current) {
      const thumbnailWidth = 88;
      thumbnailContainerRef.current.scrollTo({
        left: index * thumbnailWidth - thumbnailWidth * 2,
        behavior: "smooth",
      });
    }
  };

  const handleThumbnailClick = (img, index) => {
    setSelectedImage(img);
    setCurrentImageIndex(index);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
    // Reset position when zooming out to minimum
    if (zoomLevel - 0.25 <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const container = imageContainerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const imgWidth = containerRect.width * zoomLevel;
      const imgHeight = containerRect.height * zoomLevel;

      const maxX = (imgWidth - containerRect.width) / 2;
      const maxY = (imgHeight - containerRect.height) / 2;

      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;

      // Constrain movement to image boundaries
      newX = Math.min(Math.max(newX, -maxX), maxX);
      newY = Math.min(Math.max(newY, -maxY), maxY);

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "grabbing";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-red-600 mt-10 text-xl font-semibold">
        Product not found.
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8 mt-10 font-times font-normal">
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <FiCheck className="text-xl" />
              <span>Product Added to Cart!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-8 z-50"
          >
            <div className="bg-customBrown text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
              <FiCheck className="text-xl" />
              <span>Link copied to clipboard!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4 mt-20">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Products
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image gallery */}
          <div className="space-y-6">
            <div
              className="relative rounded-xl overflow-hidden bg-transparent"
              onWheel={handleWheel}
            >
              <div
                ref={imageContainerRef}
                className="w-full h-[400px] overflow-hidden flex items-center justify-center cursor-grab"
                onMouseDown={handleMouseDown}
                style={isDragging ? { cursor: "grabbing" } : {}}
              >
                <img
                  src={
                    selectedImage.replace(
                      "/upload/",
                      "/upload/w_400,q_auto,f_auto/"
                    ) || "/placeholder.jpg"
                  }
                  alt="Product"
                  loading="lazy"
                  className="object-contain transition-transform duration-300"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                  draggable={false}
                />
              </div>

              {/* Zoom controls */}
              <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className={`p-2 rounded-full shadow-md transition-all duration-300 ${
                    zoomLevel <= 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white/80 text-gray-800 hover:bg-white hover:scale-110"
                  }`}
                  aria-label="Zoom out"
                >
                  <FiZoomOut size={20} />
                </button>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className={`p-2 rounded-full shadow-md transition-all duration-300 ${
                    zoomLevel >= 3
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white/80 text-gray-800 hover:bg-white hover:scale-110"
                  }`}
                  aria-label="Zoom in"
                >
                  <FiZoomIn size={20} />
                </button>
              </div>

              {product.product_image?.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md transition-all duration-300 z-20 hover:bg-white hover:scale-110"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md transition-all duration-300 z-20 hover:bg-white hover:scale-110"
                    aria-label="Next image"
                  >
                    <FiChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {product.product_image?.length > 1 && (
              <div className="relative">
                <div
                  ref={thumbnailContainerRef}
                  className="flex space-x-3 overflow-x-auto py-2 scrollbar-hide"
                >
                  {product.product_image.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(img, index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        currentImageIndex === index
                          ? "border-orange-500 ring-1 ring-orange-300"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={
                          img.replace(
                            "/upload/",
                            "/upload/w_400,q_auto,f_auto/"
                          ) || "/placeholder.jpg"
                        }
                        loading="lazy"
                        alt={`Thumbnail ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="lg:pt-8">
            <div className="space-y-6">
              <h1 className="text-4xl text-gray-900 tracking-tight">
                {product.product_name}
              </h1>

              <div className="flex items-center space-x-4">
                <p className="text-3xl font-semibold text-orange-600">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(product.product_price)}
                </p>
              </div>

              {product.product_size !== "0" ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Size:</span>
                  <span className="font-medium">{product.product_size}</span>
                </div>
              ) : (
                ""
              )}

              <div className="prose text-gray-500 max-w-none">
                <p>
                  {product.product_description || "No description provided."}
                </p>
              </div>

              <div className="flex flex-row sm:flex-col gap-4 pt-4">
                {/* Add to Cart Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => handleAddToCart(product)}
                  className="w-50 bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
                >
                  Add to cart
                </motion.button>

                {/* Share Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => {
                    const productUrl = `${window.location.origin}/product-details/${id}`;
                    navigator.clipboard.writeText(productUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center justify-center gap-2 bg-customBrown hover:bg-orange-700 text-white hover:text-white py-3 px-3 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
                >
                  <FiShare2 className="text-2xl" />
                  {/* <span className="text-sm">Share</span> */}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
