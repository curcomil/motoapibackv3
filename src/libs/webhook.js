switch (event.type) {
  case "payment_intent.succeeded":
    const paymentIntentSucceeded = event.data.object;
    console.log("Tienes un nuevo pedido!", paymentIntentSucceeded.metadata);

    // Parsear el JSON de los items
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

      // Reducir el stock de cada producto en la orden
      for (const item of data.items) {
        console.log(`Reduciendo stock para el producto ${item.itemId}`);
        await reduceProductStock(item.itemId, item.cantidad);
      }

      response.status(200).send("Orden guardada con éxito y stock actualizado");
    } catch (dbError) {
      console.error(
        "Error al conectar o guardar en la base de datos:",
        dbError.message
      );
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
