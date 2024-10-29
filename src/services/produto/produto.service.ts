<<<<<<< HEAD
import multer from 'multer';
=======
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906
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

<<<<<<< HEAD
    public async alteraeProduto(id: string) {
        return Produto.findById(id);
=======
    public async alterarProduto(produto: IProduto, id: string) {
        return Produto.findByIdAndUpdate(id, produto);
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906
    }

    public async deletarProduto(id: string) {
        return Produto.findByIdAndDelete(id);
    }
}

<<<<<<< HEAD
export default new ProdutoService();
=======
export default new ProdutoService();
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906
