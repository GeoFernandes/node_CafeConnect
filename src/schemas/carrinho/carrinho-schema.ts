import { model, Schema, Types } from 'mongoose';

export const carrinhoSchema = new Schema({
    usuarioId: { type: Types.ObjectId, ref: 'Usuario', required: true },
});

export const Carrinho = model('Carrinho', carrinhoSchema);