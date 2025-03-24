import { Usuario } from "../schemas/usuario-schema";

declare module "express" {
  export interface Request {
    user?: Usuario;
  }
}
