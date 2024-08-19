import mongoose from "mongoose";

const PedidoSchema = new mongoose.Schema({
  productos: [
    {
      producto: { type: String, required: true },
      cantidad: { type: Number, required: true },
      precio: { type: Number, required: true },
      product_name: { type: String, required: true },
      image: { type: String, required: true },
    },
  ],
  detalles_envio: {
    type: String,
  },
  numero_guia: { type: String },
  status_producto: { type: String },
  total: { type: Number },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username_author: { type: String },
  pagado: { type: Boolean, default: false },
});

const Pedido = mongoose.model("Pedido", PedidoSchema);

export default Pedido;
