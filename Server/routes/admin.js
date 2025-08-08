import express from "express";
import adminLogin from "../controllers/adminController.js"; // Note the .js extension

const router = express.Router();

router.post("/login", adminLogin);

export default router;
