import { model, Schema } from "mongoose";

export const produto = new Schema({
    titulo: { type: String, required: true },
    imagem: { type: Buffer, required: false },
    descricao: { type: String, required: true },
    quantidadeEstoque: { type: Number, required: true },
    preco: { type: Number, required: true },
  });


  export const Produto = model('Produto', produto);