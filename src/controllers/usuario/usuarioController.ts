import { Post, Body, HttpCode, Controller, Res, Get, Params, UseBefore } from 'routing-controllers';
import { Response } from 'express';

import { ILogin, IUsuario } from '../../shared/interface';
import UsuarioService from '../../services/usuario.service';
import { Usuario } from '../../schemas/usuario-schema';
import mongoose from 'mongoose';
import { verificaToken } from '../../autenticacao/auth.middleware';

@Controller()
class UsuarioController {

  @Post("/auth/register")
  @HttpCode(201)
  async registroDeUsuario(@Body() dadoUsuario: IUsuario): Promise<{ msg: string, objeto?: any }> {
    console.log("dadoUsuario", dadoUsuario)
    dadoUsuario = {
      nome: "Ana",
      email: "anaJulia@gmail.com",
      cpf: "32174561092",
      telefone: "(11) 96102-9294",
      senha: "anaJulia09290",
      confirmarSenha: "anaJulia09290",
      endereco: {
          rua: "Rua Silva Bueno",
          numero: "1000",
          complemento: "",
          cidade: "São Paulo",
          estado: "São Paulo",
          cep: "014120-010"
      },
      historico: [
          {
              dataCompra: "2024-09-20",
              itensComprados: [
                  {
                      nomeProduto: "Cafeteira Dolce Gusto",
                      quantidade: 1,
                      preco: 300
                  }
              ],
              valorTotal: 320
          }
      ]
  };

  try {
    // Validação dos dados do usuário
    const dadosValidos = await UsuarioService.validaDadosUsuario(dadoUsuario);
    if (!dadosValidos) return { msg: "Preencha todos os campos obrigatórios corretamente." };

    // Verifica se o e-mail já está registrado
    const userExists = await UsuarioService.acharUsuarioPeloEmail(dadoUsuario.email);
    if (userExists) return { msg: "E-mail já registrado na base de dados." };

    // Criação do novo usuário
    await UsuarioService.criarUsuario(dadoUsuario);

    return { msg: "Usuário criado com sucesso!" };
  } catch (erro) {
    console.error("Erro ao criar usuário:", erro);
    return { msg: "Erro no servidor. Tente mais tarde." };
  }
  }

  @Post("/auth/login")
  @HttpCode(200)
  async loginDoUsuario(@Body() dadosLogin: ILogin): Promise<{ msg: string, token?: string }> {
    try {
      const resultado = await UsuarioService.verificaDadosLogin(dadosLogin);
      return resultado;
    } catch (erro) {
      console.error("Erro no login:", erro);
      return { msg: "Erro no servidor. Tente mais tarde." };
    }
  }

  @Get("/user/:id")
  @UseBefore(verificaToken)
  async informacoesUsuario(@Params() idUsuario: string): Promise<{ msg: string, usuario?: any }> {
    idUsuario = '66e70b722c7188e72d582b91'
    if (!mongoose.Types.ObjectId.isValid(idUsuario)) {
      return { msg: "ID inválido." };
    }

    try {
      const usuario = await Usuario.findById(idUsuario, '-senha');
      if (!usuario) {
        return { msg: "Usuário não encontrado." };
      }
      return { msg: "Usuário encontrado.", usuario };
    } catch (erro) {
      return { msg: "Erro ao buscar o usuário." };
    }
  }

}

export default UsuarioController;
