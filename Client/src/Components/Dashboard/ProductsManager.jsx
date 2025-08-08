import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Chip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import DashboardLayout from "./DashboardLayout";
import { toast } from "react-toastify";
import { Delete, Search } from "lucide-react";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [stockFilter, setStockFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);
  const [newFiles, setNewFiles] = useState([]); // Track newly uploaded files
  const navigate = useNavigate();

  const categories = [
    "Mavala",
    "Maharaj",
    "Shastra (Weapons)",
    "Miniature Weapons",
    "Maniatures",
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

  const [editFormData, setEditFormData] = useState({
    pname: "",
    pDescription: "",
    pprice: "",
    psize: "",
    pcategory: "",
    pimage: [],
    pdiscount: "",
    inStock: true,
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL_PRODUCTION}/api/products`
      );
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL_PRODUCTION}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete product");
    }
  };

  // Toggle stock status
  const toggleStockStatus = async (productId, currentStatus) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BASE_URL_PRODUCTION
        }/api/products/${productId}/stock`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inStock: !currentStatus }),
        }
      );

      if (!res.ok) throw new Error("Failed to update stock status");

      toast.success("Stock status updated");
      fetchProducts();
    } catch (err) {
      console.error("Stock update error:", err);
      toast.error("Failed to update stock status");
    }
  };

  // Handle edit click
  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditFormData({
      pname: product.product_name,
      pDescription: product.product_description,
      pprice: product.product_price,
      psize: product.product_size,
      pcategory: product.product_category,
      pimage: [...product.product_image], // Create a new array to avoid mutation
      pdiscount: product.product_discount || "",
      inStock: product.inStock !== false,
    });
  };

  // Handle edit save
  // Handle edit save
  const handleEditSave = async () => {
    try {
      const formData = new FormData();

      // Append product data
      formData.append("product_name", editFormData.pname);
      formData.append("product_description", editFormData.pDescription);
      formData.append("product_price", editFormData.pprice);
      formData.append("product_size", editFormData.psize);
      formData.append("product_category", editFormData.pcategory);
      formData.append("product_discount", editFormData.pdiscount || 0);
      formData.append("inStock", editFormData.inStock);

      // Prepare image data - use original URLs where no new image was selected
      const imageData = editFormData.pimage.map((img, index) => {
        // If this is a blob URL, it means we have a new file to upload
        return img?.startsWith("blob:") ? null : img;
      });
      formData.append("product_image", JSON.stringify(imageData));

      // Track which positions have new images
      const imagePositions = [];
      newFiles.forEach((file, index) => {
        if (file instanceof File) {
          formData.append("pimages", file);
          imagePositions.push(index);
        }
      });
      formData.append("imagePositions", JSON.stringify(imagePositions));

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL_PRODUCTION}/api/products/${
          editProduct._id
        }`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to update product");

      const data = await res.json();
      setEditProduct(null);
      setNewFiles([]);
      fetchProducts();
      toast.success("Product updated successfully");
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("Failed to update product");
    }
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    // Clean up any object URLs we created for previews
    editFormData.pimage.forEach((img, index) => {
      if (newFiles[index] && img.startsWith("blob:")) {
        URL.revokeObjectURL(img);
      }
    });
    setEditProduct(null);
    setNewFiles([]);
  };

  // Handle form field changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image upload when clicked
  // In your handleImageClick function:
  const handleImageClick = async (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);

        // Update state with preview URL
        setEditFormData((prev) => ({
          ...prev,
          pimage: prev.pimage.map((img, i) => (i === index ? previewUrl : img)),
        }));

        // Store the actual file for upload
        setNewFiles((prev) => {
          const updated = [...prev];
          updated[index] = file;
          return updated;
        });

        toast.success("Image selected for upload");
      } catch (error) {
        console.error("Image selection failed:", error);
        toast.error("Failed to select image");
      }
    };

    input.click();
  };

  const handleImageDelete = (index) => {
    // Clean up the object URL if it's a preview
    if (editFormData.pimage[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(editFormData.pimage[index]);
    }

    const newImages = [...editFormData.pimage];
    newImages[index] = null;

    const updatedNewFiles = [...newFiles];
    updatedNewFiles[index] = null;

    setEditFormData((prev) => ({
      ...prev,
      pimage: newImages,
    }));

    setNewFiles(updatedNewFiles);
  };
  // Drag and drop handlers for image reordering
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    setDraggedImageIndex(index);
    e.currentTarget.style.opacity = "0.5";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.currentTarget.style.border = "2px dashed #1976d2";
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.border = "2px dashed #ccc";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    e.currentTarget.style.border = "2px dashed #ccc";

    const sourceIndex = Number(e.dataTransfer.getData("text/plain"));
    if (sourceIndex === targetIndex) return;

    // Create a new array without mutating the original
    const newImages = [...editFormData.pimage];

    // Remove undefined elements if any exist
    const filteredImages = newImages.filter((img) => img !== undefined);

    // Ensure we have elements at both source and target indices
    if (
      sourceIndex < filteredImages.length &&
      targetIndex < filteredImages.length
    ) {
      // Swap the images
      const temp = filteredImages[sourceIndex];
      filteredImages[sourceIndex] = filteredImages[targetIndex];
      filteredImages[targetIndex] = temp;

      setEditFormData((prev) => ({
        ...prev,
        pimage: filteredImages,
      }));
    }
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = "1";
    setDraggedImageIndex(null);
  };

  // Filter products based on stock status
  const filteredProducts = products.filter((product) => {
    // Search term filter
    const matchesSearch = product.product_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Stock status filter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "inStock" && product.inStock !== false) ||
      (stockFilter === "outOfStock" && product.inStock === false);

    return matchesSearch && matchesStock;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      // Clean up any blob URLs when component unmounts
      editFormData.pimage.forEach((img) => {
        if (img?.startsWith("blob:")) {
          URL.revokeObjectURL(img);
        }
      });
    };
  }, [editFormData.pimage]);

  return (
    <DashboardLayout>
      <Box p={4}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
          flexWrap="wrap"
          gap={2}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            className="text-3xl font-outfit"
          >
            Product Inventory
          </Typography>

          {/* Search Box */}
          <TextField
            variant="outlined"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{
              flexGrow: 1,
              maxWidth: "400px",
              mx: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                backgroundColor: "background.paper",
              },
            }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admin/add-products")}
          >
            Add Product
          </Button>
        </Box>

        {/* Stock Filter Controls */}
        <Box display="flex" gap={2} mb={4}>
          <Chip
            label="All Products"
            clickable
            color={stockFilter === "all" ? "primary" : "default"}
            onClick={() => setStockFilter("all")}
          />
          <Chip
            label="In Stock"
            clickable
            color={stockFilter === "inStock" ? "success" : "default"}
            onClick={() => setStockFilter("inStock")}
            icon={<CheckCircle fontSize="small" />}
          />
          <Chip
            label="Out of Stock"
            clickable
            color={stockFilter === "outOfStock" ? "error" : "default"}
            onClick={() => setStockFilter("outOfStock")}
            icon={<Cancel fontSize="small" />}
          />
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No products found matching your criteria.
          </Typography>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price (₹)</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="center">Stock</TableCell>
                  <TableCell align="center">Discount</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    sx={{
                      opacity: product.inStock === false ? 0.7 : 1,
                      backgroundColor:
                        product.inStock === false ? "#fff8f8" : "inherit",
                    }}
                  >
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={
                          product.product_image?.[0]
                            ? product.product_image[0].replace(
                                "/upload/",
                                "/upload/w_400,q_auto,f_auto/"
                              )
                            : "/placeholder.jpg"
                        }
                        loading="lazy"
                        alt={product.product_name}
                        sx={{ width: 60, height: 60 }}
                      />
                    </TableCell>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>₹{product.product_price}</TableCell>
                    <TableCell>{product.product_size}</TableCell>
                    <TableCell>{product.product_category}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() =>
                          toggleStockStatus(
                            product._id,
                            product.inStock !== false
                          )
                        }
                        color={product.inStock !== false ? "success" : "error"}
                      >
                        {product.inStock !== false ? (
                          <CheckCircle />
                        ) : (
                          <Cancel />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      {product.product_discount || "0"}%
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(product)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Edit Product Modal */}
        <Dialog
          open={Boolean(editProduct)}
          onClose={handleEditCancel}
          PaperProps={{
            sx: { width: "50%", maxWidth: "none", borderRadius: "12px" },
          }}
        >
          <DialogTitle>Edit Product</DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Product Name"
              name="pname"
              value={editFormData.pname}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Product Description"
              name="pDescription"
              value={editFormData.pDescription}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Product Price"
              name="pprice"
              value={editFormData.pprice}
              onChange={handleEditChange}
              fullWidth
              type="number"
            />
            <TextField
              label="Product Size"
              name="psize"
              value={editFormData.psize}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Product Discount (%)"
              name="pdiscount"
              value={editFormData.pdiscount}
              onChange={handleEditChange}
              fullWidth
              type="number"
            />

            {/* Category Dropdown */}
            <FormControl fullWidth>
              <InputLabel id="category-label">Product Category</InputLabel>
              <Select
                labelId="category-label"
                name="pcategory"
                value={editFormData.pcategory}
                label="Product Category"
                onChange={handleEditChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Image Upload Section */}
            <Typography variant="subtitle1">Product Images</Typography>
            <Box display="flex" flexWrap="wrap" gap={2}>
              {[0, 1, 2, 3].map((i) => {
                const imageUrl = editFormData.pimage[i] || null;
                return (
                  <Box
                    key={i}
                    width={100}
                    height={100}
                    border="2px dashed #ccc"
                    borderRadius={2}
                    position="relative"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    overflow="hidden"
                    bgcolor="#f9f9f9"
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.border = "2px dashed #1976d2";
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.border = "2px dashed #ccc";
                    }}
                    onDrop={(e) => handleDrop(e, i)}
                    onDragEnd={handleDragEnd}
                    style={{
                      cursor: "move",
                      opacity: draggedImageIndex === i ? 0.5 : 1,
                    }}
                  >
                    {imageUrl ? (
                      <>
                        <Avatar
                          src={imageUrl}
                          alt={`Product Image ${i + 1}`}
                          sx={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 0,
                          }}
                          variant="square"
                          onClick={() => handleImageClick(i)}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageDelete(i);
                          }}
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.7)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(i)}
                      >
                        <Typography variant="caption" textAlign="center">
                          Click to upload
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
            <Typography variant="caption" color="textSecondary">
              Drag to reorder images • Click to update image • Click X to delete
            </Typography>

            {/* Stock Status Switch */}
            <FormControlLabel
              control={
                <Switch
                  checked={editFormData.inStock}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      inStock: e.target.checked,
                    })
                  }
                  name="inStock"
                  color="primary"
                />
              }
              label={editFormData.inStock ? "In Stock" : "Out of Stock"}
              labelPlacement="start"
              sx={{ justifyContent: "space-between", ml: 0 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCancel}>Cancel</Button>
            <Button variant="contained" onClick={handleEditSave}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default ProductManager;
