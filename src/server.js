const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const path = require('path');

const app = express();
const port = 3000;
const dbPath = path.resolve(__dirname, 'database.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Função de segurança para garantir que o arquivo existe
function garantirBancoDeDados() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, '[]');
    } else {
        const conteudo = fs.readFileSync(dbPath, 'utf-8');
        if (!conteudo.trim()) {
            fs.writeFileSync(dbPath, '[]');
        }
    }
}

// Rota GET: Ler todas as notas
app.get('/api/notas', (req, res) => {
    try {
        garantirBancoDeDados();
        const dados = fs.readFileSync(dbPath, 'utf-8');
        res.json(JSON.parse(dados));
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao ler banco de dados" });
    }
});

// Rota POST: Salvar nova nota
app.post('/api/notas', (req, res) => {
    try {
        garantirBancoDeDados();
        const notas = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        
        const novaNota = {
            id: Date.now(), // Gera um ID único numérico
            texto: req.body.texto,
            data: new Date().toLocaleString('pt-BR')
        };

        notas.push(novaNota);
        fs.writeFileSync(dbPath, JSON.stringify(notas, null, 2));
        
        res.json(novaNota);
    } catch (erro) {
        res.status(500).json({ erro: "Erro ao salvar nota" });
    }
});

// --- ROTA NOVA: DELETE (Apagar Nota) ---
app.delete('/api/notas/:id', (req, res) => {
    try {
        garantirBancoDeDados();
        let notas = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        
        const idParaDeletar = Number(req.params.id); // Converte o ID da URL para número
        
        // Filtra a lista mantendo apenas as notas que NÃO são a que queremos apagar
        const notasAtualizadas = notas.filter(nota => nota.id !== idParaDeletar);

        fs.writeFileSync(dbPath, JSON.stringify(notasAtualizadas, null, 2));
        
        res.json({ mensagem: "Nota deletada com sucesso!" });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Erro ao deletar nota" });
    }
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});