import express from "express";
import { Login, Logout, InfoUserLogin } from "../controllers/Auth.js";

const router = express.Router();

// middleware verifyToken digunakan untuk mencegah user untuk mengakses endpoint sebelum dia login
router.post("/login", Login);
router.get("/info-user-login", InfoUserLogin);
router.delete("/logout", Logout);

export default router;
