import mongoose, { Schema, Document } from "mongoose";
import Contador from "../pedido/contador-schema";

export interface IPedido extends Document {
  pedidoId: number;
  usuario: mongoose.Types.ObjectId;
  produtos: Array<{
    produtoId: mongoose.Types.ObjectId;
    nome: string;
    quantidade: number;
    preco: number;
  }>;
  total: number;
  status: string;
  dataPedido: Date;
  enderecoEntrega: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  rastreamento: {
    codigo: String,
    status: String,
    ultimaAtualizacao?: Date,
  }
}

const PedidoSchema = new Schema<IPedido>({
  pedidoId: { type: Number, unique: true },
  usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  produtos: [
    {
      produtoId: { type: Schema.Types.ObjectId, ref: "Produto", required: true },
      nome: String,
      quantidade: Number,
      preco: Number,
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, required: true, default: "Pendente" },
  dataPedido: { type: Date, default: Date.now },
  enderecoEntrega: {
    rua: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    cep: String,
  },
  rastreamento: {
        codigo: String,
        status: String,
        ultimaAtualizacao: { type: Date },
      }
});

PedidoSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Contador.findOneAndUpdate(
      { model: "Pedido" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.pedidoId = counter.seq;
  }
  next();
});

export default mongoose.model<IPedido>("Pedido", PedidoSchema);