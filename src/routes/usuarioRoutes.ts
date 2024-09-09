import express from "express";
import usuarioController from "../controllers/usuario/usuarioController";

const routes = express.Router();

routes.post("/entrar", usuarioController.entrar);

export default routes;
