const API_URL = 'http://localhost:3000/api/notas';

// 1. Carregar notas ao abrir
async function carregarNotas() {
    const res = await fetch(API_URL);
    const notas = await res.json();
    
    const lista = document.getElementById('listaNotas');
    lista.innerHTML = '';

    notas.reverse().forEach(nota => {
        lista.innerHTML += `
            <div class="card-nota">
                <p>${nota.texto}</p>
                <small>${nota.data}</small>
            </div>
        `;
    });
}

// 2. Salvar nota
async function salvarNota() {
    const textarea = document.getElementById('textoNota');
    const texto = textarea.value;

    if (!texto.trim()) return alert("Digite algo!");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto })
    });

    textarea.value = '';
    carregarNotas();
}

// Inicia tudo
carregarNotas();