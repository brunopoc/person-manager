const express = require('express');
const cors = require('cors');
const { pessoas } = require('./data');

const app = express();
const PORT = 3000;

// Middleware CORS mais específico para resolver conexão
app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000', 'http://0.0.0.0:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

app.use(express.json());

let pessoasDB = [...pessoas];
let nextId = Math.max(...pessoasDB.map(p => p.id)) + 1;

app.get('/api/pessoas', (req, res) => {
  const { cpf } = req.query;
  
  if (cpf) {
    const pessoa = pessoasDB.find(p => p.cpf === cpf);
    if (pessoa) {
      res.json([pessoa]); 
    } else {
      res.json([]);
    }
  } else {
    res.json(pessoasDB);
  }
});

app.get('/api/pessoas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pessoa = pessoasDB.find(p => p.id === id);
  
  if (pessoa) {
    res.json(pessoa);
  } else {
    res.status(404).json({ error: 'Pessoa não encontrada' });
  }
});

app.post('/api/pessoas', (req, res) => {
  const { nome, cpf, sexo, email, telefone } = req.body;
  
  if (!nome || !cpf || !sexo || !email || !telefone) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  const cpfExists = pessoasDB.some(p => p.cpf === cpf);
  if (cpfExists) {
    return res.status(400).json({ error: 'CPF já cadastrado' });
  }
  
  const novaPessoa = {
    id: nextId++,
    nome,
    cpf,
    sexo,
    email,
    telefone
  };
  
  pessoasDB.push(novaPessoa);
  res.status(201).json(novaPessoa);
});

app.put('/api/pessoas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pessoaIndex = pessoasDB.findIndex(p => p.id === id);
  
  if (pessoaIndex === -1) {
    return res.status(404).json({ error: 'Pessoa não encontrada' });
  }
  
  const { nome, cpf, sexo, email, telefone } = req.body;
  
  const cpfExists = pessoasDB.some(p => p.cpf === cpf && p.id !== id);
  if (cpfExists) {
    return res.status(400).json({ error: 'CPF já cadastrado por outra pessoa' });
  }
  
  pessoasDB[pessoaIndex] = {
    ...pessoasDB[pessoaIndex],
    nome,
    cpf,
    sexo,
    email,
    telefone
  };
  
  res.json(pessoasDB[pessoaIndex]);
});

app.delete('/api/pessoas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const pessoaIndex = pessoasDB.findIndex(p => p.id === id);
  
  if (pessoaIndex === -1) {
    return res.status(404).json({ error: 'Pessoa não encontrada' });
  }
  
  const pessoa = pessoasDB[pessoaIndex];
  pessoasDB.splice(pessoaIndex, 1);
  res.json(pessoa);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

app.listen(PORT, () => {
  console.log(`Mock server rodando em http://localhost:${PORT}`);
  console.log(`CORS configurado para aceitar requests de: http://localhost:5000`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  GET    /api/pessoas - Listar todas as pessoas`);
  console.log(`  GET    /api/pessoas?cpf=123 - Buscar por CPF`);
  console.log(`  GET    /api/pessoas/:id - Buscar por ID`);
  console.log(`  POST   /api/pessoas - Criar nova pessoa`);
  console.log(`  PUT    /api/pessoas/:id - Atualizar pessoa`);
  console.log(`  DELETE /api/pessoas/:id - Deletar pessoa`);
});