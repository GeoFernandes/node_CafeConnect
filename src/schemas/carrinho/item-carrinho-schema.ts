import { model, Schema, Types } from 'mongoose';

export const itemCarrinhoSchema = new Schema({
    carrinhoId: { type: Types.ObjectId, ref: 'Carrinho', required: true },
    produtoId: { type: Types.ObjectId, ref: 'Produto', required: true },
    quantidade: { type: Number, required: true },
});

export const ItemCarrinho = model('ItemCarrinho', itemCarrinhoSchema);