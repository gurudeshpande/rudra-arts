import express from "express";
import multer from "multer";
import Product from "../models/Products.js";
import productController from "../controllers/productsController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create
router.post(
  "/add",
  upload.array("pimages", 10),
  productController.createProduct
);

// Update product with image handling
router.put(
  "/:id",
  upload.array("pimages", 10), // Allow multiple file uploads
  productController.updateProduct
);

// Read all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Read single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Fetch by category
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ product_category: category });
    if (products.length === 0) {
      return res.status(404).json({ error: "No products in this category" });
    }
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products by category" });
  }
});

// Update product
// Update
// Update
// router.put("/:id", async (req, res) => {
//   try {
//     const {
//       product_name,
//       product_price,
//       product_description,
//       product_size,
//       product_category,
//       product_image, // This comes as a string "[null,null,null,null]"
//       product_discount,
//       inStock,
//     } = req.body;

//     console.log(req.body);

//     // Parse the product_image if it's a string
//     let imageArray = [];
//     try {
//       imageArray = Array.isArray(product_image)
//         ? product_image
//         : JSON.parse(product_image || "[]");
//     } catch (e) {
//       console.error("Error parsing product_image:", e);
//       imageArray = [];
//     }

//     // Filter out null values and empty strings
//     const filteredImages = imageArray.filter((img) => img && img !== "null");

//     const updateData = {
//       product_name,
//       product_price,
//       product_description,
//       product_size,
//       product_category,
//       product_image: filteredImages,
//       product_discount: product_discount || 0,
//       inStock: typeof inStock !== "undefined" ? inStock : true,
//     };

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true }
//     );

//     res.json({
//       message: "Product updated successfully",
//       updatedProduct,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to update product" });
//   }
// });

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// WhatsApp share
router.get("/bulk/whatsapp-message", async (req, res) => {
  try {
    const productIds = JSON.parse(req.query.productIds);

    if (!Array.isArray(productIds)) {
      return res.status(400).json({ error: "Invalid product IDs" });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }

    const message = formatBulkWhatsAppMessage(products);
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/918668494090?text=${encodedMessage}`;

    res.json({ whatsappURL });
  } catch (error) {
    console.error("Error generating WhatsApp URL:", error);
    res.status(500).json({ error: "Failed to generate WhatsApp URL" });
  }
});

// Update stock status
router.patch("/:id/stock", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { inStock: req.body.inStock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper functions
function formatBulkWhatsAppMessage(products) {
  const total = products.reduce(
    (sum, product) => sum + product.product_price,
    0
  );
  let message = `Hello! I want to purchase these items:\n\n`;

  products.forEach((product, index) => {
    message += `${index + 1}. ${product.product_name}, ${
      product.product_size
    } - ${formatPrice(product.product_price)}\n`;
  });

  message += `\nTotal: ${formatPrice(total)}\n`;
  message += `\nPlease confirm availability and proceed with payment.`;

  return message;
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default router;
