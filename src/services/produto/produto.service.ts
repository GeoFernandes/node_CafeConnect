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
            return produto;
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            throw new Error("Erro ao cadastrar o produto.");
        }
    }

    public async listarProdutos() {
        return Produto.find();
    }

    public async listarProdutoPorId(id: string) {
        return Produto.findById(id);
    }

    public async alterarProduto(produto: IProduto, id: string) {
        return Produto.findByIdAndUpdate(id, produto);
    }

    public async deletarProduto(id: string) {
        return Produto.findByIdAndDelete(id);
    }

    public async atualizarEstoque(title: string, novaQuantidade: number) {
        const produto = await Produto.findOneAndUpdate(
            { titulo: title },
            { quantidadeEstoque: novaQuantidade },
            { new: true }
        );
        
        return produto;
    }
}

export default new ProdutoService();
