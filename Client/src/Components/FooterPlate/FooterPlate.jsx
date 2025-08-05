import { Link, useLocation } from "react-router-dom";

const FooterPlate = () => {
  const location = useLocation();

  const isProductsPage = location.pathname.toLowerCase() === "/products";
  const isContactPage = location.pathname.toLowerCase() === "/conatct";

  return (
    <div className="fixed bottom-0 left-0 w-full h-12 z-50 flex shadow-md sm:hidden bg-white">
      {isProductsPage ? (
        <>
          <Link
            to="/blogs"
            className="w-1/2 flex font-times items-center justify-center bg-white text-customBrown font-medium text-sm border-r border-gray-300 hover:bg-gray-100 transition"
          >
            Blogs
          </Link>
          <Link
            to="/contact"
            className="w-1/2 flex font-times items-center justify-center bg-customBrown text-white font-medium text-sm hover:bg-orange-700 transition"
          >
            Contact
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/Products"
            className="w-1/2 flex font-times items-center justify-center bg-white text-customBrown font-medium text-sm border-r border-gray-300 hover:bg-gray-100 transition"
          >
            Products
          </Link>
          <Link
            to="/contact"
            className="w-1/2 flex font-times items-center justify-center bg-customBrown text-white font-medium text-sm hover:bg-orange-700 transition"
          >
            Contact
          </Link>
        </>
      )}
    </div>
  );
};

export default FooterPlate;
