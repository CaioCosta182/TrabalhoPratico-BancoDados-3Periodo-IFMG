-- Criação do banco de dados JogoClãDB
CREATE DATABASE JogoClãDB;
USE JogoClãDB;

-- Tabela Jogador
CREATE TABLE Jogador (
    ID_Jogador INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Jogador VARCHAR(255),
    Data_Entrada DATE,
    Pontuacao_Total INT
);

-- Tabela Ataque
CREATE TABLE Ataque (
    ID_Ataque INT AUTO_INCREMENT PRIMARY KEY,
    ID_Jogador INT,
    N_Ataques INT,
    Vitoria INT,
    Derrotas INT,
    FOREIGN KEY (ID_Jogador) REFERENCES Jogador(ID_Jogador)
);

-- Tabela Clã
CREATE TABLE Cla (
    ID_Cla INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(255),
    Data_Criacao DATE,
    Liga VARCHAR(255)
);

-- Tabela Evento
CREATE TABLE Evento (
    ID_Evento INT AUTO_INCREMENT PRIMARY KEY,
    Tipo VARCHAR(255),
    N_Semana INT
);

-- Tabela Relacionamento Jogador_Cla
CREATE TABLE Jogador_Cla (
    ID_Jogador INT,
    ID_Cla INT,
    PRIMARY KEY (ID_Jogador, ID_Cla),
    FOREIGN KEY (ID_Jogador) REFERENCES Jogador(ID_Jogador),
    FOREIGN KEY (ID_Cla) REFERENCES Cla(ID_Cla)
);

-- Tabela Relacionamento Cla_Evento
CREATE TABLE Cla_Evento (
    ID_Cla INT,
    ID_Evento INT,
    PRIMARY KEY (ID_Cla, ID_Evento),
    FOREIGN KEY (ID_Cla) REFERENCES Cla(ID_Cla),
    FOREIGN KEY (ID_Evento) REFERENCES Evento(ID_Evento)
);

-- Tabela Ligas e Pontuações de Cla
CREATE TABLE Liga (
    ID_Liga INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Liga VARCHAR(20),
    Pontuacao_Minima INT,
    Pontuacao_Maxima INT
);

INSERT INTO Liga (Nome_Liga, Pontuacao_Minima, Pontuacao_Maxima) VALUES
('Liga Bronze', 0, 600),
('Liga Prata', 601, 1500),
('Liga Ouro', 1501, 3000);





-- Inserindo dados na tabela Jogador
INSERT INTO Jogador (Nome_Jogador, Data_Entrada, Pontuacao_Total)
VALUES ('Jogador1', '2023-01-01', 100), ('Jogador2', '2023-02-01', 200);

-- Inserindo dados na tabela Ataque
INSERT INTO Ataque (ID_Jogador, N_Ataques, Vitorias, Derrotas)
VALUES (8, 10, 4, 6), (9, 10, 4, 6);

-- Inserindo dados na tabela Cla
INSERT INTO Cla (Nome, Data_Criacao, Liga)
VALUES ('Cla1', '2022-01-01', 'Lendária'), ('Cla2', '2022-02-01', 'Lendária');

-- Inserindo dados na tabela Evento
INSERT INTO Evento (Tipo, N_Semana)
VALUES ('Regata Fluvial', 1), ('Regata Fluvial', 2), ('Regata Fluvial', 3), ('Coliseu', 4);


-- Relacionamento Jogador_Cla
INSERT INTO Jogador_Cla (ID_Jogador, ID_Cla)
VALUES (1, 1), (2, 1);

-- Relacionamento Cla_Evento
INSERT INTO Cla_Evento (ID_Cla, ID_Evento)
VALUES (1, 1), (1, 2);


-- Concessão de privilégios ao usuário root
GRANT ALL PRIVILEGES ON JogoClãDB.* TO 'root'@'localhost';
FLUSH PRIVILEGES;



select * from jogador;

