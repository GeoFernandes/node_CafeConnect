import { Post, Body, HttpCode, Controller, Res, Get, Params, UseBefore, Delete, JsonController, Put } from 'routing-controllers';
import { ILogin, IUsuario } from '../../shared/interface';
import UsuarioService from '../../services/usuario.service';
import { Usuario } from '../../schemas/usuario-schema';
import mongoose from 'mongoose';
import authMiddleware from '../../autenticacao/auth.middleware';
import { OpenAPI } from 'routing-controllers-openapi';
import { decrypt } from '../../shared/crypto/crypto';
import usuarioService from '../../services/usuario.service';

const SECRET_KEY = 'default-secret-key'; //Ajustar depois

@Controller()
@JsonController()
class UsuarioController {

  @Post("/auth/register")
  @HttpCode(201)
  @OpenAPI({ summary: 'Registra um novo usuário', description: 'Cria um novo usuário com os dados fornecidos' })
  async registroDeUsuario(@Body() dadoUsuario: IUsuario, @Res() res: any): Promise<any> {
    try {
      dadoUsuario.email = decrypt(dadoUsuario.email);
      dadoUsuario.nome = decrypt(dadoUsuario.nome);
      dadoUsuario.senha = decrypt(dadoUsuario.senha);
      dadoUsuario.cpf = decrypt(dadoUsuario.cpf);
      dadoUsuario.telefone = decrypt(dadoUsuario.telefone);
      dadoUsuario.confirmarSenha = decrypt(dadoUsuario.confirmarSenha);

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

  @Put("/auth/user")
  @OpenAPI({ 
    summary: 'Atualiza informações do usuário', 
    description: 'Permite que o usuário logado atualize suas informações pessoais' 
  })
  async atualizaUsuario(@Body() dadosAtualizados: Partial<IUsuario>, @Res() res: any): Promise<any> {
    try {
      const userId = res.req.user._id; // Obtém o ID do usuário autenticado do middleware
      console.log("ID do usuário autenticado:", userId);
      console.log("Dados recebidos para atualização:", dadosAtualizados);

      console.log("Dados recebidos para atualização:", dadosAtualizados);
      console.log("ID do usuário autenticado:", userId);
      // Atualizar o usuário no banco de dados diretamente
      const usuarioAtualizado = await Usuario.findByIdAndUpdate(
        userId,
        { $set: dadosAtualizados }, // Atualiza diretamente os dados fornecidos
        { new: true, runValidators: true, select: "-senha" } // Retorna o documento atualizado sem a senha
      );

      if (!usuarioAtualizado) {
        return res.status(404).json({ msg: "Usuário não encontrado." });
      }

      return res.status(200).json({ msg: "Informações atualizadas com sucesso.", usuario: usuarioAtualizado });
    } catch (erro) {
      console.error("Erro ao atualizar informações do usuário:", erro);
      return res.status(500).json({ msg: "Erro ao atualizar informações do usuário." });
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
      const usuario = await usuarioService.obterUsuarioPorId(id);

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