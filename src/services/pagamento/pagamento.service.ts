import PagamentoModel from '../../schemas/pagamento/pagamento-schema';

class PagamentoService {
  async criarPagamentoPix(usuarioId: string, valor: number) {
    const pagamento = await PagamentoModel.create({
      usuarioId,
      formaPagamento: 'PIX',
      status: 'pendente',
      valor,
      transactionId: `PIX-${Date.now()}`
    });

    return pagamento;
  }

  async criarPagamentoCartao(
    usuarioId: string,
    valor: number
  ) {
    const pagamento = await PagamentoModel.create({
      usuarioId,
      formaPagamento: 'CartaoCredito',
      status: 'sucesso',
      valor,
      transactionId: `CC-${Date.now()}`
    });

    return pagamento;
  }

  async atualizarStatusPagamento(pagamentoId: string, status: 'pendente' | 'sucesso' | 'erro') {
    const pagamentoAtualizado = await PagamentoModel.findByIdAndUpdate(
      pagamentoId,
      { status },
      { new: true }
    );
    return pagamentoAtualizado;
  }

  async listarPagamentosPorUsuario(usuarioId: string) {
    return await PagamentoModel.find({ usuarioId }).sort({ dataPagamento: -1 });
  }
}

export default new PagamentoService();
