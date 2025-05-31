import mongoose, { Schema, Document } from "mongoose";

export interface IPedido extends Document {
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
  codigoRastreamento?: string;
}

const PedidoSchema = new Schema<IPedido>({
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
  codigoRastreamento: String,
});

export default mongoose.model<IPedido>("Pedido", PedidoSchema);