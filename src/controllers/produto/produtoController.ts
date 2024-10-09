import { Body, Controller, Delete, Get, HttpCode, JsonController, Params, Post, Put } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { IProduto } from '../../shared/interfaces/produto/produto.interface';

@Controller()
@JsonController()
class ProdutoController {
  
  @Get("/product")
  @OpenAPI({ summary: 'Obtém informações de todos os produtos', description: 'Busca as informações de todos os produtos' })
  async produtos() { }

  @Get("/product/:id")
  @OpenAPI({ summary: 'Obtém informações do produto', description: 'Busca as informações de um produto pelo ID' })
  async informacoesProduto(@Params() params: { id: string }) { }

  @Post("/create-product")
  @HttpCode(201)
  @OpenAPI({ summary: 'Registra um novo produto', description: 'Cria um novo produto com os dados fornecidos' })
  async cadastroDeProduto(@Body() dadosProduto: IProduto) { }

  @Put("/product/:id")
  @HttpCode(201)
  @OpenAPI({ summary: 'Altera as informações do produto', description: 'Altera as informações do produto através do ID' })
  async alterarProduto(@Body() dadosProduto: IProduto) { }


  @Delete("/product/:id")
  @OpenAPI({ summary: 'Exlui informações do produto', description: 'exclui as informações do produto pelo ID' })
  async deletarProduto(@Params() params: { id: string }) {
    const { id } = params;
  }

}

export default ProdutoController;
