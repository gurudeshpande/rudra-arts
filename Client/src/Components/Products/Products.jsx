"use client";

import { useNavigate } from "react-router-dom";
import AnimatedUnderline from "../AnimatedUnderline/AnimatedUnderline";

const Product = () => {
  const navigate = useNavigate();

  // Manually created product data
  const featuredProducts = [
    {
      id: "687f19d960e90fccafcf7a32",
      name: "Shastradhari Maharaj - Coloured",
      price: "5,100",
      image:
        "https://res.cloudinary.com/dquyimnmd/image/upload/WhatsApp_Image_2025-08-07_at_23.06.09_442f3653_mactxn.jpg",
      description: "Shastradhari Maharaj - Coloured",
    },
    {
      id: "687e968d44ebd4c95f73cc1a",
      name: "Yugnirmate Maharaj - Coloured",
      price: "13,850",
      image:
        "https://res.cloudinary.com/dquyimnmd/image/upload/w_400,q_auto,f_auto/v1754600489/Rudra-artss/yxffeiozw4y6vyibqvqi.jpg",
      description: "Yugnirmate Maharaj - Coloured",
    },
    {
      id: "687bee8d9108e4ba16378ec1",
      name: "Ashwarudh Maharaj",
      price: "12,850",
      image:
        "https://res.cloudinary.com/dquyimnmd/image/upload/w_400,q_auto,f_auto/v1754599414/Rudra-artss/ub1nt41xw4hzofhzvgtw.jpg",
      description: "Ashwarudh Maharaj",
    },
    {
      id: "687e9d3544ebd4c95f73cc32",
      name: "Roudra Shambhu Chatrapati - Coloured",
      price: "5,100",
      image:
        "https://res.cloudinary.com/dquyimnmd/image/upload/w_400,q_auto,f_auto/v1754677586/Rudra-artss/c1rztgic04evxizhilwy.jpg",
      description: "Roudra Shambhu Chatrapati - Coloured",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#fffaf0] to-[#fef6e4] py-16 px-4 font-times">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-normal text-orange-900 mb-4 font-times flex items-center justify-center gap-3">
          <img
            src="/images/dhaltalwar.png"
            alt="Left Icon"
            className="w-10 h-10"
          />
          <AnimatedUnderline>Featured Products</AnimatedUnderline>
          <img
            src="/images/dhaltalwar.png"
            alt="Right Icon"
            className="w-10 h-10"
          />
        </h1>

        <p className="text-gray-600 italic text-lg mb-12">
          Reliving History Through Every Creation
        </p>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-white/70 backdrop-blur-xl rounded-xl shadow-2xl border border-orange-200 overflow-hidden transition-transform hover:scale-[1.025] duration-300"
            >
              <img
                src={product.image.replace(
                  "/upload/",
                  "/upload/w_400,q_auto,f_auto/"
                )}
                alt={product.name}
                className="w-full h-[15rem] object-cover cursor-pointer"
                loading="lazy"
                onClick={() => navigate(`/product-details/${product.id}`)}
              />

              <div className="p-3 text-left">
                <h2 className="text-xl font-normal text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="bg-orange-100 text-orange-700 font-normal text-sm px-3 py-1 rounded-full">
                    ₹ {product.price}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/product-details/${product.id}`)}
                  className="w-full bg-customBrown hover:bg-orange-700 text-white font-normal py-2 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <img
                    src="/images/dhaltalwar.png"
                    alt="Icon Left"
                    className="w-5 h-5 invert"
                  />
                  <span>View Details</span>
                  <img
                    src="/images/dhaltalwar.png"
                    alt="Icon Right"
                    className="w-5 h-5 invert"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <button
            onClick={() => navigate("/Products")}
            className="px-6 py-2 border border-orange-600 text-orange-700 hover:bg-orange-100 font-normal transition"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default Product;
