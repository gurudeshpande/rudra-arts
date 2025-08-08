import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    return res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default adminLogin;
