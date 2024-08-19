import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isadmin.middleware.js";
import {
  editPedido,
  GetPedido,
  GetAllPedidos,
  NewPedido,
  deletePedido,
} from "../controllers/pedidos.controller.js";

const router = Router();

router.get("/pedido", auth, GetPedido);
router.get("/pedidos", GetAllPedidos);
router.put("/pedidos/:id", auth, isAdmin, editPedido);
router.post("/newpedido", auth, NewPedido);
router.delete("/pedido/:id", deletePedido);

export default router;
