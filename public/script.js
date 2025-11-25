const API_URL = 'http://localhost:3000/api/notas';

// 1. Carregar notas e montar o HTML
async function carregarNotas() {
    try {
        const res = await fetch(API_URL);
        const notas = await res.json();
        
        const lista = document.getElementById('listaNotas');
        lista.innerHTML = '';

        if (notas.length === 0) {
            lista.innerHTML = '<p style="text-align:center; color: #666; margin-top: 20px;">Histórico vazio.</p>';
            return;
        }

        // Reverse para mostrar a mais nova no topo
        notas.reverse().forEach(nota => {
            lista.innerHTML += `
                <div class="card-nota">
                    <div class="conteudo-nota">
                        <small>📅 ${nota.data}</small>
                        <p>${nota.texto}</p>
                    </div>
                    
                    <button class="btn-delete" onclick="deletarNota(${nota.id})" title="Apagar nota">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erro ao carregar notas:", error);
    }
}

// 2. Salvar Nota
async function salvarNota() {
    const textarea = document.getElementById('textoNota');
    const texto = textarea.value;

    if (!texto.trim()) return alert("Escreva algo antes de salvar!");

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto })
        });

        textarea.value = '';
        carregarNotas(); // Atualiza a lista imediatamente
    } catch (error) {
        alert("Erro ao salvar no servidor.");
    }
}

// 3. Deletar Nota
async function deletarNota(id) {
    const confirmacao = confirm("Tem certeza que deseja apagar esta nota?");
    
    if (confirmacao) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            carregarNotas(); // Atualiza a lista para sumir com a nota apagada
        } catch (error) {
            alert("Erro ao deletar nota.");
            console.error(error);
        }
    }
}

// Inicia o app carregando as notas
carregarNotas();