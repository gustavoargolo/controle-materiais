# Controle de Materiais

Sistema de cadastro e controle de materiais e clientes, com backend em **Node.js**, banco de dados **SQLite** e frontend em **HTML / CSS / JavaScript**.

---

## Funcionalidades

| Módulo     | Campos                                                       |
| ---------- | ------------------------------------------------------------ |
| **Material** | ID (PK auto), Descrição (até 100 caracteres), Preço de Compra, Preço de Venda |
| **Cliente**  | ID (PK auto), Nome (até 60 caracteres)                      |

- Cadastro (criar)
- Consulta (listar com filtro por texto)
- Edição (atualizar)
- Exclusão (remover com confirmação)

---

## Tecnologias

- **Node.js** + **Express** — servidor HTTP e API REST
- **better-sqlite3** — acesso ao banco SQLite (síncrono e rápido)
- **HTML / CSS / JavaScript** puro — interface no navegador

---

## Pré-requisitos

| Ferramenta | Versão mínima |
| ---------- | ------------- |
| **Node.js** | 18 ou superior |
| **npm**     | 9 ou superior  |

> O SQLite **não** precisa ser instalado separadamente; o pacote `better-sqlite3` já embute a engine.

---

## Passo a passo para executar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/gustavoargolo/controle-materiais.git
cd controle-materiais
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Iniciar o servidor

```bash
npm start
```

O terminal exibirá:

```
Servidor rodando em http://localhost:3000
```

### 4. Abrir no navegador

Acesse **http://localhost:3000** no seu navegador.

---

## Estrutura do projeto

```
controle-materiais/
├── database.js        # Conexão e criação das tabelas SQLite
├── server.js          # Servidor Express + rotas da API REST
├── package.json
├── .gitignore
├── README.md
└── public/
    ├── index.html     # Página principal (SPA)
    ├── style.css      # Estilos
    └── app.js         # Lógica do frontend (fetch API)
```

---

## Endpoints da API

### Materiais

| Método | Rota                  | Descrição              |
| ------ | --------------------- | ---------------------- |
| GET    | `/api/materiais`      | Listar todos           |
| GET    | `/api/materiais/:id`  | Buscar por ID          |
| POST   | `/api/materiais`      | Criar novo material    |
| PUT    | `/api/materiais/:id`  | Atualizar material     |
| DELETE | `/api/materiais/:id`  | Excluir material       |

### Clientes

| Método | Rota                 | Descrição             |
| ------ | -------------------- | --------------------- |
| GET    | `/api/clientes`      | Listar todos          |
| GET    | `/api/clientes/:id`  | Buscar por ID         |
| POST   | `/api/clientes`      | Criar novo cliente    |
| PUT    | `/api/clientes/:id`  | Atualizar cliente     |
| DELETE | `/api/clientes/:id`  | Excluir cliente       |

---

## Licença

ISC
