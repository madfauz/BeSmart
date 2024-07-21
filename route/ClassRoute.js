import express from "express";
import { createClass, getClasses, getClassById, checkUserAccess, verifyCodeClass, getListStudentsById, getListTeachersById, editClass, deleteClass } from "../controllers/Class.js";
import { addMaterial, editMaterial, deleteMaterial } from "../controllers/Material.js";
const router = express.Router();

// middleware verifyToken digunakan untuk mencegah user untuk mengakses endpoint sebelum dia login
router.post("/classes", createClass);
router.get("/classes", getClasses);
router.get("/classes/:id", getClassById);
router.post("/classes/access", checkUserAccess);
router.post("/classes/access/verify", verifyCodeClass);
router.post("/classes/addMaterial", addMaterial);
router.post("/classes/listStudents", getListStudentsById);
router.post("/classes/listTeachers", getListTeachersById);
router.post("/classes/edit", editClass);
router.post("/classes/material/edit", editMaterial);
router.post("/classes/deleteMaterial", deleteMaterial);
router.post("/classes/delete", deleteClass);

export default router;
