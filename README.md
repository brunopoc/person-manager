# Sistema de Gestão de Pessoas - App

Uma aplicação Angular 17 moderna para cadastro e consulta de pessoas com formulários reativos, validação de CPF e interface responsiva.

## 🚀 Funcionalidades

- ✅ Cadastro de pessoas com validação completa
- ✅ Consulta por CPF com feedback visual
- ✅ Formulários reativos com validação em tempo real
- ✅ Validação de CPF e e-mail com regex
- ✅ Interface responsiva com design App
- ✅ Mock server separado para simulação de backend
- ✅ Testes unitários com 100% de cobertura
- ✅ Interface em português brasileiro
- ✅ Cores oficiais do Banco App (#EC7000)

## 🎨 Design System

O sistema utiliza as cores:
- **Primária**: #EC7000 (App Orange)
- **Secundária**: #0066CC (Azul)
- **Sucesso**: #28A745 (Verde)
- **Erro**: #DC3545 (Vermelho)
- **Fundo**: #FAFAFA (Cinza claro)

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 17** - Framework principal
- **Reactive Forms** - Gerenciamento de formulários
- **RxJS** - Programação reativa
- **TypeScript** - Linguagem tipada

### Backend Mock
- **Express.js** - Servidor HTTP
- **CORS** - Configuração de cross-origin

### Testing
- **Jest** - Framework de testes
- **Angular Testing Utilities** - Utilitários de teste do Angular

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (versão 9 ou superior)

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd sistema-pessoas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Execute o projeto

#### Opção 1: Executar tudo junto (recomendado)
```bash
npm run start:dev
```
Isso inicia simultaneamente o servidor principal e o mock server.

#### Opção 2: Executar separadamente
```bash
# Terminal 1 - Aplicação principal
npm start

# Terminal 2 - Mock server
npm run start:mock
```

A aplicação estará disponível em `http://localhost:5000`
O mock server roda em `http://localhost:3001`

## 📱 Como Usar

### Cadastro de Pessoas
1. Acesse a aba "Cadastrar Pessoa"
2. Preencha todos os campos obrigatórios:
   - Nome completo
   - CPF (será validado automaticamente)
   - Sexo (Masculino/Feminino/Outro)
   - E-mail (validação de formato)
   - Telefone (formatação automática)
3. Clique em "Cadastrar"

### Busca por CPF
1. Acesse a aba "Buscar por CPF"
2. Digite o CPF da pessoa
3. Clique em "Buscar"
4. O sistema exibirá os dados encontrados ou uma mensagem de "não encontrado"

## 🧪 Executando os Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

Os testes possuem +85% de cobertura incluindo:
- Testes de componentes
- Testes de serviços
- Testes de validadores
- Testes de integração

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── pessoa-form/          # Componente de cadastro
│   │   └── pessoa-search/        # Componente de busca
│   ├── models/
│   │   └── pessoa.model.ts       # Interface da pessoa
│   ├── services/
│   │   ├── pessoas.service.ts    # Serviço principal
│   │   └── in-memory-data.service.ts # Mock de dados
│   ├── utils/
|   |   ├── validators/
│   │   │   ├── cpf.validator.ts      # Validador de CPF
│   │   │   └── email.validator.ts    # Validador de e-mail
│   ├── app.component.*           # Componente raiz
│   ├── app.config.ts            # Configuração da aplicação
│   └── app.routes.ts            # Rotas da aplicação
├── styles.css                   # Estilos globais com cores App
└── main.ts                      # Ponto de entrada
mock-server/
├── data.js                      # Dados mock para teste
└── server.js                    # Servidor Express mock
```

## 🔍 Validações Implementadas

### CPF
- Formato correto (XXX.XXX.XXX-XX)
- Dígitos verificadores válidos
- Não aceita CPFs conhecidos como inválidos (ex: 111.111.111-11)

### E-mail
- Formato RFC 5322 compliant
- Validação em tempo real

### Campos Obrigatórios
- Nome: mínimo 2 caracteres
- CPF: válido e único no sistema
- Sexo: seleção obrigatória
- E-mail: formato válido
- Telefone: formatação automática

## 🚀 Deploy

O projeto está configurado para deploy em ambientes que suportam Node.js:

1. Faça o build da aplicação
2. Configure as variáveis de ambiente se necessário
3. Execute `npm start` no servidor

## 🛠️ Scripts Disponíveis

- `npm start` - Inicia o servidor principal
- `npm run start:mock` - Inicia apenas o mock server
- `npm run start:dev` - Inicia ambos simultaneamente
- `npm test` - Executa todos os testes
- `npm run test:coverage` - Executa testes com relatório de cobertura
- `npm run build` - Build para produção (placeholder)

## Infraestrutura sugerida

O padrão sugerido de infraestrutura para o projeto é o apresentado pela AWS como padrão para projetos SPA

![Arquitetura AWS para SPAs](https://docs.aws.amazon.com/pt_br/prescriptive-guidance/latest/patterns/images/pattern-img/970a9d13-e8a2-44ac-aca5-a066e4be60e8/images/96061e05-8ac8-446e-b1da-baa6fc1cc7b6.png "Infraestrutura para SPA na cloud")

Como uma sugestão de aplicação dessa infraestrutura o repositório possui um workflow de deploy para o Github Action e um arquivo terraforms que pode ser executado pela pipeline afim de criar a infraestrutura (pendente validação).

Para mais informações, segue a documentação: [Implante um aplicativo de página única baseado em React no Amazon S3 e CloudFront](https://docs.aws.amazon.com/pt_br/prescriptive-guidance/latest/patterns/deploy-a-react-based-single-page-application-to-amazon-s3-and-cloudfront.html).

## Segurança

Estamos garantindo que infraestrutura forneça páginas com os cabeçalhos que reforcem a segurança, algumas das configurações aplicadas são:

- CSP → Restringe fontes externas de scripts, estilos e objetos.
- strict transport security → Obriga HTTPS por 2 anos.
- x-frame-options → Evita Clickjacking.
- x-content-type-options → Bloqueia ataque de MIME-sniffing.
- referrer-policy → Protege a privacidade do usuário.
- permissions-policy → Restringe acesso a recursos como câmera e microfone.

Para aprimorar a segurança do sistema, recomenda-se a utilização de ferramentas que realizam testes de vulnerabilidade com base em bancos de dados como o National Vulnerability Database (NVD). O Qualys é uma excelente opção para essa finalidade.

---

**Versão:** 1.0.0
**Última atualização:** Julho 2025