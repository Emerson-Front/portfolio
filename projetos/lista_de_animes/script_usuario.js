// Função para extrair o ID do usuário da URL
function getUsuarioIdFromURL() {
  var parametros = new URLSearchParams(window.location.search);
  return parametros.get('id');
}









// FUNÇÕES DE DADOS PERSISTENTES LOCAL STORAGE -->

// Função para carregar os dados armazenados no Local Storage com base no ID do usuário
function carregarDados(idUsuario) {
  // Obtém os dados armazenados no Local Storage usando a chave 'animes_{idUsuario}'
  var dadosArmazenados = localStorage.getItem('animes_' + idUsuario);

  // Se houver dados armazenados, parseie e atribua ao array 'animes'
  if (dadosArmazenados) {
    animes = JSON.parse(dadosArmazenados);
  }
}

// Função para salvar os dados no Local Storage com base no ID do usuário
function salvarDados(idUsuario) {
  // Armazena os dados no Local Storage usando a chave 'animes_{idUsuario}'
  localStorage.setItem('animes_' + idUsuario, JSON.stringify(animes));
}

// Array para armazenar os dados dos animes
var animes = [];

// Obtém o ID do usuário da URL
var usuarioId = getUsuarioIdFromURL();

// Carrega os dados do Local Storage com base no ID do usuário
carregarDados(usuarioId);

// Função para marcar um anime como não alterado e salvar os dados
function salvarAnime(index) {
  // Define a propriedade 'alterado' do anime como false
  animes[index].alterado = false;

  // Salva os dados atualizados no Local Storage
  salvarDados(usuarioId);

  // Atualiza a exibição dos animes na página
  exibirAnimes();
}

// <-- FUNÇÕES DE DADOS PERSISTENTES LOCAL STORAGE








// FUNÇÕES DA LISTA DE ANIMES -->

function criarBarras() {
  var nomeAnime = document.getElementById("nomeAnime").value.trim();

  if (nomeAnime !== '') {
    if (!animeJaExiste(nomeAnime)) {
      var novoAnime = {
        nome: nomeAnime,
        temporada: 1,
        episodio: 1,
        alterado: false
      };

      animes.push(novoAnime);
      animes.sort(function (a, b) {
        return a.nome.localeCompare(b.nome);
      });
      salvarDados();
      exibirAnimes();

      // Limpar o valor da caixa de texto
      document.getElementById("nomeAnime").value = '';
    } else {
      alert('O anime "' + nomeAnime + '" já está na lista.');
    }
  }
}
document.getElementById("nomeAnime").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    criarBarras();
  }
});


// Função para verificar se o anime já existe
function animeJaExiste(nome) {
  for (var i = 0; i < animes.length; i++) {
    if (animes[i].nome === nome) {
      return true;
    }
  }
  return false;
}

// Função para exibir os animes em ordem alfabética
function exibirAnimes() {
  var container = document.getElementById("container");
  container.innerHTML = "";

  for (var i = 0; i < animes.length; i++) {
    var anime = animes[i];
    var li = document.createElement("li");
    li.innerHTML = '<a href="#">' + anime.nome + '</a>' +
      '<div class="barra">' +
      '<p>Temporada:<span class="temporada">' + anime.temporada + '</span></p>' +
      '<button onclick="alterarTemporada(' + i + ', -1)">-</button>' +
      '<button onclick="alterarTemporada(' + i + ', 1)">+</button>' +
      '</div>' +
      '<div class="barra">' +
      '<p>Ep:<span class="episodio">' + anime.episodio + '</span></p>' +
      '<button onclick="alterarEpisodio(' + i + ', -1)">-</button>' +
      '<button onclick="alterarEpisodio(' + i + ', 1)">+</button>' +
      '</div>' +
      '<button id="salvarBtn-' + i + '" class="salveBtn" style="display: ' + (anime.alterado ? 'block' : 'none') + ';" onclick="salvarAnime(' + i + ')">\u21B5</button>' +
      '<button class="deleteBtn" onclick="removerAnime(' + i + ')">×</button>';

    container.appendChild(li);
  }
}

function alterarTemporada(index, incremento) {
  if (animes[index].temporada + incremento >= 0) {
    animes[index].temporada += incremento;
    animes[index].alterado = true;
    salvarDados();
    exibirAnimes();
  }
}

function alterarEpisodio(index, incremento) {
  if (animes[index].episodio + incremento >= 0) {
    animes[index].episodio += incremento;
    animes[index].alterado = true;
    salvarDados();
    exibirAnimes();
  }
}

function removerAnime(index) {
  var confirmacao = confirm("Tem certeza que deseja excluir este anime?");

  if (confirmacao) {
    animes.splice(index, 1);
    salvarDados(usuarioId);
    exibirAnimes();
  }
}


// Chame a função exibirAnimes para mostrar os dados iniciais (se houver)
exibirAnimes();

// <-- FUNÇÕES DA LISTA DE ANIMES










// FUNÇÃO DE DOWNLOAD E UPLOAD -->

// Função para fazer o download do arquivo .json, onde tem os dados salvos
function salvarArquivo() {
  var animesSalvos = JSON.parse(localStorage.getItem('animes_' + usuarioId)) || [];
  var data = JSON.stringify(animesSalvos);

  var blob = new Blob([data], { type: 'application/json' });
  var url = URL.createObjectURL(blob);

  var a = document.createElement('a');
  a.href = url;
  a.download = 'dados_salvos.json'; // Sugerindo um nome de arquivo
  a.click();

  // Libera a URL utilizada
  URL.revokeObjectURL(url);
}

// Função para abrir a janela de seleção de arquivo
function selecionarArquivo() {
  var fileInput = document.getElementById('fileInput');
  fileInput.click();
}

// Evento disparado quando um arquivo é selecionado
document.getElementById('fileInput').addEventListener('change', function (event) {
  var file = event.target.files[0];
  var reader = new FileReader();

  // Callback chamado quando a leitura do arquivo é concluída
  reader.onload = function (e) {
    // Obtém o conteúdo do arquivo
    var contents = e.target.result;
    // Converte o conteúdo para objeto JavaScript (animes)
    var animes = JSON.parse(contents);
    // Armazena os dados em localStorage
    localStorage.setItem('animes_' + usuarioId, JSON.stringify(animes));

    // Atualiza a página para refletir as alterações
    exibirAnimes();
  };

  // Inicia a leitura do arquivo como texto
  reader.readAsText(file);

  location.reload(); // Atualiza a página
});

// <-- FUNÇÃO DE DOWNLOAD E UPLOAD