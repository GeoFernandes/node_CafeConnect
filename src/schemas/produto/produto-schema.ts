import { Schema } from "mongoose";

export const produto = new Schema({
    titulo: { type: String, required: true },
    imagem: { type: String, required: true },
    descricao: { type: String, required: true },
    quantidadeEstoque: { type: Number, required: true },
    preco: { type: Number, required: true },
  });