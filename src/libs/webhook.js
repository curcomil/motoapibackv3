import { Router } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Stripe from "stripe";
import express from "express";
import Order from "../models/order.model.js";
import Product from "../models/products.model.js"; // Asegúrate de que Product esté importado

dotenv.config();
const router = Router();
const stripe = new Stripe(process.env.Stripe_secret_key);
const endpointSecret = process.env.endpointsecret;

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook Error:", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Manejar el evento
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log("Tienes un nuevo pedido!", paymentIntentSucceeded.metadata);
        const data = JSON.parse(paymentIntentSucceeded.metadata.items);
        const userId = paymentIntentSucceeded.metadata.userId;

        try {
          const newOrder = new Order({
            orderId: data.orderId,
            items: data.items,
            total: data.total,
            author: new mongoose.Types.ObjectId(userId),
            username_author: paymentIntentSucceeded.metadata.username,
          });

          await newOrder.save();
          console.log("Orden añadida a la base de datos con éxito:", newOrder);

          // Reducir stock para cada producto
          for (const item of data.items) {
            const productId = item.productId;
            const quantity = item.quantity;
            await reduceProductStock(productId, quantity);
          }

          response.status(200).send("Orden guardada con éxito");
        } catch (dbError) {
          console.error(
            "Error al conectar o guardar en la base de datos:",
            dbError.message
          );
          // Si ocurre un error en la base de datos, solo mostramos la metadata
          console.log("Metadata de la orden:", paymentIntentSucceeded.metadata);
          response
            .status(500)
            .send("Error al guardar la orden en la base de datos");
        }
        break;
      // ... manejar otros tipos de eventos
      default:
        console.log(`Unhandled event type ${event.type}`);
        response.status(400).send(`Unhandled event type ${event.type}`);
    }
  }
);

// Función para reducir el stock del producto
const reduceProductStock = async (productId, quantity) => {
  try {
    const product = await Product.findById(productId);

    if (!product) {
      console.error("Producto no encontrado:", productId);
      return;
    }

    if (product.stock < quantity) {
      console.error("Stock insuficiente para el producto:", productId);
      return;
    }

    product.stock -= quantity;
    await product.save();
    console.log("Stock reducido con éxito para el producto:", productId);
  } catch (error) {
    console.error("Error al reducir el stock del producto:", productId, error);
  }
};

export default router;
