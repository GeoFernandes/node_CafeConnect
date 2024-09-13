import { Usuario } from "../schemas/usuario-schema";
import { IUsuario } from "../shared/interface";
import { isEmailValid, validaCampos } from '../shared/validações/valida-email';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuairo = require('../schemas/usuario-schema');

class UsuarioService {

  public async acharUsuarioPeloEmail(email: string) {
    return Usuario.findOne({ email });
  }


  public async criarUsuario(dadoUsuario: IUsuario) {
    const senhaHash = this.hashSenha(dadoUsuario.senha);

    const nomeHash = await this.hashDados(dadoUsuario.nome);
    const emailHash = await this.hashDados(dadoUsuario.email);
    const cpfHash = await this.hashDados(dadoUsuario.cpf);
    const telefoneHash = await this.hashDados(dadoUsuario.telefone);
    const enderecoHash = await this.hashDados(JSON.stringify(dadoUsuario.endereco));

    const novoUsuario = new Usuario({
      nome: nomeHash,
      email: emailHash,
      cpf: cpfHash,
      telefone: telefoneHash,
      senha: senhaHash,
      endereco: enderecoHash,
      historico: dadoUsuario.historico || []
    });

    const usuario = new Usuario(novoUsuario);
    return usuario.save();
  }

  public async validaDadosUsuario(dadoUsuario: IUsuario) {
   const camposValidados: boolean = validaCampos(dadoUsuario);
   const senhaValida: boolean = dadoUsuario.senha == dadoUsuario.confirmarSenha;
   const emailValido: boolean = isEmailValid(dadoUsuario.email);
  
    return camposValidados && emailValido && senhaValida;
  }

  private async hashSenha(senha: string): Promise<string> {
    const incrementoSenha = await bcrypt.genSalt(12);
    return bcrypt.hash(senha, incrementoSenha);
  }

  private async hashDados(data: string): Promise<string> {
    return bcrypt.hash(data, 14);
  }

}

export default new UsuarioService();
