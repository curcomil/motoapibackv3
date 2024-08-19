import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyToken,
  editUser,
  getUserProfile,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middlewares.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.get("/verify", verifyToken);
router.put("/update", editUser);
router.post("/logout", logout);
router.get("/profile", getUserProfile);

export default router;
