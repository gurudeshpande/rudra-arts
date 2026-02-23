import React, { useEffect } from "react";
import { Box, Typography, Grid, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import AnimatedUnderline from "../AnimatedUnderline/AnimatedUnderline";

const FranchiseCard = ({ franchise, index, isMobile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gradient-to-b from-amber-50 to-amber-100"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: 6,
          },
          height: "100%",
          backgroundColor: "#fff7eb",
        }}
      >
        {/* Content Section */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 3, sm: 4 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <AnimatedUnderline>
            <img
              src={franchise.logo}
              alt={`${franchise.name} logo`}
              style={{
                width: isMobile ? "10rem" : "13rem",
                objectFit: "contain",
                marginBottom: "0.5rem",
              }}
            />
          </AnimatedUnderline>

          <Typography
            sx={{
              mb: 1,
              fontSize: isMobile ? "1.3rem" : "2.4rem",
              fontFamily: "Times New Roman, serif",
            }}
            className="text-customBrown"
          >
            {franchise.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: isMobile ? "0.9rem" : "1.1rem",
              lineHeight: 1.6,
              fontFamily: "Times New Roman, serif",
            }}
          >
            {(Array.isArray(franchise.description)
              ? franchise.description
              : [franchise.description]
            ).map((line, idx) => (
              <Box key={idx} sx={{ mb: 0.5 }}>
                • {line}
              </Box>
            ))}
          </Typography>
        </Box>

        {/* Image Section (hidden on mobile) */}
        {!isMobile && (
          <Box sx={{ flex: "0 0 30%", overflow: "hidden" }}>
            <img
              src={franchise.image}
              alt={`${franchise.name} main`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transition: "transform 0.5s ease",
              }}
            />
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

const FranchiseCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const franchises = [
    {
      logo: "/images/rudra_arts_logo_single.png",
      image: "/images/rudraArtsDighi.jpg",
      name: "Rudra Arts Dighi",
      description:
        "Survey No. 4, Hrishikesh Building, Parandenagar (Samarthnagar) Dighi, Pune 411015, Behind Bikaner Sweets",
    },
    {
      logo: "/images/franchise14.png",
      image: "/images/pratikrutiArts.jpg",
      name: "Pratikruti Arts",
      description:
        "Parshuram Apartment, Opposite Lokamanya Vachnalaya, Navi Peth, Pune 411030",
    },
    {
      logo: "/images/franchise6.png",
      image: "/images/kitabwala1.jpg",
      name: "Kitabwala",
      description: [
        "Kitabwala Store, Arvind Apartment, Opp. Mantri Hospital, Erandwane, Pune 411004",
        "Warden Vakil Chawl 2, 3rd Floor, Veer Santaji Lane, Lower Parel, Mumbai 400013",
      ],
    },
    {
      logo: "/images/franchise3.png",
      image: "/images/rayriArts.jpg",
      name: "Rayari Arts",
      description:
        "House No. 31/A, Vijayalankar Society, Taljai Rd, Dhankawadi, Pune 411043",
    },
    {
      logo: "/images/franchise5.png",
      image: "/images/gajaiArts1.jpg",
      name: "Gajai Arts",
      description:
        "Shop No-12, Anmol Terrace, Plot 20, Sector 5, Kopar Khairane, Navi Mumbai 400709",
    },
    {
      logo: "/images/franchise15.png",
      image: "/images/kaladalanByCanus.jpg",
      name: "Kaladalan By Canus",
      description:
        "B-1-A, Deepa Arihant Building, Near Maneklal Ground, Ghatkopar West, Mumbai 400086",
    },
    {
      logo: "/images/rudra_arts_logo_single.png",
      image: "/images/narhe.jpg",
      name: "Rudra Arts Narhe",
      description: "Narhe, Pune",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        py: 8,
        px: { xs: 2, sm: 4, md: 6 },
      }}
      className="bg-gradient-to-b from-amber-50 to-amber-100"
    >
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 400,
            textAlign: "center",
            mb: 6,
            mt: 10,
            fontSize: { xs: "2rem", md: "2.5rem" },
            letterSpacing: "0.5px",
            fontFamily: "Times New Roman, serif",
          }}
          className="text-customBrown"
        >
          <AnimatedUnderline>Our Franchises and Dealerships</AnimatedUnderline>
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        {franchises.map((franchise, index) => (
          <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
            <FranchiseCard
              franchise={franchise}
              index={index}
              isMobile={isMobile}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FranchiseCarousel;
