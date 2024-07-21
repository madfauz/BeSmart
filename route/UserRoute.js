import express from "express";
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import {
  createUser,
  getUsers,
  editUsername,
  getUsersByRole,
  getUserClassTaken,
  leaveClass,
  confirmEmail,
} from "../controllers/User.js";

const router = express.Router();

// middleware verifyToken digunakan untuk mencegah user untuk mengakses endpoint sebelum dia login
router.get("/token", refreshToken);
router.get("/users", verifyToken, getUsers);
router.get("/users/:role", getUsersByRole);
router.get("/confirmation/:token", confirmEmail);
router.post("/users/register", createUser);
router.put("/users/edit/username", editUsername);
router.post("/users/classTaken", getUserClassTaken);
router.post("/users/leaveClass", leaveClass);
// router.patch("/users", updateUser);

export default router;
