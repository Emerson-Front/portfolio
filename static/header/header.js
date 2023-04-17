// Criar o elemento header
const header = document.createElement("header");

// Adicionar conteúdo ao header
header.innerHTML = `

<div class="box">
    <div class="logo"><a href="/"><img class="icon" src="/imagens/icons/meu_icone.png"> Emerson</a></div>

    <nav>
        <ul>
            <li><a href="/">Início</a></li>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#projetos">Projetos</a></li>
            <li><a href="#">Contato</a></li>
        </ul>
    </nav>
</div>


`;

// Adicionar classe ao header pode ser usado no css pra estilizar
header.classList.add("style-header");

// Adicionar o header dentro do body
document.body.appendChild(header);