<<<<<<< HEAD
import { Body, Controller, Delete, Get, HttpCode, JsonController, Params, Post, Put, UploadedFile, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { IProduto } from '../../shared/interfaces/produto/produto.interface';
import ProdutoService from '../../services/produto/produto.service';
=======
import { Body, Delete, Get, HttpCode, JsonController, Params, Post, Put } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import ProdutoService from '../../services/produto/produto.service';
import { IProduto } from '../../shared/interfaces/produto/produto.interface';
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906

@JsonController()
class ProdutoController {

    @Get("/product")
<<<<<<< HEAD
    @OpenAPI({ summary: 'Obtém informações de todos os produtos' })
    async listarProdutos() {
        try {
            const produtos = await ProdutoService.listarProdutos();
            return produtos.map(produto => ({
                id: produto._id,
                titulo: produto.titulo,
                imagem: produto.imagem,
                descricao: produto.descricao,
                quantidadeEstoque: produto.quantidadeEstoque,
                preco: produto.preco
            }));
=======
    @OpenAPI({ summary: 'Obtém informações de todos os produtos', description: 'Busca as informações de todos os produtos' })
    async listarProdutos() { 
        try {
            const produtos = await ProdutoService.listarProdutos();
            return produtos;
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906
        } catch (e) {
            return { message: 'Erro ao listar produtos.' };
        }
    }

    @Get("/product/:id")
    @OpenAPI({ summary: 'Obtém informações do produto', description: 'Busca as informações de um produto' })
<<<<<<< HEAD
    async informacoesProduto(@Params() params: { id: string }) {
=======
    async informacoesProduto(@Params() params: { id: string }) { 
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906
        try {
            const produtos = await ProdutoService.listarProdutoPorId(params.id);
            return produtos;
        } catch (e) {
            return { message: 'Erro ao listar produto.' };
        }
    }

    @Post("/create-product")
    @HttpCode(201)
    @OpenAPI({ summary: 'Registra um novo produto', description: 'Cria um novo produto com os dados fornecidos' })
<<<<<<< HEAD
    async cadastroDeProduto(@Body() dadosProduto: IProduto) {
=======
    async cadastroDeProduto(@Body() dadosProduto: IProduto) { 
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906
        console.log('Dados do produto:', dadosProduto);
        try {
            const produto = await ProdutoService.cadastrarProduto(dadosProduto);
            return { message: 'Produto cadastrado com sucesso!' };
<<<<<<< HEAD
        } catch (e: any) {
=======
        } catch(e: any) {
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906
            console.error('Erro ao cadastrar o produto:', e);
            return { message: 'Erro ao cadastrar o produto.', error: e.message };
        }
    }

    @Put("/update-product/:id")
    @HttpCode(201)
    @OpenAPI({ summary: 'Altera as informações de um produto', description: 'Altera as informações do produto pelo ID' })
<<<<<<< HEAD
    async alterarProduto(@Body() dadosProduto: IProduto) {
        try {
            const produto = await ProdutoService.cadastrarProduto(dadosProduto);
            return { message: 'Produto cadastrado com sucesso!' };
        } catch (e: any) {
=======
    async alterarProduto(@Params() params: { id: string },@Body() dadosProduto: IProduto) { 
        try {
            const produto = await ProdutoService.alterarProduto(dadosProduto, params.id);
            return { message: 'Produto alterado com sucesso!' };
        } catch(e: any) {
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906
            console.error('Erro ao atualizar o produto:', e);
            return { message: 'Erro ao atualizar o produto:', error: e.message };
        }
    }

    @Delete("/product/:id")
    @HttpCode(204)
    @OpenAPI({ summary: 'Deleta um produto', description: 'Deleta um produto pelo ID' })
<<<<<<< HEAD
    async deletarProduto(@Params() params: { id: string }) {
        try {
            await ProdutoService.deletarProduto(params.id);
            return { message: 'Produto deletado com sucesso!' };
        } catch (e: any) {
=======
    async deletarProduto(@Params() params: { id: string }) { 
        try {
            await ProdutoService.deletarProduto(params.id);
            return { message: 'Produto deletado com sucesso!' };
        } catch(e: any) {
>>>>>>> 9485b32eb272d285289c60ecddb40125871b1906
            console.error('Erro ao deletar o produto:', e);
            return { message: 'Erro ao deletar o produto:', error: e.message };
        }
    }
}

export default ProdutoController;