document.addEventListener("DOMContentLoaded", () => {
  init(); // Inicializa o carregamento dos dados ao carregar a página
  document.getElementById("formAddJogador").addEventListener("submit", addJogador); // Adiciona o evento de submissão ao formulário de adicionar jogador
});

async function init() {
  // Carrega todas as tabelas ao inicializar a página
  await Promise.all([loadJogadores(), loadClans(), loadEventos(), loadAtaques(), loadRanking(), loadRankingClas(), fetchLigas()]);
}


async function fetchData(endpoint) {
  // Busca dados da API no endpoint especificado
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

function renderTable(tableId, headers, data, actionColumn = true) {
  // Renderiza uma tabela com os dados fornecidos e, opcionalmente, uma coluna de ações
  const table = document.getElementById(tableId);
  table.innerHTML = headers;

  data.forEach(item => {
    const row = Object.values(item).map(value => `<td>${value}</td>`).join('');
    table.innerHTML += `<tr>${row}${actionColumn ? `<td><button class="delete-btn" data-id="${item.ID_Jogador || item.ID_Cla || item.ID_Evento}">Excluir</button></td>` : ''}</tr>`;
  });

  // Adiciona eventos de exclusão aos botões de ação, se houver
  if (actionColumn) {
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', deleteJogador);
    });
  }
}

async function loadJogadores() {
  // Carrega a tabela de jogadores
  const data = await fetchData("http://localhost:3001/api/jogadores");
  const headers = `
    <tr>
      <th>ID</th>
      <th>Nome</th>
      <th>Data Entrada</th>
      <th>Pontuação Total</th>
      <th>Ações</th>
    </tr>
  `;
  renderTable("jogadoresTable", headers, data);
}

async function loadClans() {
  // Carrega a tabela de clãs
  const data = await fetchData("http://localhost:3001/api/clans");
  const headers = `
    <tr>
      <th>ID</th>
      <th>Nome</th>
      <th>Data Criação</th>
      <th>Liga</th>
      <th>Ações</th>
    </tr>
  `;
  renderTable("clansTable", headers, data);
}

async function loadEventos() {
  // Carrega a tabela de eventos
  const data = await fetchData("http://localhost:3001/api/eventos");
  const headers = `
    <tr>
      <th>ID</th>
      <th>Tipo</th>
      <th>Número da Semana</th>
    </tr>
  `;
  renderTable("eventosTable", headers, data, false);
}

async function loadAtaques() {
  // Carrega a tabela de ataques
  const data = await fetchData("http://localhost:3001/api/ataques");
  const headers = `
    <tr>
        <th>ID</th>
        <th>Tipo de Evento</th>
        <th>Número de Ataques</th>
        <th>Pontuação por Vitórias</th>
        <th>Pontuação por Derrota</th>
    </tr>
  `;
  renderTable("ataquesTable", headers, data, false);
}

async function loadRanking() {
  // Carrega a tabela de ranking de jogadores
  const data = await fetchData("http://localhost:3001/api/ranking");
  const headers = `
    <tr>
      <th>Posição</th>
      <th>Nome</th>
      <th>Pontuação</th>
    </tr>
  `;

  // Preenche as posições no ranking
  const rankingComPosicao = data.map((item, index) => ({
    Posicao: index + 1, // Adiciona a posição (1-based index)
    Nome_Jogador: item.Nome_Jogador,
    Pontuacao: item.Pontuacao
  }));

  renderTable("rankingJogadorTable", headers, rankingComPosicao, false);
}

async function loadRankingClas() {
  // Carrega a tabela de ranking de clãs
  const data = await fetchData("http://localhost:3001/api/ranking/cla");
  const headers = `
    <tr>
      <th>Posição</th>
      <th>Nome</th>
      <th>Pontuação</th>
    </tr>
  `;

  // Preenche as posições no ranking
  const rankingComPosicao = data.map((item, index) => ({
    Posicao: index + 1, // Adiciona a posição (1-based index)
    Nome_Cla: item.Nome,
    Pontuacao: item.Pontuacao
  }));

  renderTable("rankingClaTable", headers, rankingComPosicao, false);
}

async function addJogador(event) {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  const nomeJogador = document.getElementById('Nome_Jogador').value;
  const dataEntrada = document.getElementById('Data_Entrada').value;
  const Pontuacao_Total = document.getElementById('Pontuacao_Total').value;

  // Verifica se todos os campos foram preenchidos
  if (!nomeJogador || !dataEntrada || Pontuacao_Total === undefined) {
    console.error("Todos os campos são obrigatórios.");
    return;
  }

  try {
    // Envia uma requisição POST para adicionar um novo jogador
    const response = await fetch("http://localhost:3001/api/jogadores", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Nome_Jogador: nomeJogador, Data_Entrada: dataEntrada, Pontuacao_Total: Pontuacao_Total }),
    });

    if (response.ok) {
      alert('Jogador adicionado com sucesso');
      await loadJogadores(); // Recarrega a lista de jogadores
      await loadRanking();   // Recarrega o ranking após adicionar um jogador
    } else {
      alert('Erro ao adicionar jogador');
    }
  } catch (error) {
    console.error('Erro ao adicionar jogador:', error);
  }
}

async function deleteJogador(event) {
  // Obtém o ID do jogador a ser excluído
  const id = event.target.getAttribute('data-id');

  try {
    // Envia uma requisição DELETE para remover o jogador
    const response = await fetch(`http://localhost:3001/api/jogadores/${id}`, { method: 'DELETE' });

    if (response.ok) {
      alert('Jogador excluído com sucesso');
      await loadJogadores(); // Recarrega a lista de jogadores
      await loadRanking();   // Recarrega o ranking após excluir um jogador
    } else {
      alert('Erro ao excluir jogador');
    }
  } catch (error) {
    console.error('Erro ao excluir jogador:', error);
  }
}


async function fetchLigas() {
  try {
      const response = await fetch("http://localhost:3001/api/liga");
      if (!response.ok) {
          throw new Error('Erro ao buscar ligas');
      }
      const ligas = await response.json();
      populateLigaTable(ligas);
  } catch (error) {
      console.error('Erro:', error);
  }
}

function populateLigaTable(ligas) {
  const tableBody = document.getElementById('ligasTable').querySelector('tbody');
  tableBody.innerHTML = ''; // Limpa a tabela antes de preencher

  ligas.forEach(liga => {
      const row = document.createElement('tr');
      row.innerHTML = `
          <td>${liga.ID_Liga}</td>
          <td>${liga.Nome_Liga}</td>
          <td>${liga.Pontuacao_Minima}</td>
          <td>${liga.Pontuacao_Maxima}</td>
      `;
      tableBody.appendChild(row);
  });
}


