import { Carrinho } from "../../schemas/carrinho/carrinho-schema";
import { ItemCarrinho } from "../../schemas/carrinho/item-carrinho-schema";
import { Produto } from "../../schemas/produto/produto-schema";
import { Usuario } from "../../schemas/usuario-schema";



class CarrinhoService {
    async listarCarrinhoPorId(idUsuario: string) {
        const carrinho = await Carrinho.findOne({ userId: idUsuario });
        
        if (!carrinho) throw new Error('Carrinho não encontrado.');
        let itensCarrinhos = await ItemCarrinho.find({ carrinhoId: carrinho._id }).lean();
        if (!itensCarrinhos.length) return [];

        const produtosIds = itensCarrinhos.map(item => item.produtoId);
        const produtos = await Produto.find({ _id: { $in: produtosIds } }).lean();
    
        const produtosMap = produtos.reduce((acc, produto) => {
            acc[produto._id.toString()] = produto;
            return acc;
        }, {} as Record<string, any>);
    
        const carrinhoFormatado = itensCarrinhos.map(item => {
            const produto = produtosMap[item.produtoId.toString()];
    
            return {
                id: produto._id.toString(),
                title: produto.titulo,
                price: produto.preco,
                imageSrc: produto.imagem,
                quantity: item.quantidade
            };
        });
    
        return carrinhoFormatado; 
    }

    public async adicionarProdutoAoCarrinho(idUsuario: string, idProduto: string, quantidade: number) {
        try {
            // Verifica se o usuário existe
            const usuario = await Usuario.findById(idUsuario);
            if (!usuario) throw new Error('Usuário não encontrado.');
    
            // Verifica se o produto existe
            const produto = await Produto.findById(idProduto);
            if (!produto) throw new Error('Produto não encontrado.');

            if (produto.quantidadeEstoque < quantidade) throw new Error('Estoque insuficiente.');
    
            // Busca ou cria o carrinho
            let carrinho = await Carrinho.findOne({ userId: idUsuario });

            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
    
            if (!carrinho) {
                carrinho = new Carrinho({ 
                    userId: idUsuario, 
                    items: [], 
                    createdAt: new Date(),
                    expiresAt 
                });
                await carrinho.save();
            } else {
                // Atualiza expiração para nova reserva
                carrinho.expiresAt = expiresAt;
                await carrinho.save();
            }
    
            // Verifica se o item já existe no carrinho
            let itemCarrinho = await ItemCarrinho.findOne({
                carrinhoId: carrinho._id,
                produtoId: idProduto
            });
    
            if (itemCarrinho) {
                // Atualiza a quantidade se já existir
                itemCarrinho.quantidade += quantidade;
                await itemCarrinho.save();
            } else {
                // Cria novo item
                itemCarrinho = new ItemCarrinho({
                    carrinhoId: carrinho._id,
                    produtoId: idProduto,
                    quantidade
                });
                await itemCarrinho.save();  
                // Adiciona a referência do item no carrinho
                carrinho.items.push(itemCarrinho._id);
                await carrinho.save();
            }

             // Subtrai do estoque
            produto.quantidadeEstoque -= quantidade;
            await produto.save();
    
            return {
                success: true,
                message: !itemCarrinho.isNew ? 'Produto atualizado no carrinho.' : 'Produto adicionado ao carrinho.',
                item: itemCarrinho
            };
    
        } catch (error: any) {
            console.error('Erro ao adicionar produto ao carrinho:', error.message);
            throw new Error('Erro ao adicionar produto ao carrinho.');
        }
    }
    
    public async atualizarCarrinho(idUsuario: string, itensAtualizados: { produtoId: string, quantidade: number }[]) {
        const carrinho = await Carrinho.findOne({ userId: idUsuario });
        if (!carrinho) throw new Error('Carrinho não encontrado.');

        for (const item of itensAtualizados) {
            const { produtoId, quantidade } = item;

            // Verifica se o produto existe
            const produto = await Produto.findById(produtoId);
            if (!produto) throw new Error(`Produto com ID ${produtoId} não encontrado.`);

            // Verifica se o item já existe no carrinho
            let itemCarrinho = await ItemCarrinho.findOne({
                carrinhoId: carrinho._id,
                produtoId: produtoId
            });

            if (itemCarrinho) {
                // Atualiza a quantidade se já existir
                itemCarrinho.quantidade = quantidade;
                await itemCarrinho.save();
            } else {
                // Cria novo item
                itemCarrinho = new ItemCarrinho({
                    carrinhoId: carrinho._id,
                    produtoId: produtoId,
                    quantidade
                });
                await itemCarrinho.save();
            }
        }

        await carrinho.save();

        return {
            success: true,
            message: 'Carrinho atualizado com sucesso.'
        };
    }


    public async removerProdutoDoCarrinho(idUsuario: string, idProduto: string) {
        const usuario = await Usuario.findById(idUsuario);
        if (!usuario) throw new Error('Usuário não encontrado.');
    
        const produto = await Produto.findById(idProduto);
        if (!produto) throw new Error('Produto não encontrado.');
    
        const carrinho = await Carrinho.findOne({ userId: idUsuario });
        if (!carrinho) throw new Error('Carrinho não encontrado.');
    
        const itemCarrinho = await ItemCarrinho.findOne({ carrinhoId: carrinho._id, produtoId: idProduto });
        if (!itemCarrinho) throw new Error('Produto não encontrado no carrinho.');

        produto.quantidadeEstoque += itemCarrinho.quantidade;
        await produto.save();
    
        // Remove o item do carrinho
        await itemCarrinho.deleteOne();
    
        // Atualiza o array de itens no carrinho
        carrinho.items = carrinho.items.filter(itemId => itemId.toString() !== itemCarrinho._id.toString());
        await carrinho.save();
    }

}

export default new CarrinhoService();
          