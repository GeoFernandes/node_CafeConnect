import { model, Schema, Types } from 'mongoose';

const CarrinhoSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "ItemCarrinho"
    }
  ],
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

CarrinhoSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Carrinho = model("Carrinho", CarrinhoSchema);
