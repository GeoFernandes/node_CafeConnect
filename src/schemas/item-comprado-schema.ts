import { Schema } from "mongoose";

export const itemCompradoSchema = new Schema({
    nomeProduto: { type: String, required: true },
    quantidade: { type: Number, required: true },
    preco: { type: Number, required: true },
  });