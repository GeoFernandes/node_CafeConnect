import { Usuario } from "../schemas/usuario-schema";
import { ILogin, IUsuario } from "../shared/interface";
import { isEmailValid, validaCampos } from '../shared/validações/valida-email';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UsuarioService {
  public async acharUsuarioPeloEmail(email: string) {
    return Usuario.findOne({ email: email });
  }

  public async criarUsuario(dadoUsuario: IUsuario) {
    const senhaHash = await this.hashSenha(dadoUsuario.senha);
    
    const nomeHash = await this.hashDados(dadoUsuario.nome);
    const cpfHash = await this.hashDados(dadoUsuario.cpf);
    const telefoneHash = await this.hashDados(dadoUsuario.telefone);

    const novoUsuario = new Usuario({
      nome: nomeHash,
      email: dadoUsuario.email,
      cpf: cpfHash,
      telefone: telefoneHash,
      senha: senhaHash,
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

  private async hashSenha(senha: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(senha, salt);
  }

  private async hashDados(data: string): Promise<string> {
    return bcrypt.hash(data, 14);
  }

  public async verificaDadosLogin(dadosLogin: ILogin): Promise<{ msg: string, token?: string }> {
    if (!dadosLogin.email || !dadosLogin.senha) return { msg: "E-mail e senha são obrigatórios." };

    const usuario = await this.acharUsuarioPeloEmail(dadosLogin.email);
    const senhaValida = usuario ? await bcrypt.compare(dadosLogin.senha, usuario.senha) : false;

    if (!usuario || !senhaValida) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { msg: "E-mail ou senha incorretos." };
    }

    const secret = process.env.SECRET as string;
    const token = jwt.sign({ id: usuario._id }, secret, { expiresIn: '1d' });

    return { msg: "Login realizado com sucesso.", token };
  }
}

export default new UsuarioService();
