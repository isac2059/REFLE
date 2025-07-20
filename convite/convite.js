
window.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('musicaFundo');
    if (audio) {
        audio.volume = 0.5; // ajuste o volume se quiser
        audio.play().catch(() => {
            // Alguns navegadores só permitem play após interação do usuário
        });
    }
});




const cards = document.querySelectorAll('.card');
const convite = document.getElementById('convite');
const titulo = document.querySelector('.container h1'); // Seleciona o título

cards.forEach(card => {
    card.onclick = function() {
        if (card.dataset.correct === "true") {
            document.querySelector('.cards').style.display = 'none';
            titulo.style.display = 'none';

            // Mostra mensagem de parabéns
            const msg = document.createElement('div');
            msg.id = 'msgDesafio';
            msg.innerHTML = `<h2>Parabéns, você acertou o primeiro desafio! 🎉</h2>`;
            document.querySelector('.container').appendChild(msg);

            setTimeout(() => {
                msg.remove();
                criarJogoDaVelha();
            }, 2000);
        } else {
            card.style.background = "#f8d7da";
            card.style.color = "#721c24";
            // Troca o emoji por uma imagem
            card.innerHTML = `<img src="errou-removebg-preview.png" alt="Errou" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">`;
        }
    }
});
document.getElementById('instagramBtn').onclick = function() {
    window.open('https://instagram.com/seu_usuario', '_blank');
}

        // Esconde convite e jogos no início
document.getElementById('convite').style.display = 'none';

function criarJogoDaVelha() {
    const velhaDiv = document.createElement('div');
    velhaDiv.id = 'jogoDaVelha';
    velhaDiv.innerHTML = `
        <h2>Jogo da Velha</h2>
        <div id="tabuleiro">
            ${'<button class="casa"></button>'.repeat(9)}
        </div>
        <p id="statusVelha">Sua vez (X)</p>
    `;
    document.querySelector('.container').appendChild(velhaDiv);

    let vez = 'X';
    let casas = velhaDiv.querySelectorAll('.casa');
    let status = velhaDiv.querySelector('#statusVelha');
    let fim = false;

    casas.forEach((casa, i) => {
        casa.onclick = function() {
            if (fim || casa.textContent !== '' || vez !== 'X') return;
            casa.textContent = 'X';
            if (checarVitoria('X')) {
                status.textContent = `Você venceu!`;
                fim = true;
                setTimeout(() => {
                    velhaDiv.remove();
                    // Mostra mensagem do segundo desafio
                    const msg2 = document.createElement('div');
                    msg2.id = 'msgDesafio2';
                    msg2.innerHTML = `<h2>Parabéns, você acertou o segundo desafio! 🎉</h2>`;
                    document.querySelector('.container').appendChild(msg2);
                    setTimeout(() => {
                        msg2.remove();
                        criarPedraPapelTesoura();
                    }, 2000);
                }, 1200);
            } else if (empate()) {
                status.textContent = `Deu velha!`;
                fim = true;
                setTimeout(() => {
                    velhaDiv.remove();
                    criarPedraPapelTesoura();
                }, 1200);
            } else {
                vez = 'O';
                status.textContent = "Vez do bot (O)";
                setTimeout(jogadaBot, 600);
            }
        }
    });

    function jogadaBot() {
        if (fim) return;
        let livres = Array.from(casas).filter(c => c.textContent === '');
        if (livres.length) {
            let botCasa = livres[Math.floor(Math.random() * livres.length)];
            botCasa.textContent = 'O';
            if (checarVitoria('O')) {
                status.textContent = `O bot venceu!`;
                fim = true;
                setTimeout(() => {
                    velhaDiv.remove();
                    criarJogoDaVelha();
                }, 1200);
            } else if (empate()) {
                status.textContent = `Deu velha!`;
                fim = true;
                setTimeout(() => {
                    velhaDiv.remove();
                    criarPedraPapelTesoura();
                }, 1200);
            } else {
                vez = 'X';
                status.textContent = "Sua vez (X)";
            }
        }
    }

    function checarVitoria(simbolo) {
    const linhas = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    for (const l of linhas) {
        if (
            casas[l[0]].textContent === simbolo &&
            casas[l[1]].textContent === simbolo &&
            casas[l[2]].textContent === simbolo
        ) {
            // Destaca a linha vencedora
            casas[l[0]].classList.add('vitoria');
            casas[l[1]].classList.add('vitoria');
            casas[l[2]].classList.add('vitoria');
            return true;
        }
    }
    return false;
}

    function empate() {
        return Array.from(casas).every(c => c.textContent !== '') && !checarVitoria('X') && !checarVitoria('O');
    }
}

    // ...restante da função...



function criarPedraPapelTesoura() {
    let playerScore = 0;
    let botScore = 0;
    const pptDiv = document.createElement('div');
    pptDiv.id = 'ppt';
    pptDiv.innerHTML = `
        <h2>Pedra, Papel ou Tesoura</h2>
        <div style="margin-bottom:10px;">
            <button class="ppt" data-move="pedra">🪨 Pedra</button>
            <button class="ppt" data-move="papel">📄 Papel</button>
            <button class="ppt" data-move="tesoura">✂️ Tesoura</button>
        </div>
        <div id="placarPPT" style="font-weight:bold;margin-bottom:10px;">Você: 0 | Bot: 0</div>
        <div id="escolhasPPT" style="margin-bottom:10px;"></div>
        <p id="statusPPT"></p>
    `;
    document.querySelector('.container').appendChild(pptDiv);

    const opcoes = [
        { nome: 'pedra', emoji: '🪨' },
        { nome: 'papel', emoji: '📄' },
        { nome: 'tesoura', emoji: '✂️' }
    ];

    pptDiv.querySelectorAll('.ppt').forEach(btn => {
        btn.onclick = function() {
            let player = btn.dataset.move;
            let botObj = opcoes[Math.floor(Math.random()*3)];
            let bot = botObj.nome;
            let status = pptDiv.querySelector('#statusPPT');
            let escolhas = pptDiv.querySelector('#escolhasPPT');
            escolhas.innerHTML = `Você: ${opcoes.find(o=>o.nome===player).emoji} &nbsp;&nbsp; Bot: ${botObj.emoji}`;

            if (
                (player === 'pedra' && bot === 'tesoura') ||
                (player === 'papel' && bot === 'pedra') ||
                (player === 'tesoura' && bot === 'papel')
            ) {
                playerScore++;
                status.textContent = `Você ganhou esta rodada!`;
            } else if (player === bot) {
                status.textContent = `Empate! Tente de novo.`;
            } else {
                botScore++;
                status.textContent = `O bot ganhou esta rodada!`;
            }

            pptDiv.querySelector('#placarPPT').textContent = `Você: ${playerScore} | Bot: ${botScore}`;

            // Avança só se o jogador ganhar 2 vezes
            
            if (
    (player === 'pedra' && bot === 'tesoura') ||
    (player === 'papel' && bot === 'pedra') ||
    (player === 'tesoura' && bot === 'papel')
) {
    status.textContent = `Você venceu o desafio!`;
    setTimeout(() => {
        pptDiv.remove();
        mostrarConvite();
    }, 1200);
} else if (player === bot) {
    status.textContent = `Empate! Tente de novo.`;
} else {
    status.textContent = `O bot venceu! Tente novamente.`;
    setTimeout(() => {
        pptDiv.remove();
        criarPedraPapelTesoura();
    }, 1200);
}
        }
    });
}


function mostrarConvite() {
    const convite = document.getElementById('convite');
    const surpresa = document.getElementById('surpresa');
    const imgAndando = document.getElementById('imgAndando');
    const textoSurpresa = document.getElementById('textoSurpresa');
    const abrirConvite = document.getElementById('abrirConvite');

    // Cria o botão "Ler" se ainda não existe
    let lerBtn = document.getElementById('lerConvite');
    if (!lerBtn) {
        lerBtn = document.createElement('button');
        lerBtn.id = 'lerConvite';
        lerBtn.textContent = 'Ler';
        lerBtn.style.display = 'none';
        lerBtn.style.marginLeft = '12px';
        surpresa.appendChild(lerBtn);
    }

    convite.innerHTML = `<h2>Parabéns, Você perdeu seu tempo! 😅</h2>`;
    convite.style.display = 'block';
    surpresa.style.display = 'none';

    setTimeout(() => {
        convite.style.display = 'none';
        surpresa.style.display = 'block';
        imgAndando.style.left = '-300px';
        textoSurpresa.style.display = 'none';
        abrirConvite.style.display = 'none';
        lerBtn.style.display = 'none';

        function trocarParaSegundaImagem() {
            imgAndando.src = 'Captura de tela 2025-07-20 144128.png';
            imgAndando.removeEventListener('transitionend', trocarParaSegundaImagem);

            setTimeout(() => {
                imgAndando.src = 'cartaazul.jpg';
                abrirConvite.style.display = 'inline-block';
                textoSurpresa.style.display = 'block';
            }, 4000);
        }
        imgAndando.addEventListener('transitionend', trocarParaSegundaImagem);

        setTimeout(() => {
            imgAndando.style.left = '0px';
        }, 200);
    }, 3000);

    abrirConvite.onclick = function() {
        // Troca para a quarta imagem e mostra o botão "Ler"
        imgAndando.src = 'cartaazul2.jpg'; // Troque pelo nome da quarta imagem
        abrirConvite.style.display = 'none';
        lerBtn.style.display = 'inline-block';
        textoSurpresa.textContent = 'ler';
    };
lerBtn.onclick = function() {
    // Troca para a quinta imagem e mostra apenas o botão Instagram
    imgAndando.src = 'cartafinal.jpg'; // Troque pelo nome da quinta imagem
    textoSurpresa.style.display = 'none';
    lerBtn.style.display = 'none';

    // Remove texto anterior se existir
    let textoFinal = document.getElementById('textoFinal');
    if (textoFinal) textoFinal.remove();

    // Cria o texto sobre a imagem
    textoFinal = document.createElement('div');
    textoFinal.id = 'textoFinal';
    textoFinal.textContent = 'Vamos ao cinema?';
    textoFinal.style.position = 'absolute';
    textoFinal.style.top = '50%';
    textoFinal.style.left = '50%';
    textoFinal.style.transform = 'translate(-50%, -50%)';
    textoFinal.style.fontSize = '2em';
    textoFinal.style.fontWeight = 'bold';
    textoFinal.style.color = '#fff';
    textoFinal.style.textShadow = '2px 2px 8px #000';
    textoFinal.style.pointerEvents = 'none';
    textoFinal.style.zIndex = '5';
    surpresa.appendChild(textoFinal);

    // Remove conviteBox se existir
    let conviteBox = document.getElementById('conviteBox');
    if (conviteBox) conviteBox.remove();

    // Cria só o botão do Instagram, posicionado embaixo da imagem
    let instaBtn = document.getElementById('instagramBtnFinal');
    if (!instaBtn) {
        instaBtn = document.createElement('button');
        instaBtn.id = 'instagramBtnFinal';
        instaBtn.textContent = 'Responder  🍿';
        instaBtn.style.background = '#43c6ac';
        instaBtn.style.color = '#fff';
        instaBtn.style.border = 'none';
        instaBtn.style.padding = '14px 32px';
        instaBtn.style.borderRadius = '8px';
        instaBtn.style.fontSize = '1.1em';
        instaBtn.style.cursor = 'pointer';
        instaBtn.style.marginTop = '18px';
        // Remova as linhas de position absolute para ficar embaixo da imagem
        surpresa.appendChild(instaBtn);
    } else {
        instaBtn.style.display = 'inline-block';
    }

    instaBtn.onclick = function() {
        window.open('https://www.instagram.com/isac.svlx?igsh=MXhiN3cwcTY4azU4YQ==', '_blank');
    };
};

}