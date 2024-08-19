import express, { json } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productosRoutes from "./routes/products.routes.js";
import Pedidos from "./routes/pedidos.routes.js";
import { FRONTEND_URL } from "./config.js";
import pasarela from "./libs/mercadopago.js";
import webhook from "./libs/webhook.js";
import Order from "./routes/order.routes.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api", webhook);
app.use(express.json());

app.use("/api", Pedidos);
app.use("/api/auth", authRoutes);
app.use("/api", productosRoutes);
app.use("/api", pasarela);
app.use("/api", Order);

if (process.env.NODE_ENV === "production") {
  const path = await import("path");
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    console.log(path.resolve("client", "dist", "index.html"));
    res.sendFile(path.resolve("client", "dist", "index.html"));
  });
}

export default app;
