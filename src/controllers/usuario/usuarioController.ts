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
  async registroDeUsuario(@Body() dadoUsuario: IUsuario): Promise<{ msg: string, objeto?: any }> {

    try {
      const dadosValidos = await UsuarioService.validaDadosUsuario(dadoUsuario);
      if (!dadosValidos) return { msg: "Preencha todos os campos obrigatórios corretamente." };

      const userExists = await UsuarioService.acharUsuarioPeloEmail(dadoUsuario.email);
      if (userExists) return { msg: "E-mail já registrado na base de dados." };

      await UsuarioService.criarUsuario(dadoUsuario);

      return { msg: "Usuário criado com sucesso!" };
    } catch (erro) {
      console.error("Erro ao criar usuário:", erro);
      return { msg: "Erro no servidor. Tente mais tarde." };
    }
  }

  @Post("/auth/login")
  @HttpCode(200)
  @OpenAPI({ summary: 'Faz login do usuário', description: 'Autentica o usuário com email e senha' })
  async loginDoUsuario(@Body() dadosLogin: ILogin): Promise<{ msg: string, token?: string }> {
    try {
      console.log(dadosLogin);
      const resultado = await UsuarioService.verificaDadosLogin(dadosLogin);
      return resultado;
    } catch (erro) {
      console.error("Erro no login:", erro);
      return { msg: "Erro no servidor. Tente mais tarde." };
    }
  }

  @Get("/user/:id")
  @UseBefore(verificaToken)
  @OpenAPI({ summary: 'Obtém informações do usuário', description: 'Busca as informações de um usuário pelo ID' })
  async informacoesUsuario(@Params() params: { id: string }): Promise<{ msg: string, usuario?: any }> {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { msg: "ID inválido." };
    }

    try {
      const usuario = await Usuario.findById(id, '-senha').lean();

      if (!usuario) {
        return { msg: "Usuário não encontrado." };
      }

      return { msg: "Usuário encontrado.", usuario };
    } catch (erro) {
      console.error("Erro ao buscar o usuário:", erro);
      return { msg: "Erro ao buscar o usuário." };
    }
  }




  @Delete("/user/:id")
  @UseBefore(verificaToken)
  @OpenAPI({ summary: 'Exlui informações do usuário', description: 'exclui as informações de um usuário pelo ID' })
  async deletaUsuario(@Params() params: { id: string }): Promise<{ msg: string, usuario?: any }> {
    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { msg: "ID inválido." };
    }

    try {
      const usuarioDeletado = await Usuario.deleteOne({ _id: id});
      if (!usuarioDeletado) {
        return { msg: "Usuário não encontrado." };
      }
      return { msg: "Usuário excluído."};
    } catch (erro) {
      return { msg: "Erro ao buscar o usuário." };
    }
  }

}

export default UsuarioController;
