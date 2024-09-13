import { Post, Body, HttpCode, Controller, Res } from 'routing-controllers';
import { Response } from 'express';

import { IUsuario } from '../../shared/interface';
import UsuarioService from '../../services/usuario.service';

@Controller()
class UsuarioController {

  @Post("/auth/register")
  @HttpCode(201)
  async registroDeUsuario(@Body() dadoUsuario: IUsuario): Promise<{ msg: string, objeto?: any }> {
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
      const dadoUsuarioValido = await UsuarioService.validaDadosUsuario(dadoUsuario);
      if (!dadoUsuarioValido) return { msg: "Preencha todos os campos obrigatórios." };

      const userExists = await UsuarioService.acharUsuarioPeloEmail(dadoUsuario.email);
      if (userExists) return { msg: "E-mail já registrado na base de dados" };

      const teste = await UsuarioService.criarUsuario(dadoUsuario);

      return { msg: "Usuário criado com sucesso!" };
    } catch (erro) {
      console.log(erro);
      return { msg: "Aconteceu um erro no servidor, por favor tente mais tarde!" };
    }
  }

  // @Post("/auth/login")
  // async simpleEndpoint(@Body() body: any, @Res() res: Response): Promise<any> {
  //   return res.status(200).json({ msg: "Corpo recebido!", body });
  // }

  // @Post("/informacoes")
  // @HttpCode(200)
  // informacoesDoUsuario(@Body() body: any) {
  //   return { msg: "Informações do usuário" };
  // }
}

export default UsuarioController;
