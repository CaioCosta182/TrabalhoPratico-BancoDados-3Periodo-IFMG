// Importa os módulos necessários
const express = require("express");
const mysql = require("mysql2/promise");
const path = require('path');
const cors = require('cors');

// Cria uma instância do Express
const app = express();
const port = 3001; // Define a porta do servidor

// Configurações de middleware
app.use(cors()); // Permite o compartilhamento de recursos entre diferentes origens
app.use(express.static(path.join(__dirname, 'public'))); // Define o diretório de arquivos estáticos
app.use(express.json()); // Habilita o parsing de JSON para requisições

// Configurações de conexão com o banco de dados
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "yokohaze710",
  database: 'jogoclãdb',
  port: 3306,
};

// Função para obter uma conexão com o banco de dados
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// Função genérica para executar queries no banco de dados
async function getDataFromDatabase(query, params = []) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(query, params); // Executa a query com parâmetros opcionais
    return rows; // Retorna as linhas de resultado da query
  } catch (err) {
    console.error("Erro ao executar query:", err);
    throw err; // Lança o erro para ser tratado pelas rotas
  } finally {
    await connection.end(); // Fecha a conexão com o banco de dados
  }
}

// Rota para obter todos os jogadores
app.get("/api/jogadores", async (req, res) => {
  try {
    const jogadores = await getDataFromDatabase("SELECT j.ID_Jogador, j.Nome_Jogador, j.Pontuacao_Total, c.Nome FROM jogador j join Cla c on j.ID_Cla = c.ID_Cla ORDER BY j.ID_Jogador LIMIT 10;"); // Executa a query para buscar jogadores
    console.log(jogadores);
    res.json(jogadores); // Retorna os dados dos jogadores em formato JSON
  } catch (err) {
    console.error("Erro ao buscar jogadores:", err);
    res.status(500).send("Erro ao buscar jogadores"); // Retorna um erro 500 se houver falha
  }
});

// Rota para obter todos os clãs
app.get("/api/clans", async (req, res) => {
  try {
    const clans = await getDataFromDatabase("SELECT c.ID_Cla, c.Nome, c.Data_Criacao, l.Nome_Liga FROM Cla c join Liga l on c.ID_Liga = l.ID_Liga"); // Executa a query para buscar clãs
    res.status(200).json(clans); // Retorna os dados dos clãs em formato JSON com status 200
  } catch (err) {
    console.error("Erro ao buscar clãs:", err);
    res.status(500).send("Erro ao buscar clãs"); // Retorna um erro 500 se houver falha
  }
});

// Rota para obter todos os eventos
app.get("/api/eventos", async (req, res) => {
  try {
    const eventos = await getDataFromDatabase("SELECT tipo, count(tipo) FROM evento group by tipo;"); // Executa a query para buscar eventos
    res.json(eventos); // Retorna os dados dos eventos em formato JSON
  } catch (err) {
    console.error("Erro ao buscar eventos:", err);
    res.status(500).send("Erro ao buscar eventos"); // Retorna um erro 500 se houver falha
  }
});

app.get("/api/eventos/1", async (req, res) => {
  try {
    const { orderBy } = req.body;
    console.log(req.body);
    const eventos = await getDataFromDatabase("SELECT tipo, count(tipo) FROM evento group by tipo order by count(tipo) asc;"); // Executa a query para buscar eventos
    res.json(eventos); // Retorna os dados dos eventos em formato JSON
  } catch (err) {
    console.error("Erro ao buscar eventos:", err);
    res.status(500).send("Erro ao buscar eventos"); // Retorna um erro 500 se houver falha
  }
});

app.get("/api/eventos/2", async (req, res) => {
  try {
    const { orderBy } = req.body;
    console.log(req.body);
    const eventos = await getDataFromDatabase("SELECT tipo, count(tipo) FROM evento group by tipo order by count(tipo) desc;"); // Executa a query para buscar eventos
    res.json(eventos); // Retorna os dados dos eventos em formato JSON
  } catch (err) {
    console.error("Erro ao buscar eventos:", err);
    res.status(500).send("Erro ao buscar eventos"); // Retorna um erro 500 se houver falha
  }
});

// Rota para obter todos os ataques
app.get("/api/ataques", async (req, res) => {
  try {
    const ataques = await getDataFromDatabase("SELECT a.ID_Ataque, j.Nome_Jogador, a.N_Ataques, a.Vitorias, a.Derrotas FROM ataque a join jogador j on a.ID_Jogador = j.ID_Jogador order by a.Vitorias desc LIMIT 10;"); // Executa a query para buscar ataques
    res.json(ataques); // Retorna os dados dos ataques em formato JSON
  } catch (err) {
    console.error("Erro ao buscar ataques:", err);
    res.status(500).send("Erro ao buscar ataques"); // Retorna um erro 500 se houver falha
  }
});

// Rota para adicionar um jogador
app.post("/api/jogadores", async (req, res) => {
  const { Nome_Jogador, Data_Entrada, Pontuacao_Total, idCla} = req.body; // Extrai os dados do corpo da requisição
  console.log(Nome_Jogador, Data_Entrada, Pontuacao_Total, idCla)
  // Validação de entrada
  if (!Nome_Jogador || !Data_Entrada || Pontuacao_Total === undefined || !idCla) {
    return res.status(400).send("Parâmetros inválidos para adicionar jogador."); // Retorna um erro 400 se houver parâmetros inválidos
  }

  const formattedDate = new Date(Data_Entrada);
  if (isNaN(formattedDate.getTime())) {
    return res.status(400).send("Data de entrada inválida."); // Retorna um erro 400 se a data for inválida
  }

  const query = "INSERT INTO Jogador (Nome_Jogador, Data_Entrada, Pontuacao_Total, ID_Cla) VALUES (?, ?, ?, ?)";
  try {
    await getDataFromDatabase(query, [Nome_Jogador, formattedDate.toISOString().split('T')[0], Pontuacao_Total, idCla]); // Insere um novo jogador no banco de dados
    res.status(200).send("Jogador adicionado com sucesso!"); // Retorna sucesso se o jogador for adicionado
  } catch (err) {
    console.error("Erro ao adicionar jogador:", err);
    res.status(500).send("Erro ao adicionar jogador"); // Retorna um erro 500 se houver falha
  }
});

// Rota para deletar um jogador
app.delete("/api/jogadores/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10); // Converte o parâmetro ID para inteiro

  // Validação de entrada
  if (isNaN(id)) {
    return res.status(400).send("ID inválido."); // Retorna um erro 400 se o ID for inválido
  }

  const deleteQueries = [
    `DELETE FROM Ataque WHERE ID_Jogador = ?`,
    `DELETE FROM jogador WHERE ID_Jogador = ?`
  ];

  const connection = await getConnection(); // Obtém a conexão com o banco de dados
  try {
    for (const query of deleteQueries) {
      await connection.execute(query, [id]); // Executa as queries de deleção para o jogador
    }
    res.status(200).send("Jogador removido com sucesso!"); // Retorna sucesso se o jogador for removido
  } catch (err) {
    console.error("Erro ao remover jogador:", err.message);
    res.status(500).send("Erro ao remover jogador"); // Retorna um erro 500 se houver falha
  } finally {
    await connection.end(); // Fecha a conexão com o banco de dados
  }
});

// Rota para obter o ranking dos jogadores
app.get("/api/ranking", async (req, res) => {
  const query = `
    SELECT j.Nome_Jogador, SUM(a.Vitorias * 200 + a.Derrotas * -100) AS Pontuacao
    FROM Jogador j
    JOIN Ataque a ON j.ID_Jogador = a.ID_Jogador
    WHERE j.Data_Entrada >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
    GROUP BY j.ID_Jogador
    ORDER BY Pontuacao DESC
    LIMIT 10;
  `;
  try {
    const ranking = await getDataFromDatabase(query); // Executa a query para obter o ranking dos jogadores
    res.status(200).json(ranking); // Retorna os dados do ranking em formato JSON com status 200
  } catch (err) {
    console.error("Erro ao buscar ranking:", err);
    res.status(500).send("Erro ao buscar ranking"); // Retorna um erro 500 se houver falha
  }
});


// Rota para obter o ranking dos clãs
app.get("/api/ranking/cla", async (req, res) => {
  const query = `
    SELECT c.Nome, SUM(j.Pontuacao_Total) AS Pontuacao
    FROM Cla c
    JOIN Jogador j ON c.ID_Cla = j.ID_Cla
    GROUP BY c.ID_Cla
    ORDER BY Pontuacao DESC
    LIMIT 10;
  `;
  try {
    const rankingCla = await getDataFromDatabase(query); // Executa a query para obter o ranking dos clãs
    res.status(200).json(rankingCla); // Retorna os dados do ranking em formato JSON com status 200
  } catch (err) {
    console.error("Erro ao buscar ranking:", err);
    res.status(500).send("Erro ao buscar ranking"); // Retorna um erro 500 se houver falha
  }
});

app.get('/api/liga', async (req, res) => {
  try {
      const ligas = await getDataFromDatabase('SELECT * FROM liga order by Pontuacao_Maxima desc');
      res.json(ligas);
  } catch (err) {
      console.error('Erro ao buscar ligas:', err);
      res.status(500).json({ error: 'Erro ao buscar ligas' });
  }
});



// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`); // Loga a mensagem indicando que o servidor está ativo
});


