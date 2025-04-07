import { Post, Body, HttpCode, Controller, Res, Get, Params, UseBefore, Delete, JsonController } from 'routing-controllers';
import { ILogin, IUsuario } from '../../shared/interface';
import UsuarioService from '../../services/usuario.service';
import { Usuario } from '../../schemas/usuario-schema';
import mongoose from 'mongoose';
import authMiddleware from '../../autenticacao/auth.middleware';
import { OpenAPI } from 'routing-controllers-openapi';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'default-secret-key'; //Ajustar depois

const decryptData = (data: string) => {
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

@Controller()
@JsonController()
class UsuarioController {

  @Post("/auth/register")
  @HttpCode(201)
  @OpenAPI({ summary: 'Registra um novo usuário', description: 'Cria um novo usuário com os dados fornecidos' })
  async registroDeUsuario(@Body() dadoUsuario: IUsuario, @Res() res: any): Promise<any> {
    try {
      dadoUsuario.email = decryptData(dadoUsuario.email);
      dadoUsuario.nome = decryptData(dadoUsuario.nome);
      dadoUsuario.senha = decryptData(dadoUsuario.senha);
      dadoUsuario.cpf = decryptData(dadoUsuario.cpf);
      dadoUsuario.telefone = decryptData(dadoUsuario.telefone);
      dadoUsuario.confirmarSenha = decryptData(dadoUsuario.confirmarSenha);

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
      // Descriptografar os dados recebidos
      dadosLogin.email = decryptData(dadosLogin.email);
      dadosLogin.senha = decryptData(dadosLogin.senha);

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

  @Get("/auth/user")
  @UseBefore(authMiddleware)
  async getUser(@Res() res: any) {
      try {
          return res.status(200).json(res.req.user);
      } catch (erro) {
          return res.status(500).json({ msg: "Erro ao buscar usuário." });
      }
  }


  @Get("/user/:id")
  @UseBefore(authMiddleware)
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
  @UseBefore(authMiddleware)
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