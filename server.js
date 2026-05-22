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
  if (!descricao || preco_compra == null || preco_venda == null) {
    return res.status(400).json({ error: 'Campos obrigatórios: descricao, preco_compra, preco_venda' });
  }
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
  if (!nome) return res.status(400).json({ error: 'Campo obrigatório: nome' });
  const info = db.prepare('UPDATE clientes SET nome = ? WHERE id = ?').run(nome, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json({ id: Number(req.params.id), nome });
});

app.delete('/api/clientes/:id', (req, res) => {
  const info = db.prepare('DELETE FROM clientes WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json({ message: 'Cliente removido' });
});

// ── Vendas ─────────────────────────────────────────────────

app.get('/api/vendas', (_req, res) => {
  const rows = db.prepare(`
    SELECT v.*, c.nome AS cliente_nome, m.descricao AS material_descricao
    FROM vendas v
    JOIN clientes c ON c.id = v.cliente_id
    JOIN materiais m ON m.id = v.material_id
    ORDER BY v.id DESC
  `).all();
  res.json(rows);
});

app.post('/api/vendas', (req, res) => {
  const { cliente_id, material_id, quantidade, data } = req.body;
  if (!cliente_id || !material_id || !quantidade) {
    return res.status(400).json({ error: 'Campos obrigatórios: cliente_id, material_id, quantidade' });
  }
  const material = db.prepare('SELECT * FROM materiais WHERE id = ?').get(material_id);
  if (!material) return res.status(404).json({ error: 'Material não encontrado' });
  const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(cliente_id);
  if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

  const preco_unitario = material.preco_venda;
  const preco_custo = material.preco_compra;
  const total = preco_unitario * quantidade;
  const dataVenda = data || new Date().toISOString().split('T')[0];

  const info = db.prepare(
    'INSERT INTO vendas (cliente_id, material_id, quantidade, preco_unitario, preco_custo, total, data) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(cliente_id, material_id, quantidade, preco_unitario, preco_custo, total, dataVenda);

  res.status(201).json({
    id: info.lastInsertRowid, cliente_id, material_id, quantidade,
    preco_unitario, preco_custo, total, data: dataVenda,
    cliente_nome: cliente.nome, material_descricao: material.descricao,
  });
});

app.delete('/api/vendas/:id', (req, res) => {
  const info = db.prepare('DELETE FROM vendas WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Venda não encontrada' });
  res.json({ message: 'Venda removida' });
});

// ── DRE ────────────────────────────────────────────────────

app.get('/api/dre', (req, res) => {
  const { inicio, fim } = req.query;
  let whereClause = '';
  const params = [];
  if (inicio && fim) {
    whereClause = 'WHERE v.data BETWEEN ? AND ?';
    params.push(inicio, fim);
  } else if (inicio) {
    whereClause = 'WHERE v.data >= ?';
    params.push(inicio);
  } else if (fim) {
    whereClause = 'WHERE v.data <= ?';
    params.push(fim);
  }

  const resumo = db.prepare(`
    SELECT
      COUNT(*)                                    AS total_vendas,
      COALESCE(SUM(v.total), 0)                   AS receita_bruta,
      COALESCE(SUM(v.preco_custo * v.quantidade), 0) AS custo_total,
      COALESCE(SUM(v.total) - SUM(v.preco_custo * v.quantidade), 0) AS lucro_bruto
    FROM vendas v ${whereClause}
  `).get(...params);

  const porMaterial = db.prepare(`
    SELECT
      m.descricao,
      SUM(v.quantidade)                          AS qtd_vendida,
      SUM(v.total)                                AS receita,
      SUM(v.preco_custo * v.quantidade)           AS custo,
      SUM(v.total) - SUM(v.preco_custo * v.quantidade) AS lucro
    FROM vendas v
    JOIN materiais m ON m.id = v.material_id
    ${whereClause}
    GROUP BY v.material_id
    ORDER BY lucro DESC
  `).all(...params);

  res.json({ resumo, porMaterial });
});

// ── Start ──────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
