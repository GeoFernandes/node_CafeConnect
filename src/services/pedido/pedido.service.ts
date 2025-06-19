import { Produto, produto } from './../../schemas/produto/produto-schema';
import Pedido, { IPedido } from "../../schemas/pedido/pedido-schema";
import mongoose from 'mongoose';
import { Carrinho } from '../../schemas/carrinho/carrinho-schema';
import { ItemCarrinho, itemCarrinhoSchema } from '../../schemas/carrinho/item-carrinho-schema';

export class PedidoService {
  static async criarPedido(dados: Partial<IPedido>) {
    if (!dados.rastreamento) {
      dados.rastreamento = await this.gerarRastreamento();
    }
    // 1. Cria o pedido
    const pedidoCriado = await Pedido.create(dados);

    // 2. Exclui o carrinho do usuário
    if (dados.usuario) {
      await Carrinho.deleteOne({ userId: dados.usuario });
    }
  
    const carrinho = await Carrinho.findOne({ userId: dados.usuario });
    if (carrinho) {
      // Exclua todos os itens do carrinho com esse carrinhoId
      await ItemCarrinho.deleteMany({ carrinhoId: carrinho._id });
    }

    // 3. Diminui o estoque dos produtos
    if (dados.produtos && Array.isArray(dados.produtos)) {
      for (const item of dados.produtos) {
        await Produto.updateOne(
          { _id: item.produtoId },
          { $inc: { quantidadeEstoque: -item.quantidade } }
        );
      }
    }

    return pedidoCriado;
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

  static async gerarRastreamento() {
    const numeros = Math.floor(100000000 + Math.random() * 900000000); // 9 dígitos
    const letra = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Letra A-Z
    return {
      codigo: `BR${numeros}${letra}`,
      status: "Preparando",
      ultimaAtualizacao: new Date(),
    };
  }
}