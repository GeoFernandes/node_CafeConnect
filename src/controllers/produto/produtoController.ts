import { Body, Delete, Get, HttpCode, JsonController, Params, Post, Put } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import ProdutoService from '../../services/produto/produto.service';
import { IProduto } from '../../shared/interfaces/produto/produto.interface';

@JsonController()
class ProdutoController {

    @Get("/product")
    @OpenAPI({ summary: 'Obtém informações de todos os produtos', description: 'Busca as informações de todos os produtos' })
    async listarProdutos() {
        try {
            const produtos = await ProdutoService.listarProdutos();
            return produtos;
        } catch (e) {
            return { message: 'Erro ao listar produtos.', error: (e as any).message };
        }
    }

    @Get("/product/:id")
    @OpenAPI({ summary: 'Obtém informações do produto', description: 'Busca as informações de um produto' })
    async informacoesProduto(@Params() params: { id: string }) {
        console.log('ID do produto recebido:', params.id); // Log para depuração
        try {
            const produto = await ProdutoService.listarProdutoPorId(params.id);
            console.log("Produto:", produto); // Log para depuração
            if (!produto) {
                return { message: 'Produto não encontrado.' };
            }
            return produto;
        } catch (e) {
            return { message: 'Erro ao listar produto.', error: (e as any).message };
        }
    }

    @Post("/create-product")
    @HttpCode(201)
    @OpenAPI({ summary: 'Registra um novo produto', description: 'Cria um novo produto com os dados fornecidos' })
    async cadastroDeProduto(@Body() dadosProduto: IProduto) {
        try {
            await ProdutoService.cadastrarProduto(dadosProduto);
            return { message: 'Produto cadastrado com sucesso!' };
        } catch (e: any) {
            console.error('Erro ao cadastrar o produto:', e);
            return { message: 'Erro ao cadastrar o produto.', error: e.message };
        }
    }

    @Put("/update-product/:id")
    @HttpCode(201)
    @OpenAPI({ summary: 'Altera as informações de um produto', description: 'Altera as informações do produto pelo ID' })
    async alterarProduto(@Params() params: { id: string }, @Body() dadosProduto: IProduto) {
        try {
            const produtoAtualizado = await ProdutoService.alterarProduto(dadosProduto, params.id);
            if (!produtoAtualizado) {
                return { message: 'Produto não encontrado para atualizar.' };
            }
            return { message: 'Produto alterado com sucesso!' };
        } catch (e: any) {
            console.error('Erro ao atualizar o produto:', e);
            return { message: 'Erro ao atualizar o produto.', error: e.message };
        }
    }

    @Delete("/product/:id")
    @HttpCode(204)
    @OpenAPI({ summary: 'Deleta um produto', description: 'Deleta um produto pelo ID' })
    async deletarProduto(@Params() params: { id: string }) {
        try {
            await ProdutoService.deletarProduto(params.id);
            return { message: 'Produto deletado com sucesso!' };
        } catch (e: any) {
            console.error('Erro ao deletar o produto:', e);
            return { message: 'Erro ao deletar o produto.', error: e.message };
        }
    }

    @Put("/product/:title")
    @HttpCode(200)
    @OpenAPI({ summary: 'Atualiza a quantidade em estoque de um produto', description: 'Diminui a quantidade em estoque de um produto pelo título' })
    async atualizarEstoque(@Params() params: { title: string }, @Body() dadosEstoque: { quantidadeEstoque: number }) {
        try {
            const produto = await ProdutoService.atualizarEstoque(params.title, dadosEstoque.quantidadeEstoque);
            if (!produto) {
                return { message: 'Produto não encontrado.' };
            }
            return { message: 'Estoque atualizado com sucesso!', produto };
        } catch (e: any) {
            console.error('Erro ao atualizar o estoque:', e);
            return { message: 'Erro ao atualizar o estoque.', error: e.message };
        }
    }
}

export default ProdutoController;
