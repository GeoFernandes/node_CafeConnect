import { model, Schema, Types } from 'mongoose';

const CarrinhoSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "ItemCarrinho"
    }
  ]
});

export const Carrinho = model("Carrinho", CarrinhoSchema);
