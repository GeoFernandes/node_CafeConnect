import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "../schemas/usuario-schema";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
        const secret = process.env.SECRET as string;
        const decoded: any = jwt.verify(token, secret);
        const user = await Usuario.findById(decoded.id).select("-senha");
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido" });
    }
};

export default authMiddleware;
