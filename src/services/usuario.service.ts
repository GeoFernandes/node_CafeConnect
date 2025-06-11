import { Usuario } from "../schemas/usuario-schema";
import { ILogin, IUsuario } from "../shared/interface";
import { isEmailValid, validaCampos } from '../shared/validações/valida-email';
import jwt from 'jsonwebtoken';
import { encrypt, decrypt } from '../shared/crypto/crypto';

class UsuarioService {
  public async acharUsuarioPeloEmail(email: string) {
    return Usuario.findOne({ email: email });
  }

  public async criarUsuario(dadoUsuario: IUsuario) {
    const senhaCripto = encrypt(dadoUsuario.senha);
    const nomeCripto = encrypt(dadoUsuario.nome);
    const cpfCripto = encrypt(dadoUsuario.cpf);
    const telefoneCripto = encrypt(dadoUsuario.telefone);

    const novoUsuario = new Usuario({
      nome: nomeCripto,
      email: dadoUsuario.email,
      cpf: cpfCripto,
      telefone: telefoneCripto,
      senha: senhaCripto,
      endereco: dadoUsuario.endereco || {},
      historico: dadoUsuario.historico || []
    });

    return novoUsuario.save();
  }

  public async validaDadosUsuario(dadoUsuario: IUsuario): Promise<boolean> {
    const camposValidados: boolean = validaCampos(dadoUsuario);
    const senhaValida: boolean = dadoUsuario.senha === dadoUsuario.confirmarSenha;
    const emailValido: boolean = isEmailValid(dadoUsuario.email);

    return camposValidados && emailValido && senhaValida;
  }

  public async verificaDadosLogin(dadosCriptografado: ILogin): Promise<{ msg: string, token?: string }> {
    let dadosLogin: ILogin = { email: "", senha: "" };
    dadosLogin.email = decrypt(dadosCriptografado.email);
    dadosLogin.senha = decrypt(dadosCriptografado.senha);

    console.log("Dados de login descriptografados:", dadosLogin);
    if (!dadosLogin.email || !dadosLogin.senha) return { msg: "E-mail e senha são obrigatórios." };

    const usuario = await this.acharUsuarioPeloEmail(dadosLogin.email);
    // Descriptografa a senha para comparar
    const senhaValida = usuario && decrypt(usuario.senha) === dadosLogin.senha;

    if (!usuario || !senhaValida) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { msg: "Credenciais inválidas." };
    }

    const carrinho = await require("../schemas/carrinho/carrinho-schema").Carrinho.findOne({ userId: usuario._id });

    const secret = process.env.SECRET as string;
    const token = jwt.sign(
      { id: usuario._id, carrinhoId: carrinho ? carrinho._id : null },
      secret,
      { expiresIn: '1d' }
    );

    return { msg: "Login realizado com sucesso.", token };
  }

  //fazer função para retornar as informações do usuário
  public async obterUsuarioPorId(id: string) {
    if (!id) throw new Error("ID do usuário não fornecido.");

    const usuario = await Usuario.findById(id, "-cpf").lean();
    if (!usuario) throw new Error("Usuário não encontrado.");

    usuario.nome = usuario.nome;
    usuario.telefone = decrypt(usuario.telefone);
    usuario.senha = decrypt(usuario.senha);

    return usuario;
  }

}

export default new UsuarioService();
