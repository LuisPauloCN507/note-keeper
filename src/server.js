const express = require('express');
const cors = require('cors');
const fs = require('fs'); // File System (para ler/escrever arquivos)
const path = require('path');

const app = express();
const port = 3000;
const dbPath = path.join(__dirname, 'database.json');

// Configurações
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve o site automaticamente

// Rota: Pegar notas salvas
app.get('/api/notas', (req, res) => {
    const dados = fs.readFileSync(dbPath);
    const notas = JSON.parse(dados);
    res.json(notas);
});

// Rota: Salvar nova nota
app.post('/api/notas', (req, res) => {
    const dados = fs.readFileSync(dbPath);
    const notas = JSON.parse(dados);
    
    const novaNota = {
        id: Date.now(),
        texto: req.body.texto,
        data: new Date().toLocaleString('pt-BR')
    };

    notas.push(novaNota);
    fs.writeFileSync(dbPath, JSON.stringify(notas, null, 2)); // Salva no arquivo
    
    res.json(novaNota);
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});