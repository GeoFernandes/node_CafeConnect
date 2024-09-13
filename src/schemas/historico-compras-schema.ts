import { Schema } from "mongoose";
import { itemCompradoSchema } from "./item-comprado-schema";

export const historicoSchema = new Schema({
    dataCompra: { type: String, required: true },
    itensComprados: [itemCompradoSchema],
    valorTotal: { type: Number, required: true },
  });
  