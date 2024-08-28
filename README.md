## Pré-requisitos

Certifique-se de ter os seguintes requisitos instalados antes de executar o código:

- [node 18.18.0](https://nodejs.org/download/release/v18.18.0/)
- [MySql Server + Workbench](https://dev.mysql.com/downloads/workbench/)
  Ao instalar o WorkBench, atente-se para instalar corretamente e configurar as credenciais de acesso do root.

## Passo 1: Git

### 1.1. Configurando o git

Certifique-se de cadastrar seu usuário e email no git da sua máquina
Para verificar se já está cadastrado, execute:

```bash
git config -l
```

### 1.2. Clone o repositório

```bash
git clone https://github.com/LuSilva710/BancodeDados_TrabalhoPratico.git
```

### 1.3. Rotina de desenvolvimento

Lembrem-se de sempre executarem as modificações sempre na branch 'project'.

```bash
cd project
```

Agora apenas **lembre-se** de sempre atualizar o código antes de desenvolver. Para isso execute um

```bash
git fetch # para obter as informações sobre as atualizações disponíveis no repositório remoto
git pull origin project # aplicando as mudanças mapeadas online no seu repositório local da branch project

```

## Passo 2: Instalar Dependências

Navegue até o diretório do projeto e instale as dependências:

```bash
npm install # ou yarn install

```

