import { useEffect, useState } from "react";
import { useCart } from "../../Contexts/Contexts";
import { FaCartArrowDown } from "react-icons/fa";
import {
  FiTrash2,
  FiShoppingBag,
  FiPlusCircle,
  FiMinusCircle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    isCartLoading,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [isBuying, setIsBuying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const savePurchasedProducts = (products) => {
    try {
      const existingProducts =
        JSON.parse(localStorage.getItem("purchasedProducts")) || [];
      const newProducts = products.map((product) => ({
        ...product,
        purchaseDate: new Date().toISOString(),
      }));
      localStorage.setItem(
        "purchasedProducts",
        JSON.stringify([...existingProducts, ...newProducts])
      );
      return true;
    } catch (error) {
      console.error("Failed to save purchased products:", error);
      return false;
    }
  };

  const handleBuyAll = async () => {
    setIsBuying(true);
    try {
      const productsData = cartItems.map((item) => ({
        id: item._id,
        name: item.product_name,
        price: item.product_price,
        quantity: item.quantity || 1,
        size: item.product_size,
        image: item.product_image?.[0],
      }));

      const message = createWhatsAppMessage(productsData);
      const phoneNumber = "917028996666";
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;

      const saveSuccess = savePurchasedProducts(cartItems);
      if (!saveSuccess) throw new Error("Failed to save your purchase");

      await fetch(
        `${import.meta.env.VITE_BASE_URL_PRODUCTION}/api/checkout/increment`,
        {
          method: "POST",
        }
      );

      window.open(whatsappURL, "_blank");
      clearCart();
      navigate("/your-products");
    } catch (err) {
      console.error("Error preparing WhatsApp message:", err);
      alert("Failed to prepare your order. Please try again.");
    } finally {
      setIsBuying(false);
    }
  };

  const createWhatsAppMessage = (products) => {
    const total = products.reduce(
      (sum, p) => sum + p.price * (p.quantity || 1),
      0
    );
    const messageId = generateMessageId();

    let message = `*Purchase Inquiry - ${messageId}*\n\nHello! I'm interested in buying the following products:\n`;

    products.forEach((product, index) => {
      message += `\n*${index + 1}. ${product.name}*\n`;
      message += `Size: ${product.size || "N/A"}\n`;
      message += `Price: ${formatPrice(product.price)} x ${
        product.quantity || 1
      }\n`;
      message += `Subtotal: ${formatPrice(
        product.price * (product.quantity || 1)
      )}\n`;
      if (product.image) {
        message += `Image: ${product.image}\n`;
      }
    });

    message += `\n*Total Items:* ${products.length}`;
    message += `\n*Total Amount:* ${formatPrice(total)}\n`;
    message += `\nKindly confirm availability and payment instructions.\n`;

    return message;
  };

  const generateMessageId = () => {
    return `ORDER-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product_price * (item.quantity || 1),
      0
    );
  };

  if (isCartLoading) {
    return (
      <motion.div
        className="flex justify-center items-center min-h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"
        ></motion.div>
      </motion.div>
    );
  }

  if (!isCartLoading && cartItems.length === 0) {
    return (
      <motion.div
        className="flex flex-col justify-center items-center min-h-[60vh] text-center p-6 bg-gradient-to-b from-amber-50 to-amber-100 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-gray-100 p-8 rounded-full mb-6 mt-20"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <FiShoppingBag className="text-gray-400 text-5xl" />
        </motion.div>
        <motion.h2
          className="text-2xl font-medium text-gray-700 mb-2"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          Your cart is empty
        </motion.h2>
        <motion.p
          className="text-gray-500 max-w-md mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Looks like you haven't added anything to your cart yet. Start shopping
          to see items here.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/products")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto"
          >
            Shop Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/your-products")}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto"
          >
            Your Products
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="px-4 sm:px-6 py-12 pt-20 pb-32 bg-gradient-to-b from-amber-50 to-amber-100 font-times font-normal mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile Header */}
      <div className="md:hidden top-0 z-10 bg-customBrown text-white p-4 mb-6 shadow-md">
        <h1 className="text-3xl font-normal text-center">Your Cart</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto mt-20">
        {/* Cart Items */}
        <div className="w-full md:w-2/3">
          <h1 className="hidden md:block text-3xl md:text-4xl font-normal text-customBrown mb-6">
            Your Cart
          </h1>
          <div className="space-y-3">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  layout
                  className="rounded-lg shadow-sm border border-gray-100 p-3 flex gap-3 hover:shadow-md bg-white"
                >
                  <Link
                    to={`/product-details/${item._id}`}
                    className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24"
                  >
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={
                        item.product_image?.[0].replace(
                          "/upload/",
                          "/upload/w_400,q_auto,f_auto/"
                        ) || "/placeholder-image.jpg"
                      }
                      loading="lazy"
                      alt={item.product_name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-lg sm:text-xl font-normal text-gray-800 line-clamp-2">
                      {item.product_name}
                    </h2>
                    <p className="text-orange-600 font-bold mt-1 text-sm sm:text-base">
                      {formatPrice(item.product_price)}
                    </p>
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="text-gray-600 hover:text-red-500"
                      >
                        <FiMinusCircle className="w-5 h-5" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="text-gray-600 hover:text-green-500"
                      >
                        <FiPlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-auto flex justify-end">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item._id)}
                        className="flex items-center gap-1 bg-red-400 hover:bg-red-500 text-white px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded"
                      >
                        <FiTrash2 className="text-sm" />
                        <span className="hidden xs:inline">Remove</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-1/3">
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:sticky md:top-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl sm:text-2xl font-normal text-gray-800 mb-3">
              Order Summary
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">
                  Items ({cartItems.length})
                </span>
                <span className="font-bold">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-xl font-normal">Total</span>
                <span className="text-orange-600 font-bold text-lg sm:text-xl">
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyAll}
              disabled={isBuying}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
            >
              <motion.span
                animate={isBuying ? { rotate: 360 } : {}}
                transition={
                  isBuying
                    ? { repeat: Infinity, duration: 1, ease: "linear" }
                    : {}
                }
              >
                <FaCartArrowDown />
              </motion.span>
              {isBuying
                ? "Processing..."
                : `Checkout (${cartItems.length} ${
                    cartItems.length > 1 ? "items" : "item"
                  })`}
            </motion.button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              You'll complete your purchase on WhatsApp
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mobile Checkout Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3 z-20">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-bold text-orange-600">
              {formatPrice(calculateTotal())}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleBuyAll}
            disabled={isBuying}
            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium flex items-center gap-2 text-sm"
          >
            <FaCartArrowDown />
            {isBuying ? "Processing..." : "Checkout"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
