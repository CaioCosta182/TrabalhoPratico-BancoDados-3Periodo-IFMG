# Jogo Clã API

Esta é uma API construída com **Node.js** e **Express**, que utiliza um banco de dados **MySQL** para armazenar e recuperar informações sobre jogadores, clãs, eventos e ataques no contexto de um jogo de clãs. A aplicação serve dados por meio de endpoints REST para diferentes operações CRUD e relatórios.

## Tecnologias Utilizadas

- **Node.js**: Servidor backend.
- **Express.js**: Framework para construção da API.
- **MySQL2/promise**: Para realizar consultas assíncronas ao banco de dados.
- **CORS**: Habilita o compartilhamento de recursos entre diferentes origens.
- **Path**: Utilizado para servir arquivos estáticos.
- **JavaScript**: Linguagem de programação usada no projeto.

## Requisitos

- Node.js
- MySQL

## Configuração do Banco de Dados

1. Crie um banco de dados MySQL chamado `jogoclãdb`.
2. Configure suas tabelas conforme o esquema que inclui as seguintes entidades: `Jogador`, `Cla`, `Evento`, `Ataque`, entre outras.
3. Atualize as credenciais de acesso ao banco de dados no arquivo de configuração da API:

   ```javascript
   const dbConfig = {
     host: "localhost",
     user: "root",
     password: "*********",  // Atualize com sua senha
     database: "jogoclãdb",
     port: 3306,
   }; 

## Instalação

1. Clone o repositório:
   
git clone <link_do_repositorio>
cd <nome_do_projeto>

2. Instale as dependências:

npm install

3. Execute o servidor:

node app.js
O servidor será iniciado na porta 3001 por padrão.

## Endpoints da API
## Jogadores

GET /api/jogadores: Retorna os jogadores, com detalhes como nome, pontuação e clã.

GET /api/jogadores/1: Retorna os jogadores ordenados por ID em ordem crescente.

GET /api/jogadores/2: Retorna os jogadores ordenados por ID em ordem decrescente.

POST /api/jogadores: Adiciona um novo jogador.

PUT /api/jogadores: Atualiza o nome de um jogador.

DELETE /api/jogadores/:id: Remove um jogador e seus registros de ataques.

## Clãs

GET /api/clans: Retorna os clãs, incluindo seu emblema e informações da liga.

GET /api/clans/1: Retorna os clãs ordenados por ID em ordem crescente.

GET /api/clans/2: Retorna os clãs ordenados por ID em ordem decrescente.

## Eventos

GET /api/eventos: Retorna os tipos de eventos e suas quantidades.

GET /api/eventos/1: Retorna os eventos ordenados por quantidade crescente.

GET /api/eventos/2: Retorna os eventos ordenados por quantidade decrescente.

## Ataques

GET /api/ataques: Retorna os ataques, com detalhes como vitórias e derrotas.

GET /api/ataques/1: Retorna os ataques com mais vitórias.

GET /api/ataques/2: Retorna os ataques com menos vitórias.

## Rankings

GET /api/ranking: Retorna o ranking de jogadores com base em vitórias e derrotas nas últimas 4 semanas.

GET /api/ranking/cla: Retorna o ranking de clãs com base na pontuação total dos jogadores.

## Ligas

GET /api/liga: Retorna as ligas ordenadas pela pontuação máxima.

## Funcionalidades do Frontend

No frontend (HTML), algumas funcionalidades incluem:

Tabela de jogadores: Carrega e exibe uma tabela de jogadores com opções de editar e excluir.

Modal de edição: Permite alterar o nome do jogador ao clicar em editar.

Seleção de clãs: Dropdown para selecionar clãs ao adicionar jogadores.
