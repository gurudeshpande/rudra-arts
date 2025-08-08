// middleware/protectRoute.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "rudra-secret-key";

const protectRoute = (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" }); // or redirect to login page
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded; // Attach admin data to request for further use
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default protectRoute;
