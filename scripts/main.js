/* --- LÓGICA DO CARDÁPIO (POP-UP) --- */

// 1. Função para abrir o modal
// Ela recebe o tamanho (ex: 'Broto') para escrever no título
function abrirCardapio(tamanho) {
    // Mostra o modal mudando o display para 'flex'
    let modal = document.getElementById('modal-sabores');
    modal.style.display = 'flex';

    // Atualiza o título com o tamanho escolhido
    let titulo = document.getElementById('titulo-tamanho');
    titulo.innerText = 'Sabores - Pizza ' + tamanho;
}

// 2. Função para fechar o modal
function fecharCardapio() {
    document.getElementById('modal-sabores').style.display = 'none';
}

// 3. Função para trocar entre abas (Salgada / Doce)
function trocarAba(tipo) {
    // ESCONDER TUDO:
    // Remove a classe 'ativo' das duas listas para sumirem
    document.getElementById('lista-salgada').classList.remove('ativo');
    document.getElementById('lista-doce').classList.remove('ativo');

    // DESMARCAR BOTÕES:
    // Tira a cor vermelha (classe 'ativo') de todos os botões
    let botoes = document.querySelectorAll('.tab-btn');
    botoes.forEach(function(botao) {
        botao.classList.remove('ativo');
    });

    // MOSTRAR O ESCOLHIDO:
    // Adiciona 'ativo' na lista que a gente quer ver (tipo = 'salgada' ou 'doce')
    document.getElementById('lista-' + tipo).classList.add('ativo');

    // MARCAR O BOTÃO CLICADO:
    // Pega o botão que foi clicado e deixa ele vermelho
    event.currentTarget.classList.add('ativo');
}