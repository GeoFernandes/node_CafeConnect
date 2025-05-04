import { Schema, model, Types } from 'mongoose';

const PagamentoSchema = new Schema({
  usuarioId: {
    type: Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  formaPagamento: {
    type: String,
    enum: ['PIX', 'CartaoCredito'],
    required: true
  },
  status: {
    type: String,
    enum: ['pendente', 'sucesso', 'erro'],
    default: 'pendente'
  },
  valor: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  dataPagamento: {
    type: Date,
    default: Date.now
  }
});

export default model('Pagamento', PagamentoSchema);
