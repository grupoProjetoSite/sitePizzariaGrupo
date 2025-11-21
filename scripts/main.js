/* --- VARIÁVEIS GLOBAIS --- */
let carrinho = [];
let total = 0;
let tamanhoAtual = '';
let limiteSabores = 0;
let precoBase = 0;
let promoAtiva = ''; // Variável para guardar qual promo está rolando

// Configuração de preços e limites
const configPizza = {
    'Broto': { limite: 2, preco: 20.00 },
    'Média': { limite: 2, preco: 35.00 },
    'Gigante': { limite: 4, preco: 50.00 }
};

/* --- INICIALIZAÇÃO (Ao carregar a página) --- */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se tem promoção na URL
    const params = new URLSearchParams(window.location.search);
    promoAtiva = params.get('promo'); // Pega 'borda' ou 'broto'

    // 2. Aplica efeitos da promoção
    aplicarPromocaoVisual();

    // 3. Atualiza carrinho inicial (se tiver itens salvos futuramente)
    atualizarCarrinhoVisual();
});

function aplicarPromocaoVisual() {
    const main = document.querySelector('main');
    
    if (promoAtiva === 'borda') {
        // Cria um aviso de Borda Grátis
        let aviso = document.createElement('div');
        aviso.style.backgroundColor = '#2a9d8f';
        aviso.style.color = 'white';
        aviso.style.textAlign = 'center';
        aviso.style.padding = '15px';
        aviso.style.fontSize = '1.2em';
        aviso.style.fontWeight = 'bold';
        aviso.innerText = '🎉 PROMOÇÃO ATIVA: Todas as bordas recheadas são GRÁTIS hoje!';
        main.insertBefore(aviso, main.firstChild); // Coloca no topo do Main
    } 
    else if (promoAtiva === 'broto') {
        // Cria um aviso de BrotoDobro
        let aviso = document.createElement('div');
        aviso.style.backgroundColor = '#e63946';
        aviso.style.color = 'white';
        aviso.style.textAlign = 'center';
        aviso.style.padding = '15px';
        aviso.style.fontSize = '1.2em';
        aviso.style.fontWeight = 'bold';
        aviso.innerText = '🍕 BROTODO BRO: Na compra de 1 Broto, a 2ª é por nossa conta! (Desconto aplicado no caixa)';
        main.insertBefore(aviso, main.firstChild);
    }
}


/* --- FUNÇÕES DO MODAL --- */

function abrirCardapio(tamanho) {
    tamanhoAtual = tamanho;
    limiteSabores = configPizza[tamanho].limite;
    precoBase = configPizza[tamanho].preco;

    document.getElementById('modal-sabores').style.display = 'flex';
    document.getElementById('titulo-tamanho').innerText = 'Pizza ' + tamanho;
    document.getElementById('aviso-limite').innerText = `Selecione até ${limiteSabores} sabores`;

    limparSelecoes();
}

function fecharCardapio() {
    document.getElementById('modal-sabores').style.display = 'none';
}

function trocarAba(tipo) {
    document.getElementById('lista-salgada').classList.remove('ativo');
    document.getElementById('lista-doce').classList.remove('ativo');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('ativo'));
    
    document.getElementById('lista-' + tipo).classList.add('ativo');
    event.currentTarget.classList.add('ativo');
}

function controlarLimite(checkbox) {
    let marcados = document.querySelectorAll('input[name="sabor"]:checked');
    if (marcados.length > limiteSabores) {
        checkbox.checked = false;
        alert(`Para pizza ${tamanhoAtual}, o máximo são ${limiteSabores} sabores!`);
    }
}

function limparSelecoes() {
    document.querySelectorAll('input[name="sabor"]').forEach(cb => cb.checked = false);
    document.querySelector('input[name="borda"][value="Tradicional"]').checked = true;
    
    // Se for promoção de borda, avisa visualmente nos radios (opcional, mas legal)
    // (Lógica simplificada mantida no cálculo)
}

/* --- ADICIONAR AO CARRINHO --- */

function adicionarAoCarrinhoComposto() {
    let saboresSelecionados = [];
    document.querySelectorAll('input[name="sabor"]:checked').forEach(cb => {
        saboresSelecionados.push(cb.value);
    });

    if (saboresSelecionados.length === 0) {
        alert("Por favor, selecione pelo menos 1 sabor!");
        return;
    }

    let bordaSelecionada = document.querySelector('input[name="borda"]:checked').value;
    
    // --- LÓGICA DE PREÇO DA BORDA ---
    let precoExtra = 0;
    
    if (bordaSelecionada !== 'Tradicional') {
        // Se a promo for 'borda', o preço extra continua 0
        if (promoAtiva === 'borda') {
            precoExtra = 0; 
        } else {
            precoExtra = 5.00;
        }
    }

    let nomeItem = `Pizza ${tamanhoAtual} (${saboresSelecionados.join(', ')})`;
    if (bordaSelecionada !== 'Tradicional') {
        nomeItem += ` + Borda ${bordaSelecionada}`;
        if (promoAtiva === 'borda') nomeItem += " (GRÁTIS)";
    }

    let precoFinal = precoBase + precoExtra;

    carrinho.push({ nome: nomeItem, preco: precoFinal });

    // Verifica lógica visual do BrotoDobro no carrinho
    verificarDescontoBroto();

    atualizarCarrinhoVisual();
    fecharCardapio();
    
    // Abre o modal do carrinho para feedback
    document.getElementById('modal-carrinho-bg').classList.add('ativo');
}

// Função Extra para lidar com o "Pague 1 Leve 2" do Broto
function verificarDescontoBroto() {
    if (promoAtiva !== 'broto') return;

    // Conta quantos brotos tem no carrinho
    let brotos = carrinho.filter(item => item.nome.includes('Pizza Broto'));
    
    // A cada 2 brotos, dá o desconto de 1
    // (Essa é uma lógica simples: removemos o preço do segundo item visualmente ou damos um desconto negativo)
    // Para simplificar seu código atual, não vou criar itens negativos, vou apenas deixar o aviso.
    // Implementar lógica de "item grátis" exige mudar a estrutura do carrinho, 
    // então vamos confiar no AVISO VISUAL que coloquei no topo da página por enquanto.
}


/* --- FUNÇÕES DO CARRINHO LATERAL --- */

function atualizarCarrinhoVisual() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');
    const contagemCarrinho = document.getElementById('contagem-carrinho');
    const msgCarrinhoVazio = document.querySelector('.carrinho-vazio');

    listaCarrinho.innerHTML = '';
    total = 0;

    if (carrinho.length === 0) {
        if (msgCarrinhoVazio) msgCarrinhoVazio.style.display = 'block';
    } else {
        if (msgCarrinhoVazio) msgCarrinhoVazio.style.display = 'none';

        carrinho.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${item.nome}</strong>
                </div>
                <span>R$ ${item.preco.toFixed(2)}</span>
                <button onclick="removerItem(${index})" style="background:none;border:none;color:red;cursor:pointer;margin-left:10px;">🗑️</button>
            `;
            listaCarrinho.appendChild(li);
            total += item.preco;
        });
    }

    totalCarrinho.innerText = `R$ ${total.toFixed(2)}`;
    if (contagemCarrinho) contagemCarrinho.innerText = carrinho.length;
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinhoVisual();
}

// Abrir/Fechar Modal Carrinho
const modalBg = document.getElementById('modal-carrinho-bg');
const botaoAbrir = document.getElementById('abrir-carrinho');
const botaoFechar = document.getElementById('fechar-carrinho');

if (botaoAbrir) botaoAbrir.addEventListener('click', () => modalBg.classList.add('ativo'));
if (botaoFechar) botaoFechar.addEventListener('click', () => modalBg.classList.remove('ativo'));
if (modalBg) modalBg.addEventListener('click', (e) => { if(e.target === modalBg) modalBg.classList.remove('ativo'); });