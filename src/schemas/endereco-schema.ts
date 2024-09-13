import { Schema } from 'mongoose';

export const enderecoSchema = new Schema({
  rua: { type: String, required: true },
  numero: { type: String, required: true },
  complemento: { type: String, required: false },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
  cep: { type: String, required: true },
});
