import express, { Express, Request, Response } from "express";
import usuarioRoutes from "../controllers/usuario/usuarioController";

const routes = (app: Express) => {
  app.route("/").get((req: Request, res: Response) => res.status(200).send("Home"));

  app.use(express.json());
  app.use("/api", routes);
};

export default routes;