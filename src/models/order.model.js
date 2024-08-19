import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  items: [
    {
      product_name: { type: String, required: true },
      amount: { type: Number, required: true },
      cantidad: { type: Number, required: true },
    },
  ],
  orderId: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  numero_guia: { type: String },
  paqueteria: { type: String },
  fecha_de_envio: { type: Date },
  total: { type: Number },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username_author: { type: String },
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
