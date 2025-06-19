import { JsonController, Post, Get, Param, Body, Req, Res, Put, UseBefore } from "routing-controllers";
import { PedidoService } from "../../services/pedido/pedido.service";
import Pedido from "../../schemas/pedido/pedido-schema";
import authMiddleware from "../../autenticacao/auth.middleware";

interface ProdutoPedido {
  produtoId: string;
  nome: string;
  quantidade: number;
  preco: number;
}
interface EnderecoEntrega {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}
interface CriarPedidoBody {
  produtos: ProdutoPedido[];
  total: number;
  enderecoEntrega: EnderecoEntrega;
}

@JsonController("/pedido")
@UseBefore(authMiddleware)
export class PedidoController {
  @Post("/criar")
  async criarPedido(@Body() body: CriarPedidoBody, @Req() req: any, @Res() res: any) {
    try {
      const pedido = await PedidoService.criarPedido({
        usuario: req.user._id,
        produtos: await PedidoService.converteProdutos(body.produtos),
        total: body.total,
        enderecoEntrega: body.enderecoEntrega,
        status: "em aberto",
        dataPedido: new Date(),
      });
      return res.status(201).json({ msg: "Pedido criado com sucesso!", pedido });
    } catch (error) {
      return res.status(500).json({ msg: "Erro ao criar pedido", error });
    }
  }

  @Get("/usuario/:usuarioId")
  async listarPedidos(@Param("usuarioId") usuarioId: string, @Res() res: any) {
    try {
      const pedidos = await PedidoService.listarPedidosPorUsuario(usuarioId);
      return res.status(200).json(pedidos);
    } catch (error) {
      return res.status(500).json({ msg: "Erro ao buscar pedidos", error });
    }
  }

  @Get("/:id")
  async buscarPedido(@Param("id") id: string, @Res() res: any) {
    try {
      const pedido = await PedidoService.buscarPorId(id);
      if (!pedido) return res.status(404).json({ msg: "Pedido não encontrado" });
      return res.status(200).json(pedido);
    } catch (error) {
      return res.status(500).json({ msg: "Erro ao buscar pedido", error });
    }
  }

  @Put("/:id/status")
  async atualizarStatus(
    @Param("id") id: string,
    @Body() body: { status: string; codigoRastreamento?: string },
    @Res() res: any
  ) {
    try {
      const pedido = await PedidoService.atualizarStatus(id, body.status, body.codigoRastreamento);
      if (!pedido) return res.status(404).json({ msg: "Pedido não encontrado" });
      return res.status(200).json({ msg: "Status atualizado", pedido });
    } catch (error) {
      return res.status(500).json({ msg: "Erro ao atualizar status do pedido", error });
    }
  }
}

export default PedidoController;