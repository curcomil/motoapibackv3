import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import User from "../models/user.model.js";

export const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
