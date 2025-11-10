import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../Contexts/Contexts";
import { FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import logo from "/images/rudra_arts_logo_single.png";
import { useMediaQuery } from "react-responsive";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [purchasedCount, setPurchasedCount] = useState(0);

  // Product categories
  const productCategories = [
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
    "Jewellery",
    "Keychains",
    "Historical Legends",
    "Badges",
    "Taxidermy",
  ];

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    {
      name: "Products",
      path: "/products",
      dropdown: [
        { name: "All Products", path: "/products" },
        ...productCategories.map((category) => ({
          name: category,
          path: `/products/category/${encodeURIComponent(category)}`,
        })),
      ],
    },
    { name: "Blog", path: "/blogs" },
    { name: "Maharaj", path: "/maharaj" },
    { name: "Wall of Fame", path: "/lorem" },
    { name: "Franchise", path: "/franchises" },
    { name: "Our Team", path: "/ourteam" },
    { name: "Contact", path: "/contact" },
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track purchased products count
  useEffect(() => {
    const updatePurchasedCount = () => {
      const purchasedProducts =
        JSON.parse(localStorage.getItem("purchasedProducts")) || [];
      setPurchasedCount(purchasedProducts.length);
    };

    // Initial load
    updatePurchasedCount();

    // Listen for storage changes
    window.addEventListener("storage", updatePurchasedCount);

    return () => {
      window.removeEventListener("storage", updatePurchasedCount);
    };
  }, []);

  const isActive = (path, dropdownItems = []) => {
    return (
      location.pathname === path ||
      dropdownItems.some((item) => location.pathname === item.path)
    );
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999]">
      {/* Top Header */}
      <AnimatePresence>
        {(!scrolled || isMobile) && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-gradient-to-b from-amber-50 to-amber-100 text-black"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 md:h-20 py-2">
                {/* Logo */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <Link to="/" className="flex items-center">
                    <motion.img
                      src={logo}
                      alt="Rudra Arts Logo"
                      className="h-10 md:h-14 object-contain"
                      whileHover={{ scale: isMobile ? 1 : 1.05 }}
                    />
                    {!isMobile && (
                      <p className="ml-2 text-xl font-times font-normal">
                        Rudra Arts & Handicrafts
                      </p>
                    )}
                  </Link>
                </div>

                {/* Cart + Your Products + Mobile menu */}
                <div className="flex-1 flex items-center justify-end space-x-2">
                  <Link
                    to="/cart"
                    className="relative p-2 rounded-full hover:bg-gray-100 hover:bg-opacity-10 transition-colors"
                    aria-label="Shopping Cart"
                  >
                    <FaShoppingCart className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-customBrown text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/your-products"
                    className="relative p-2 rounded-full hover:bg-gray-100 hover:bg-opacity-10 transition-colors"
                    aria-label="Your Products"
                  >
                    <FaBoxOpen className="h-5 w-5" />
                    {purchasedCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-customBrown text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                        {purchasedCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
                    aria-label="Menu"
                  >
                    {isOpen ? (
                      <FiX className="h-6 w-6" />
                    ) : (
                      <FiMenu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? "bg-darkBrown text-white shadow-sm fixed top-0 left-0 z-[9999]"
            : "bg-darkBrown text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-center space-x-2 border-t border-gray-200 border-opacity-20 pt-2 pb-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-times uppercase flex items-center ${
                          isActive(item.path, item.dropdown)
                            ? "text-[#ff8732] font-semibold"
                            : "hover:text-orange-500"
                        }`}
                      >
                        {item.name}
                        <FiChevronDown className="ml-1" />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[220px] bg-white rounded-md shadow-lg z-50"
                        sideOffset={5}
                      >
                        {item.dropdown.map((subItem) => (
                          <DropdownMenu.Item
                            key={subItem.name}
                            asChild
                            className="outline-none"
                          >
                            <Link
                              to={subItem.path}
                              className={`text-sm px-4 py-2 block w-full ${
                                location.pathname === subItem.path
                                  ? "bg-amber-100 text-darkBrown font-medium"
                                  : "text-gray-700 hover:bg-amber-50"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </DropdownMenu.Item>
                        ))}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                ) : (
                  <Link
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors font-times uppercase ${
                      location.pathname === item.path
                        ? "text-[#ff8732] font-semibold"
                        : "hover:text-orange-500"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden fixed top-0 left-0 w-full z-[9999] bg-customBrown shadow-lg"
              style={{
                marginTop: isMobile ? "4rem" : scrolled ? "0" : "4rem",
                position: "relative",
              }} // 🛠️ Key fix
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 relative z-[9999]">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <DropdownMenu.Root modal={false}>
                        {" "}
                        {/* 🛠️ Optional fix */}
                        <DropdownMenu.Trigger asChild>
                          <button
                            className={`w-full flex justify-between items-center px-3 py-3 rounded-md text-base font-medium ${
                              isActive(item.path, item.dropdown)
                                ? "bg-[#f3e9dd] text-[#8a4b1f]"
                                : "text-white hover:bg-[#5a3e2a]"
                            }`}
                          >
                            {item.name}
                            <FiChevronDown />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="min-w-full max-h-[300px] overflow-y-auto bg-customBrown text-white rounded-none shadow-none z-[9999] scrollbar-thin scrollbar-thumb-gray-400"
                            sideOffset={2}
                          >
                            {item.dropdown.map((subItem) => (
                              <DropdownMenu.Item
                                key={subItem.name}
                                asChild
                                className="outline-none"
                              >
                                <Link
                                  to={subItem.path}
                                  onClick={() => setIsOpen(false)}
                                  className={`block px-3 py-3 text-sm ${
                                    location.pathname === subItem.path
                                      ? "bg-[#f3e9dd] text-[#8a4b1f] font-medium"
                                      : "text-gray-200 hover:bg-[#5a3e2a]"
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              </DropdownMenu.Item>
                            ))}
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-3 py-3 rounded-md text-base font-medium ${
                          location.pathname === item.path
                            ? "bg-[#f3e9dd] text-[#8a4b1f]"
                            : "text-white hover:bg-[#5a3e2a]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
