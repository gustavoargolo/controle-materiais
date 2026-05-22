const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'controle.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS materiais (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao   TEXT    NOT NULL CHECK(length(descricao) <= 100),
    preco_compra REAL   NOT NULL,
    preco_venda  REAL   NOT NULL
  );

  CREATE TABLE IF NOT EXISTS clientes (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT    NOT NULL CHECK(length(nome) <= 60)
  );

  CREATE TABLE IF NOT EXISTS vendas (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id    INTEGER NOT NULL REFERENCES clientes(id),
    material_id   INTEGER NOT NULL REFERENCES materiais(id),
    quantidade    INTEGER NOT NULL CHECK(quantidade > 0),
    preco_unitario REAL   NOT NULL,
    preco_custo    REAL   NOT NULL,
    total          REAL   NOT NULL,
    data           TEXT   NOT NULL DEFAULT (date('now'))
  );
`);

module.exports = db;
