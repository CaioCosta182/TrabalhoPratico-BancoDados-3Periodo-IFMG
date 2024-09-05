document.addEventListener("DOMContentLoaded", () => {
  init(); // Inicializa o carregamento dos dados ao carregar a página
  document.getElementById("formAddJogador").addEventListener("submit", addJogador); // Adiciona o evento de submissão ao formulário de adicionar jogador
  document.getElementById("formAlterJogador").addEventListener("submit", alterJogador); // Adiciona o evento de submissão ao formulário de adicionar jogador
  document.getElementById("reportType").addEventListener("change", handleReportChange); // Adiciona o evento de mudança ao seletor de relatório
  document.getElementById("orderByEvents").addEventListener("change", loadEventos); // Adiciona a filtragem a lista de eventos na busca
  document.getElementById("orderByAttack").addEventListener("change", loadAtaques); // Adiciona a filtragem a lista de ataques na busca
  document.getElementById("orderByClans").addEventListener("change", loadClans); // Adiciona a filtragem a lista de clãs na busca
  document.getElementById("orderByPlayers").addEventListener("change", loadJogadores); // Adiciona a filtragem a lista de jogadores na busca
});

document.addEventListener('DOMContentLoaded', (event) => {
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
    // Quando o usuário clicar no "x" (fechar), fecha o modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Quando o usuário clicar fora do modal, fecha o modal
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});
var id;
async function init() {
  // Carrega todas as tabelas ao inicializar a página
  await Promise.all([loadJogadores(), loadClansSelect(), loadClans(), loadEventos(), loadAtaques(), loadRanking(), loadRankingClas(), fetchLigas()]);
  renderChart(); // Renderiza o gráfico ao inicializar a página
}

async function loadModalContent() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
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

async function loadClansSelect() {
  // Carrega os dados dos clãs para o seletor
  try {
    const clans = await fetchData('http://localhost:3001/api/clans');
    const selectElement = document.getElementById('ID_Cla');
    selectElement.innerHTML = '';
    clans.forEach(clan => {
      const option = document.createElement('option');
      option.value = clan.ID_Cla;
      option.textContent = clan.Nome;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar dados do clã:', error);
  }
}

function renderTable(tableId, headers, data, actionColumn = true) {
  // Renderiza uma tabela com os dados fornecidos e, opcionalmente, uma coluna de ações
  const table = document.getElementById(tableId);
  table.innerHTML = headers;

  data.forEach(item => {
    // Cria a linha da tabela com os dados
    const row = Object.values(item).map(value => `<td>${value}</td>`).join('');
    
    // Adiciona botões de ação se a coluna de ações estiver habilitada
    const actionButtons = actionColumn ? `
      <td>
        <button class="update-btn" data-id="${item.ID_Jogador || item.ID_Cla || item.ID_Evento}"><i class="fas fa-sync-alt"></i></button>
        <button class="delete-btn" data-id="${item.ID_Jogador || item.ID_Cla || item.ID_Evento}"><i class="fas fa-trash-alt"></i></button>
      </td>` : '';
    
    // Insere a linha completa na tabela
    table.innerHTML += `<tr>${row}${actionButtons}</tr>`;
  });

  // Adiciona eventos de exclusão aos botões de ação, se houver
  if (actionColumn) {
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', deleteJogador);
    });

    // Adiciona eventos de atualização aos botões de ação
    document.querySelectorAll('.update-btn').forEach(button => {
    button.addEventListener('click', updateJogador);
    });
  }
}

// Função de exemplo para o evento de atualização
function updateJogador(event) {
  id = event.target.dataset.id;
  // Implementar a lógica de atualização, por exemplo, abrir um modal para editar os dados
  loadModalContent();
  console.log(`Atualizar jogador com ID: ${id}`);
}

async function alterJogador(event){
  event.preventDefault();
  var modal = document.getElementById("myModal");
  const nomeJogador = document.getElementById('Novo_Nome_Jogador').value;
  // Verifica se todos os campos foram preenchidos
  if (!nomeJogador) {
    console.error("Todos os campos são obrigatórios.");
    return;
  }
  console.log(nomeJogador, id);

  try {
    // Envia uma requisição PUT para alterar um jogador
    const response = await fetch("http://localhost:3001/api/jogadores", {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Nome_Jogador: nomeJogador, id: id}),
    });

    if (response.ok) {
      modal.style.display = "none";
      alert('Jogador alterado com sucesso');
      await loadJogadores(); // Recarrega a lista de jogadores
    } else {
      modal.style.display = "none";
      alert('Erro ao alterar nome do jogador');
    }
  } catch (error) {
    console.error('Erro ao alterar jogador:', error);
  }
}

// Função de exemplo para o evento de exclusão
function deleteJogador(event) {
  const id = event.target.dataset.id;
  // Implementar a lógica de exclusão, por exemplo, enviar uma requisição para deletar do banco de dados
  console.log(`Excluir jogador com ID: ${id}`);
}


async function loadJogadores() {
  // Carrega a tabela de jogadores
  const orderByPlayers = document.getElementById('orderByPlayers').value;
  const data = await fetchData("http://localhost:3001/api/jogadores/" + orderByPlayers);
  const headers = `
    <tr>
      <th>ID</th>
      <th>Nome</th>
      <th>Pontuação Total</th>
      <th>Clã</th>
      <th>Ações</th>
    </tr>
  `;
  renderTable("jogadoresTable", headers, data);
}

async function loadClans() {
  // Carrega a tabela de clãs
  const orderByClans = document.getElementById('orderByClans').value;
  const data = await fetchData("http://localhost:3001/api/clans/" + orderByClans);
  const headers = `
    <tr>
      <th>ID</th>
      <th>Nome</th>
      <th>Data Criação</th>
      <th>Liga</th>
    </tr>
  `;
  renderTable("clansTable", headers, data, false);
}

async function loadEventos() {
  // Carrega a tabela de eventos
  const orderByEvents = document.getElementById('orderByEvents').value;
  const data = await fetchData("http://localhost:3001/api/eventos/" + orderByEvents);
  const headers = `
    <tr>
      <th>Tipo</th>
      <th>Quantidades realizadas</th>
    </tr>
  `;
  renderTable("eventosTable", headers, data, false);
}

async function loadAtaques() {
  // Carrega a tabela de ataques
  const orderByAttack = document.getElementById('orderByAttack').value;
  const data = await fetchData("http://localhost:3001/api/ataques/" + orderByAttack);
  const headers = `
    <tr>
        <th>ID</th>
        <th>Nome Jogador</th>
        <th>Número de Ataques</th>
        <th>Vitórias</th>
        <th>Derrota</th>
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
  const idCla = document.getElementById('ID_Cla').value;

  // Verifica se todos os campos foram preenchidos
  if (!nomeJogador || !dataEntrada || Pontuacao_Total === undefined || !idCla) {
    console.error("Todos os campos são obrigatórios.");
    return;
  }

  try {
    // Envia uma requisição POST para adicionar um novo jogador
    const response = await fetch("http://localhost:3001/api/jogadores", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Nome_Jogador: nomeJogador, Data_Entrada: dataEntrada, Pontuacao_Total: Pontuacao_Total, idCla: idCla}),
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

const ctx = document.getElementById('myChart').getContext('2d');
const reportTypeSelect = document.getElementById('reportType');
let myChart;

// Função para criar o gráfico
function createChart(labels, ataques, vitorias, derrotas) {
  if (myChart) {
    myChart.destroy(); // Remove o gráfico existente, se houver
  }
  
  myChart = new Chart(ctx, {
    type: 'bar', // Tipo de gráfico
    data: {
      labels: labels,
      datasets: [
        // {
        //   label: 'Ataques',
        //   data: ataques,
        //   backgroundColor: 'rgba(75, 192, 192, 0.2)',
        //   borderColor: 'rgba(75, 192, 192, 1)',
        //   borderWidth: 1
        // },
        {
          label: 'Vitórias',
          data: vitorias,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Derrotas',
          data: derrotas,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

async function fetchAtaques() {
  // Função para buscar dados dos ataques
  try {
    const response = await fetch("http://localhost:3001/api/ataques");
    if (!response.ok) throw new Error('Erro ao buscar dados de ataques');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

async function fetchClans() {
  // Função para buscar dados dos clãs
  try {
    const response = await fetch("http://localhost:3001/api/clans");
    if (!response.ok) throw new Error('Erro ao buscar dados de clãs');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

async function fetchClansStats() {
  // Função para buscar dados dos clãs
  try {
    const response = await fetch("http://localhost:3001/api/clans/stats");
    if (!response.ok) throw new Error('Erro ao buscar dados de clãs');
    return await response.json();
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

async function renderChart() {
  const selectedReportType = reportTypeSelect.value;
  
  if (selectedReportType === 'playerStats') {
    const ataquesData = await fetchAtaques();
    
    const labels = [];
    const ataques = [];
    const vitorias = [];
    const derrotas = [];
    
    ataquesData.forEach(item => {
      labels.push(item.Nome_Jogador || item.Nome_Cla); // Use Nome_Jogador ou Nome_Cla dependendo do relatório
      ataques.push(item.Numero_Ataques || 0);
      vitorias.push(item.Vitorias || 0);
      derrotas.push(item.Derrotas || 0);
    });
    
    createChart(labels, ataques, vitorias, derrotas);
  } else if (selectedReportType === 'clanStats') {
    const clansData = await fetchClansStats();
    console.log(clansData);
    const labels = [];
    const vitorias = [];
    const derrotas = [];
    
    clansData.forEach(item => {
      labels.push(item.Nome); // Nome do clã
      vitorias.push(item.Vitorias || 0);
      derrotas.push(item.Derrotas || 0);
    });
    
    createChart(labels, ataques, vitorias, derrotas);
  }
}

function handleReportChange() {
  renderChart(); // Atualiza o gráfico quando o tipo de relatório é alterado
}

// Adiciona o evento de mudança ao seletor de relatório
reportTypeSelect.addEventListener('change', handleReportChange);
