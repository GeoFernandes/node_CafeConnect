export interface IEndereco {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}
  
export interface IItemComprado {
    nomeProduto: string;
    quantidade: number;
    preco: number;
}
  

export interface IHistoricoCompra {
    dataCompra: string;
    itensComprados: IItemComprado[];
    valorTotal: number;
}

export interface IUsuario {
    email: string;
    nome: string;
    senha: string;
    cpf: string;
    telefone: string;
    confirmarSenha: string;
    endereco?: IEndereco;
    historico: IHistoricoCompra[];
}


export interface ILogin {
    email: string,
    senha: string
}