import { model, Schema } from "mongoose";

export const produto = new Schema({
    titulo: { type: String, required: true },
<<<<<<< HEAD
    imagem: { type: Buffer, required: false },
=======
    imagem: { type: String, required: false },
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906
    descricao: { type: String, required: true },
    quantidadeEstoque: { type: Number, required: true },
    preco: { type: Number, required: true },
  });


  export const Produto = model('Produto', produto);