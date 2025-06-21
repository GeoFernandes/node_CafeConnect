import { Carrinho } from "../schemas/carrinho/carrinho-schema";
import { ItemCarrinho } from "../schemas/carrinho/item-carrinho-schema";
import { Produto } from "../schemas/produto/produto-schema";

export const liberarEstoqueReservado = async () => {
    const expirados = await Carrinho.find({ expiresAt: { $lt: new Date() } });

    for (const carrinho of expirados) {
        const itens = await ItemCarrinho.find({ carrinhoId: carrinho._id });

        for (const item of itens) {
            await Produto.findByIdAndUpdate(item.produtoId, {
                $inc: { quantidadeEstoque: item.quantidade }
            });
        }

        await ItemCarrinho.deleteMany({ carrinhoId: carrinho._id });
        await Carrinho.findByIdAndDelete(carrinho._id);
    }
};
