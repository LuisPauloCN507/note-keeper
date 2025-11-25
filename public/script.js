const API_URL = 'http://localhost:3000/api/notas';

async function carregarNotas() {
    const res = await fetch(API_URL);
    const notas = await res.json();
    
    const lista = document.getElementById('listaNotas');
    lista.innerHTML = '';

    // Mostra a mais recente no topo
    notas.reverse().forEach(nota => {
        lista.innerHTML += `
            <div class="card-nota">
                <small>📅 ${nota.data}</small>
                <p>${nota.texto}</p>
            </div>
        `;
    });
}

async function salvarNota() {
    const textarea = document.getElementById('textoNota');
    const texto = textarea.value;

    if (!texto.trim()) return alert("Por favor, escreva algo!");

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto })
    });

    textarea.value = '';
    carregarNotas();
}

// Iniciar
carregarNotas();