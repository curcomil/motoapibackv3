import { Router } from "express";
import {
  GetAllOrders,
  GetOrderById,
  UpdateOrderById,
  GetOrderByAuthor,
} from "../controllers/order.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/orders", GetAllOrders); // Obtener todas las órdenes
router.get("/orders/:id", GetOrderById); // Obtener una orden por ID
router.put("/orders/:id", UpdateOrderById); // Editar una orden por ID
router.get("/order/find", auth, GetOrderByAuthor); //Buscar por autor

export default router;
