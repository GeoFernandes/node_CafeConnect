import { Produto } from "../../schemas/produto/produto-schema";
import { IProduto } from "../../shared/interfaces/produto/produto.interface";

class ProdutoService {

    public async cadastrarProduto(dadosProduto: IProduto) {
        try {
            const produto = new Produto({
                titulo: dadosProduto.titulo,
                imagem: '',
                descricao: dadosProduto.descricao,
                quantidadeEstoque: dadosProduto.quantidadeEstoque,
                preco: dadosProduto.preco,
            });

            await produto.save();
            return this.formatarProduto(produto);
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            throw new Error("Erro ao cadastrar o produto.");
        }
    }

    public async listarProdutos() {
        try {
            const produtos = await Produto.find();
            return produtos.map(this.formatarProduto);
        } catch (error) {
            console.error("Erro ao listar produtos:", error);
            throw new Error("Erro ao listar produtos.");
        }
    }

    public async listarProdutoPorId(id: string) {
        try {
            const produto = await Produto.findById(id);
            return produto ? this.formatarProduto(produto) : null;
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            throw new Error("Erro ao buscar produto.");
        }
    }

    public async alterarProduto(produto: IProduto, id: string) {
        try {
            const produtoAtualizado = await Produto.findByIdAndUpdate(id, produto, { new: true });
            return produtoAtualizado ? this.formatarProduto(produtoAtualizado) : null;
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            throw new Error("Erro ao atualizar produto.");
        }
    }

    public async deletarProduto(id: string) {
        try {
            await Produto.findByIdAndDelete(id);
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            throw new Error("Erro ao deletar produto.");
        }
    }

    public async atualizarEstoque(title: string, novaQuantidade: number) {
        try {
            const produto = await Produto.findOneAndUpdate(
                { titulo: title },
                { quantidadeEstoque: novaQuantidade },
                { new: true }
            );

            return produto ? this.formatarProduto(produto) : null;
        } catch (error) {
            console.error("Erro ao atualizar estoque:", error);
            throw new Error("Erro ao atualizar estoque.");
        }
    }

    /**
     * Formata o retorno do produto, removendo propriedades desnecessárias.
     */
    private formatarProduto(produto: any) {
        return {
            id: produto._id.toString(),
            titulo: produto.titulo,
            imagem: produto.imagem,
            descricao: produto.descricao,
            quantidadeEstoque: produto.quantidadeEstoque,
            preco: produto.preco,
        };
    }
}

export default new ProdutoService();
