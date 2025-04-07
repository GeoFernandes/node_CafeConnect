import { Body, Delete, Get, HttpCode, JsonController, Post, Authorized, CurrentUser } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import CarrinhoService from '../../services/carrinho/carrinho.service';

@JsonController("/carrinho")
export default class CarrinhoController {

    @Get("/")
    @Authorized()
    @OpenAPI({ summary: 'Obtém o carrinho do usuário', description: 'Retorna os produtos do carrinho do usuário logado' })
    async obterCarrinho(@CurrentUser() user: any) {
        try {
            const carrinho = await CarrinhoService.listarCarrinhoPorId(user._id);
            return { success: true, data: carrinho };
        } catch (e) {
            return { success: false, message: 'Erro ao listar produtos.', error: (e as any).message };
        }
    }

    @Post("/adicionar")
    @HttpCode(201)
    @Authorized()
    @OpenAPI({ summary: 'Adiciona um produto ao carrinho', description: 'Adiciona um produto ao carrinho do usuário logado' })
    async adicionarProduto(@CurrentUser() user: any, @Body() dados: { idProduto: string, quantidade: number }) {
        try {
            await CarrinhoService.adicionarProdutoAoCarrinho(user.id, dados.idProduto, dados.quantidade);
            return { success: true, message: 'Produto adicionado ao carrinho com sucesso!' };
        } catch (e) {
            return { success: false, message: 'Erro ao adicionar o produto ao carrinho.', error: (e as any).message };
        }
    }

    @Delete("/remover")
    @HttpCode(200)
    @Authorized()
    @OpenAPI({ summary: 'Remove um produto do carrinho', description: 'Remove um produto do carrinho do usuário logado' })
    async removerProduto(@CurrentUser() user: any, @Body() dados: { idProduto: string }) {
        try {
            await CarrinhoService.removerProdutoDoCarrinho(user.id, dados.idProduto);
            return { success: true, message: 'Produto removido do carrinho com sucesso!' };
        } catch (e) {
            return { success: false, message: 'Erro ao remover o produto do carrinho.', error: (e as any).message };
        }
    }
}