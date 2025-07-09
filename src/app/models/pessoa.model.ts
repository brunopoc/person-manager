export interface Pessoa {
  id?: number;
  nome: string;
  cpf: string;
  sexo: 'M' | 'F' | 'Outro';
  email: string;
  telefone: string;
}
