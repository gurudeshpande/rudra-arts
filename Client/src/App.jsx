import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Element } from "react-scroll";
import Home from "./Components/Home/Home";
import AboutUs from "./Components/About/About";
import Blogs from "./Components/Blogs/Blogs";
import Products from "./Components/Products/Products";
import Contact from "./Components/Contact/Contact";
import AllProducts from "./Components/AllProducts/AllProducts";
import News from "./Components/News/News";
import { useLocation } from "react-router-dom";

import "./App.css";
import Login from "./Components/Login/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import { useEffect } from "react";
import Cookies from "js-cookie";
import ProductManager from "./Components/Dashboard/ProductsManager";
import ScrollToTopButton from "./Components/ScrollToTopButton/ScrollToTopButton";
import AddProduct from "./Components/Dashboard/AddProduct";
import FullAbout from "./Components/About/FullAbout";
import FullNews from "./Components/News/FullNews";
import ProductDetails from "./Components/Products/ProductDetails";
import AddNews from "./Components/Dashboard/AddNews";
import AddBlogs from "./Components/Dashboard/AddBlogs";
import BlogChecker from "./Components/Dashboard/BlogChecker";
import Testimonials from "./Components/Testimponials/Testimonials";
import Cart from "./Components/Cart/Cart";
import Lorem from "./Components/Lorem/Lorem";
import NewsManager from "./Components/Dashboard/NewsManager";
import BlogManager from "./Components/Dashboard/BlogManager";
import BlogDetail from "./Components/Blogs/BlogDetails";
import FranchiseCarousel from "./Components/FranchiseCarousel/FranchiseCarousel";
import TeamComponent from "./Components/TeamComponent/TeamComponent";
import BTS from "./Components/BTS/BTS";
import ExploreProcess from "./Components/BTS/ExploreProcess";
import FullScreenVideoPlayer from "./Components/FullScreenVideoPlayer/FullScreenVideoPlayer";
import SideBySidePortrait from "./Components/PoliticianPhotos/SideBySidePortrait";
import HeritageExperience from "./Components/HeritageExperience/HeritageExperience";
import AwardsComponent from "./Components/AwardsComponent/AwardsComponent";
import YourProducts from "./Components/Cart/YourProducts";
import FooterPlate from "./Components/FooterPlate/FooterPlate";

const App = () => {
  const location = useLocation();
  const hideScrollButtonPaths = [
    "/cart",
    "/product-details",
    "/admindashboard",
  ];

  const shouldShowScrollButton = !hideScrollButtonPaths.includes(
    location.pathname
  );

  useEffect(() => {
    const token = Cookies.get();
    console.log(token);
  }, []);

  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts for developer tools
    const handleKeyDown = (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Element name="home">
                <Home />
              </Element>
              <Element name="products">
                <Products />
              </Element>
              <Element name="about">
                <AboutUs />
              </Element>
              <Element name="videoSection">
                <FullScreenVideoPlayer />
              </Element>
              <Element name="politician">
                <SideBySidePortrait />
              </Element>
              <Element name="news">
                <News />
              </Element>
            </>
          }
        />
        <Route path="/about" element={<FullAbout />} />
        <Route path="/Blogs" element={<Blogs />} />
        <Route path="/news" element={<FullNews />} />
        <Route path="/Products" element={<AllProducts />} />
        <Route path="/products/category/:category" element={<AllProducts />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Lorem" element={<Lorem />} />
        <Route path="/franchises" element={<FranchiseCarousel />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        {/* <Route path="/ourteam" element={<TeamComponent />} /> */}
        <Route path="/ourteam" element={<BTS />} />
        <Route path="/explore-process" element={<ExploreProcess />} />
        <Route path="/maharaj" element={<HeritageExperience />} />
        <Route path="/awards" element={<AwardsComponent />} />
        <Route path="/your-products" element={<YourProducts />} />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute>
              <ProductManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-products"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <PrivateRoute>
              <AddNews />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/news-manager"
          element={
            <PrivateRoute>
              <NewsManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/blog"
          element={
            <PrivateRoute>
              <AddBlogs />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/blog-manager"
          element={
            <PrivateRoute>
              <BlogManager />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/blog-checker"
          element={
            <PrivateRoute>
              <BlogChecker />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Conditionally render ScrollToTopButton */}
      {shouldShowScrollButton && <ScrollToTopButton />}

      <FooterPlate
      // onSearchToggle={handleSearchToggle}
      // onFilterToggle={handleFilterToggle}
      />
    </>
  );
};

export default App;
