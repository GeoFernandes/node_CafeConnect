import { Usuario } from "../schemas/usuario-schema";
import { ILogin, IUsuario } from "../shared/interface";
import { isEmailValid, validaCampos } from '../shared/validações/valida-email';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UsuarioService {
  // Busca usuário pelo e-mail
  public async acharUsuarioPeloEmail(email: string) {
    return Usuario.findOne({ email: email });
  }

  // Criação de novo usuário
  public async criarUsuario(dadoUsuario: IUsuario) {
    const senhaHash = await this.hashSenha(dadoUsuario.senha);
    
    // Criptografa dados pessoais
    const nomeHash = await this.hashDados(dadoUsuario.nome);
    const cpfHash = await this.hashDados(dadoUsuario.cpf);
    const telefoneHash = await this.hashDados(dadoUsuario.telefone);
    const enderecoHash = await this.hashDados(JSON.stringify(dadoUsuario.endereco));

    const novoUsuario = new Usuario({
      nome: nomeHash,
      email: dadoUsuario.email,
      cpf: cpfHash,
      telefone: telefoneHash,
      senha: senhaHash,
      endereco: enderecoHash,
      historico: dadoUsuario.historico || []
    });

    return novoUsuario.save();
  }

  // Validação dos dados do usuário
  public async validaDadosUsuario(dadoUsuario: IUsuario): Promise<boolean> {
    const camposValidados: boolean = validaCampos(dadoUsuario);
    const senhaValida: boolean = dadoUsuario.senha === dadoUsuario.confirmarSenha;
    const emailValido: boolean = isEmailValid(dadoUsuario.email);

    return camposValidados && emailValido && senhaValida;
  }

  // Hash da senha usando bcrypt
  private async hashSenha(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(senha, salt);
  }

  // Hash de outros dados (nome, email, CPF, etc.)
  private async hashDados(data: string): Promise<string> {
    return bcrypt.hash(data, 14);
  }

  // Valida o login do usuário
  public async verificaDadosLogin(dadosLogin: ILogin): Promise<{ msg: string, token?: string }> {
    dadosLogin.email = "anaJulia@gmail.com";
    dadosLogin.senha = "anaJulia09290";
    if (!dadosLogin.email || !dadosLogin.senha) return { msg: "E-mail e senha são obrigatórios." };

    const usuario = await this.acharUsuarioPeloEmail(dadosLogin.email);
    if (!usuario) return { msg: "Usuário não encontrado." };

    const senhaValida = await bcrypt.compare(dadosLogin.senha, usuario.senha);
    if (!senhaValida) return { msg: "Senha inválida." };

    const secret = process.env.SECRET as string;
    const token = jwt.sign({ id: usuario._id }, secret, { expiresIn: '1d' });

    return { msg: "Login realizado com sucesso.", token };
  }
}

export default new UsuarioService();
