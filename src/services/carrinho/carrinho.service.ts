import { Carrinho } from "../../schemas/carrinho/carrinho-schema";
import { ItemCarrinho } from "../../schemas/carrinho/item-carrinho-schema";
import { Produto } from "../../schemas/produto/produto-schema";
import { Usuario } from "../../schemas/usuario-schema";



class CarrinhoService {
    async listarCarrinhoPorId(idUsuario: string) {

        const carrinho = await Carrinho.findOne({ usuarioId: idUsuario });
        if (!carrinho) throw new Error('Carrinho não encontrado.');
        let itensCarrinhos = await ItemCarrinho.find({ carrinhoId: carrinho._id }).populate('produtoId');
        return itensCarrinhos;  
    }

    public async adicionarProdutoAoCarrinho(idUsuario: string, idProduto: string, quantidade: number) {
        const usuario = await Usuario.findById(idUsuario);
        if (!usuario) throw new Error('Usuário não encontrado.');
    
        const produto = await Produto.findById(idProduto);
        if (!produto) throw new Error('Produto não encontrado.');
    
        let carrinho = await Carrinho.findOne({ usuarioId: idUsuario });
        if (!carrinho) {
            carrinho = new Carrinho({ usuarioId: idUsuario });
            await carrinho.save();
        }
    
        const itemCarrinho = await ItemCarrinho.findOne({ carrinhoId: carrinho._id, produtoId: idProduto });
        if (itemCarrinho) {
            itemCarrinho.quantidade += quantidade;
            return itemCarrinho.save();
        }
    
        const novoItemCarrinho = new ItemCarrinho({ carrinhoId: carrinho._id, produtoId: idProduto, quantidade });
        await novoItemCarrinho.save();
        return novoItemCarrinho;
    }


    public async removerProdutoDoCarrinho(idUsuario: string, idProduto: string) {
        const usuario = await Usuario.findById(idUsuario);
        if (!usuario) throw new Error('Usuário não encontrado.');
    
        const produto = await Produto.findById(idProduto);
        if (!produto) throw new Error('Produto não encontrado.');
    
        const carrinho = await Carrinho.findOne({ usuarioId: idUsuario });
        if (!carrinho) throw new Error('Carrinho não encontrado.');
    
        const itemCarrinho = await ItemCarrinho.findOne({ carrinhoId: carrinho._id, produtoId: idProduto });
        if (!itemCarrinho) throw new Error('Produto não encontrado no carrinho.');
    
        await itemCarrinho.deleteOne();
        return itemCarrinho;
    }

}

export default new CarrinhoService();
