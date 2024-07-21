import express from "express";
import { createImage, getLoginImage, getClassImage , getRegisterImage} from "../controllers/Resource.js";

const router = express.Router();

router.post("/resource/create", createImage);
router.get("/resource/loginImage", getLoginImage);
router.get("/resource/registerImage", getRegisterImage);
router.get("/resource/classImage", getClassImage);

export default router;
