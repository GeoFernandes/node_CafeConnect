// src/middlewares/authorization.ts
import { Action } from "routing-controllers";
import jwt from "jsonwebtoken";
import { Usuario } from "../schemas/usuario-schema";

export const authorizationChecker = async (action: Action): Promise<boolean> => {
  const token = action.request.headers["authorization"]?.split(" ")[1];
  if (!token) return false;

  try {
    const secret = process.env.SECRET as string;
    const decoded: any = jwt.verify(token, secret);
    const user = await Usuario.findById(decoded.id).select("-senha");

    if (!user) return false;

    // Adiciona o usuário na request
    action.request.user = user;
    return true;
  } catch (error) {
    return false;
  }
};

export const currentUserChecker = async (action: Action) => {
  return action.request.user;
};
