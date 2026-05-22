const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Materiais ──────────────────────────────────────────────

app.get('/api/materiais', (_req, res) => {
  const rows = db.prepare('SELECT * FROM materiais ORDER BY id DESC').all();
  res.json(rows);
});

app.get('/api/materiais/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM materiais WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Material não encontrado' });
  res.json(row);
});

app.post('/api/materiais', (req, res) => {
  const { descricao, preco_compra, preco_venda } = req.body;
  if (!descricao || preco_compra == null || preco_venda == null) {
    return res.status(400).json({ error: 'Campos obrigatórios: descricao, preco_compra, preco_venda' });
  }
  const info = db
    .prepare('INSERT INTO materiais (descricao, preco_compra, preco_venda) VALUES (?, ?, ?)')
    .run(descricao, preco_compra, preco_venda);
  res.status(201).json({ id: info.lastInsertRowid, descricao, preco_compra, preco_venda });
});

app.put('/api/materiais/:id', (req, res) => {
  const { descricao, preco_compra, preco_venda } = req.body;
  const info = db
    .prepare('UPDATE materiais SET descricao = ?, preco_compra = ?, preco_venda = ? WHERE id = ?')
    .run(descricao, preco_compra, preco_venda, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Material não encontrado' });
  res.json({ id: Number(req.params.id), descricao, preco_compra, preco_venda });
});

app.delete('/api/materiais/:id', (req, res) => {
  const info = db.prepare('DELETE FROM materiais WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Material não encontrado' });
  res.json({ message: 'Material removido' });
});

// ── Clientes ───────────────────────────────────────────────

app.get('/api/clientes', (_req, res) => {
  const rows = db.prepare('SELECT * FROM clientes ORDER BY id DESC').all();
  res.json(rows);
});

app.get('/api/clientes/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM clientes WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json(row);
});

app.post('/api/clientes', (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Campo obrigatório: nome' });
  const info = db.prepare('INSERT INTO clientes (nome) VALUES (?)').run(nome);
  res.status(201).json({ id: info.lastInsertRowid, nome });
});

app.put('/api/clientes/:id', (req, res) => {
  const { nome } = req.body;
  const info = db.prepare('UPDATE clientes SET nome = ? WHERE id = ?').run(nome, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json({ id: Number(req.params.id), nome });
});

app.delete('/api/clientes/:id', (req, res) => {
  const info = db.prepare('DELETE FROM clientes WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json({ message: 'Cliente removido' });
});

// ── Start ──────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
