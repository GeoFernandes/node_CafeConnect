import { produto } from './../../schemas/produto/produto-schema';
import Pedido, { IPedido } from "../../schemas/pedido/pedido-schema";
import mongoose from 'mongoose';

export class PedidoService {
  static async criarPedido(dados: Partial<IPedido>) {
    return Pedido.create(dados);
  }

  static async listarPedidosPorUsuario(usuarioId: string) {
    return Pedido.find({ usuario: usuarioId }).sort({ dataPedido: -1 });
  }

  static async buscarPorId(id: string) {
    return Pedido.findById(id);
  }

  static async atualizarStatus(id: string, status: string, codigoRastreamento?: string) {
    return Pedido.findByIdAndUpdate(
      id,
      { status, ...(codigoRastreamento && { codigoRastreamento }) },
      { new: true }
    );
  }

  static async converteProdutos(produtos: any[]) {
    return produtos.map(produto => ({
        ...produto,
        produtoId: new mongoose.Types.ObjectId(produto.produtoId)
      }));
  }
}