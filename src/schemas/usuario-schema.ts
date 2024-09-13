import { Schema, model, Document } from 'mongoose';
import { Endereco, HistoricoCompra } from '../shared/interface';
import { enderecoSchema } from './endereco-schema';
import { historicoSchema } from './historico-compras-schema';

interface UsuarioDocument extends Document {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: Endereco;
  historico: HistoricoCompra[];
}

const usuarioSchema = new Schema<UsuarioDocument>({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  cpf: { type: String, required: true },
  telefone: { type: String, required: true },
  endereco: { type: String, required: true },
  historico: [historicoSchema]
});

export const Usuario = model<UsuarioDocument>('Usuario', usuarioSchema);
