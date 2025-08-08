import express from "express";
const router = express.Router();
const { getAbout } = require("../controllers/aboutController");

router.get("/", getAbout);

export default router;
