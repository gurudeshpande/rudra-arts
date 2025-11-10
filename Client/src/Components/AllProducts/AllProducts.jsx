import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaStar, FaSearch, FaTimes } from "react-icons/fa";
import { ShoppingCart, Filter, Grid, Layout, Sliders } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AutoScrollCarousel from "./Carousel";
import aboutBg from "/images/border.jpg";
import { Skeleton } from "@mui/material";
import AnimatedUnderline from "../AnimatedUnderline/AnimatedUnderline";
import { useMemo } from "react";

const AllProducts = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const { category: categoryParam } = useParams();
  const category = categoryParam ? decodeURIComponent(categoryParam) : null;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [selectedCategory, setSelectedCategory] = useState(category || "All");
  const [viewMode, setViewMode] = useState("masonry");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("All");
    }
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL_PRODUCTION}/api/products`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        const productsWithExtras = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((product) => ({
            ...product,
            isFavorite: false,
            category: product.product_category || "Uncategorized",
            rating: product.product_rating || Math.random() * 1 + 4,
            isNew:
              Date.now() - new Date(product.createdAt).getTime() < 604800000,
          }));

        setProducts(productsWithExtras);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All",
    "Mavala",
    "Maharaj",
    "Shastra (Weapons)",
    "Miniature Weapons",
    "Miniatures",
    "Spiritual Statues",
    "Car Dashboard",
    "Frame Collection",
    "Shilekhana (Weapon Vault)",
    "Symbolic & Cultural Artefacts",
    "Sanch",
    "Keychains",
    "Jewellery",
    "Historical Legends",
    "Badges",
    "Taxidermy",
  ];

  const normalize = (str) =>
    str
      ? str
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9]/g, "")
      : "";

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory === "All") return true;
        return normalize(p.category) === normalize(selectedCategory);
      })
      .filter(
        (p) =>
          p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.product_description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOption === "price-low")
          return a.product_price - b.product_price;
        if (sortOption === "price-high")
          return b.product_price - a.product_price;
        if (sortOption === "rating") return b.rating - a.rating;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [products, selectedCategory, searchQuery, sortOption]);

  const toggleFavorite = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 12);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-amber-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="text-amber-400 opacity-50" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }

    return stars;
  };

  // Masonry layout columns
  const getMasonryColumns = () => {
    const columns = [[], [], []];
    filteredProducts.slice(0, visibleProducts).forEach((product, index) => {
      columns[index % 3].push(product);
    });
    return columns;
  };

  const masonryColumns = getMasonryColumns();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 font-times">
      {/* Background Texture */}
      <div
        className="fixed inset-0 z-0 opacity-10"
        style={{
          backgroundImage: `url(${aboutBg})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="my-10">
        <AutoScrollCarousel products={products.slice(0, 10)} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-amber-900 mb-4">
            Artisan <span className="italic text-amber-700">Heritage</span>
          </h1>
          <p className="text-amber-800 max-w-2xl mx-auto text-lg">
            Discover handcrafted treasures that embody centuries of tradition
            and spiritual significance
          </p>
        </motion.header>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl mx-auto lg:mx-0">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600" />
            <input
              type="text"
              placeholder="Search our collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 placeholder-amber-400 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex bg-white rounded-full p-1 border border-amber-200">
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-2 rounded-full ${
                  viewMode === "masonry"
                    ? "bg-amber-600 text-white"
                    : "text-amber-600 hover:text-amber-800"
                }`}
                title="Masonry View"
              >
                <Layout size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full ${
                  viewMode === "grid"
                    ? "bg-amber-600 text-white"
                    : "text-amber-600 hover:text-amber-800"
                }`}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                showFilters
                  ? "bg-amber-600 text-white"
                  : "bg-white text-amber-800 border border-amber-200 hover:bg-amber-50"
              }`}
            >
              <Sliders size={16} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-amber-900">
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            if (cat === "All") {
                              navigate("/products");
                            } else {
                              navigate(
                                `/products/category/${encodeURIComponent(cat)}`
                              );
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedCategory === cat
                              ? "bg-amber-600 text-white"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3 text-amber-900">
                      Sort By
                    </h3>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      {/* <option value="rating">Highest Rated</option> */}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Title */}
        {category && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-normal text-amber-900 capitalize mb-2">
              {category}
            </h2>
            <p className="text-amber-700">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "unique piece" : "unique pieces"}{" "}
              in this collection
            </p>
          </motion.div>
        )}

        {/* Products Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-amber-100"
              >
                <Skeleton
                  variant="rectangular"
                  className="w-full h-48 bg-amber-100"
                />
                <div className="p-4">
                  <Skeleton className="w-3/4 h-6 mb-2 bg-amber-100" />
                  <Skeleton className="w-1/2 h-4 mb-4 bg-amber-100" />
                  <Skeleton className="w-full h-10 bg-amber-100" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Masonry Layout */}
            {viewMode === "masonry" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {masonryColumns.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-6">
                    {column.map((product) => (
                      <motion.div
                        key={product._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-amber-100 group"
                      >
                        <Link to={`/product-details/${product._id}`}>
                          <div className="relative overflow-hidden">
                            <div className="h-60 overflow-hidden bg-amber-50 flex items-center justify-center">
                              <motion.img
                                src={product.product_image[0].replace(
                                  "/upload/",
                                  "/upload/w_600,q_auto,f_auto/"
                                )}
                                alt={product.product_name}
                                className="max-h-56 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>

                            <div className="absolute top-3 left-3 flex gap-2">
                              {product.isNew && (
                                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                                  New
                                </span>
                              )}
                              {product.product_price > 5000 && (
                                <span className="bg-amber-700 text-white text-xs px-2 py-1 rounded-full">
                                  Premium
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleFavorite(product._id);
                              }}
                              className="absolute top-3 right-3 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-rose-100 transition-colors"
                            >
                              {product.isFavorite ? (
                                <FaHeart className="text-rose-500" />
                              ) : (
                                <FaRegHeart className="text-amber-600" />
                              )}
                            </button>
                          </div>

                          <div className="p-4">
                            <h3 className="text-lg font-medium text-amber-900 mb-2 line-clamp-1">
                              {product.product_name}
                            </h3>

                            {/* <div className="flex items-center mb-2">
                              <div className="flex mr-2">
                                {renderStars(product.rating)}
                              </div>
                              <span className="text-sm text-amber-600">
                                ({product.rating.toFixed(1)})
                              </span>
                            </div> */}

                            {product.product_size !== "0" ? (
                              <p className="text-sm text-amber-700 mb-3">
                                Size: {product.product_size}
                              </p>
                            ) : (
                              <p className="text-sm text-amber-700 mb-3 line-clamp-2">
                                {product.product_description
                                  .split(" ")
                                  .slice(0, 12)
                                  .join(" ")}
                                ...
                              </p>
                            )}

                            <div className="flex justify-between items-center mt-4">
                              <div>
                                <span className="text-xl font-bold text-amber-900">
                                  ₹{product.product_price.toLocaleString()}
                                </span>
                                {product.product_discount > 0 && (
                                  <span className="ml-2 text-sm text-green-600">
                                    {product.product_discount}% off
                                  </span>
                                )}
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-amber-600 text-white rounded-lg transition hover:bg-amber-700"
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Add to cart functionality
                                }}
                              >
                                <ShoppingCart size={16} />
                                <span>Add</span>
                              </motion.button>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            ) : viewMode === "grid" ? (
              // Grid Layout
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.slice(0, visibleProducts).map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-amber-100 group"
                  >
                    <Link to={`/product-details/${product._id}`}>
                      <div className="relative overflow-hidden">
                        <div className="h-52 overflow-hidden bg-amber-50 flex items-center justify-center">
                          <motion.img
                            src={product.product_image[0].replace(
                              "/upload/",
                              "/upload/w_600,q_auto,f_auto/"
                            )}
                            alt={product.product_name}
                            className="max-h-48 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>

                        <div className="absolute top-3 left-3 flex gap-2">
                          {product.isNew && (
                            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                              New
                            </span>
                          )}
                          {product.product_price > 5000 && (
                            <span className="bg-amber-700 text-white text-xs px-2 py-1 rounded-full">
                              Premium
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-medium text-amber-900 mb-2 line-clamp-1">
                          {product.product_name}
                        </h3>

                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <span className="text-xl font-bold text-amber-900">
                              ₹{product.product_price.toLocaleString()}
                            </span>
                            {product.product_discount > 0 && (
                              <span className="ml-2 text-sm text-green-600">
                                {product.product_discount}% off
                              </span>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium bg-amber-600 text-white rounded-lg transition hover:bg-amber-700"
                            onClick={(e) => {
                              e.preventDefault();
                              // Add to cart functionality
                            }}
                          >
                            <ShoppingCart size={16} />
                            <span>Add</span>
                          </motion.button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : null}

            {/* Load More Button */}
            {visibleProducts < filteredProducts.length && (
              <div className="mt-12 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={loadMoreProducts}
                  className="px-8 py-3 bg-amber-700 text-white rounded-full font-medium transition hover:bg-amber-800"
                >
                  Load More
                </motion.button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white/80 rounded-xl border border-amber-200">
            <h3 className="text-2xl font-medium text-amber-900 mb-3">
              No products found
            </h3>
            <p className="text-amber-700 mb-6 max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're
              looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSortOption("newest");
              }}
              className="flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-800 rounded-full font-medium transition hover:bg-amber-200 mx-auto"
            >
              Reset filters
              <FaTimes />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
