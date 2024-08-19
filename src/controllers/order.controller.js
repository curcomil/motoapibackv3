import Order from "../models/order.model.js";

// Obtener todas las órdenes
export const GetAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las órdenes", error });
  }
};

// Obtener una orden por ID
export const GetOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la orden", error });
  }
};

// Editar una orden por ID
export const UpdateOrderById = async (req, res) => {
  const { id } = req.params;
  const { items, numero_guia, total, paqueteria, fecha_de_envio } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { items, numero_guia, total, paqueteria, fecha_de_envio },
      { new: true } // Esto devuelve la orden actualizada
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la orden", error });
  }
};

//Obtener orden por autor
export const GetOrderByAuthor = async (req, res) => {
  try {
    const authorId = req.user._id;
    const order = await Order.find({ author: authorId });

    if (!order || order.length === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error al obtener la orden:", error); // Añade un log para depuración
    res.status(500).json({ message: "Error al obtener la orden", error });
  }
};
