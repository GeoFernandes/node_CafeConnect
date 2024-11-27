import { Body, Delete, Get, HttpCode, JsonController, Params, Post } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import CarrinhoService from '../../services/carrinho/carrinho.service';

@JsonController()
class CarrinhoController {

    @Get("/carrinho/:id")
    @OpenAPI({ summary: 'Obtém informações do carrinho', description: 'Busca as informações do carrinho pelo ID do usuário' })
    async informacoesCarrinho(@Params() params: { id: string }) {
        try {
            const carrinho = await CarrinhoService.listarCarrinhoPorId(params.id);
            return carrinho;
        } catch (e) {
            return { message: 'Erro ao listar produtos.' };
        }
    }

    @Post("/add-product")
    @HttpCode(201)
    @OpenAPI({ summary: 'Adiciona um produto ao carrinho', description: 'Adiciona um produto ao carrinho do usuário' })
    async adicionarProduto(@Body() dadosProduto: { idUsuario: string, idProduto: string, quantidade: number }) {
        try {
            const produto = await CarrinhoService.adicionarProdutoAoCarrinho(dadosProduto.idUsuario, dadosProduto.idProduto, dadosProduto.quantidade);
            return { message: 'Produto adicionado ao carrinho com sucesso!' };
        } catch (e: any) {
            console.error('Erro ao adicionar o produto ao carrinho:', e);
            return { message: 'Erro ao adicionar o produto ao carrinho.', error: e.message };
        }
    }

    @Delete("/remove-product")
    @HttpCode(204)
    @OpenAPI({ summary: 'Remove um produto do carrinho', description: 'Remove um produto do carrinho do usuário' })
    async removerProduto(@Body() dadosProduto: { idUsuario: string, idProduto: string }) {
        try {
            await CarrinhoService.removerProdutoDoCarrinho(dadosProduto.idUsuario, dadosProduto.idProduto);
            return { message: 'Produto removido do carrinho com sucesso!' };
        } catch (e: any) {
            console.error('Erro ao remover o produto do carrinho:', e);
            return { message: 'Erro ao remover o produto do carrinho:', error: e.message };
        }
    }
    
}

export default CarrinhoController;