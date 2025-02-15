import { Post, Body, HttpCode, Controller, Res, Get, Params, UseBefore, Delete, JsonController } from 'routing-controllers';
import { ILogin, IUsuario } from '../../shared/interface';
import UsuarioService from '../../services/usuario.service';
import { Usuario } from '../../schemas/usuario-schema';
import mongoose from 'mongoose';
import { verificaToken } from '../../autenticacao/auth.middleware';
import { OpenAPI } from 'routing-controllers-openapi';

@Controller()
@JsonController()
class UsuarioController {

  @Post("/auth/register")
  @HttpCode(201)
  @OpenAPI({ summary: 'Registra um novo usuário', description: 'Cria um novo usuário com os dados fornecidos' })
  async registroDeUsuario(@Body() dadoUsuario: IUsuario, @Res() res: any): Promise<any> {
    try {
      const dadosValidos = await UsuarioService.validaDadosUsuario(dadoUsuario);
      if (!dadosValidos) return res.status(400).json({ msg: "Preencha todos os campos obrigatórios corretamente." });

      const userExists = await UsuarioService.acharUsuarioPeloEmail(dadoUsuario.email);
      if (userExists) return res.status(409).json({ msg: "Usuário já existe" });

      await UsuarioService.criarUsuario(dadoUsuario);

      return res.status(201).json({ msg: "Usuário criado com sucesso!" });
    } catch (erro) {
      console.error("Erro ao criar usuário:", erro);
      return res.status(500).json({ msg: "Erro no servidor. Tente mais tarde." });
    }
  }

  @Post("/auth/login")
  @HttpCode(200)
  @OpenAPI({ summary: 'Faz login do usuário', description: 'Autentica o usuário com email e senha' })
  async loginDoUsuario(@Body() dadosLogin: ILogin, @Res() res: any): Promise<any> {
    try {
      const resultado = await UsuarioService.verificaDadosLogin(dadosLogin);
      if (resultado.msg === "Credenciais inválidas.") {
        return res.status(401).json(resultado);
      }
      return res.status(200).json(resultado);
    } catch (erro) {
      console.error("Erro no login:", erro);
      return res.status(500).json({ msg: "Erro no servidor. Tente mais tarde." });
    }
  }

  @Get("/user/:id")
  @UseBefore(verificaToken)
  @OpenAPI({ summary: 'Obtém informações do usuário', description: 'Busca as informações de um usuário pelo ID' })
  async informacoesUsuario(@Params() params: { id: string }, @Res() res: any): Promise<any> {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido." });
    }

    try {
      const usuario = await Usuario.findById(id, '-senha').lean();

      if (!usuario) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
      }

      return res.status(200).json({ msg: "Usuário encontrado.", usuario });
    } catch (erro) {
      console.error("Erro ao buscar o usuário:", erro);
      return res.status(500).json({ msg: "Erro ao buscar o usuário." });
    }
  }

  @Delete("/user/:id")
  @UseBefore(verificaToken)
  @OpenAPI({ summary: 'Exclui informações do usuário', description: 'Exclui as informações de um usuário pelo ID' })
  async deletaUsuario(@Params() params: { id: string }, @Res() res: any): Promise<any> {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido." });
    }

    try {
      const usuarioDeletado = await Usuario.deleteOne({ _id: id });
      if (!usuarioDeletado) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
      }
      return res.status(200).json({ msg: "Usuário excluído." });
    } catch (erro) {
      console.error("Erro ao excluir o usuário:", erro);
      return res.status(500).json({ msg: "Erro ao excluir o usuário." });
    }
  }

}

export default UsuarioController;
