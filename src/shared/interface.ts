export interface Endereco {
    rua: string;
    numero: string;
    complemento?: string
    cidade: string;
    estado: string;
    cep: string;
}
  
export interface ItemComprado {
    nomeProduto: string;
    quantidade: number;
    preco: number;
}
  

export interface HistoricoCompra {
    dataCompra: string;
    itensComprados: ItemComprado[];
    valorTotal: number;
}

export interface IUsuario {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    senha: string;
    confirmarSenha: string;
    endereco: Endereco;
    historico: HistoricoCompra[];
}