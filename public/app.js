const API = '';

// ── Helpers ───────────────────────────────────────────────

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Navigation ────────────────────────────────────────────

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + btn.dataset.section).classList.add('active');
  });
});

// ══════════════════════════════════════════════════════════
// MATERIAIS
// ══════════════════════════════════════════════════════════

const formMat = document.getElementById('form-material');
const matId = document.getElementById('mat-id');
const matDescricao = document.getElementById('mat-descricao');
const matPrecoCompra = document.getElementById('mat-preco-compra');
const matPrecoVenda = document.getElementById('mat-preco-venda');
const btnCancelarMat = document.getElementById('btn-cancelar-mat');
const btnSalvarMat = document.getElementById('btn-salvar-mat');
const tbodyMat = document.getElementById('tbody-materiais');
const buscaMaterial = document.getElementById('busca-material');

let materiais = [];

async function loadMateriais() {
  const res = await fetch(API + '/api/materiais');
  materiais = await res.json();
  renderMateriais();
  if (typeof populateSelects === 'function') populateSelects();
}

function renderMateriais() {
  const filtro = buscaMaterial.value.toLowerCase();
  const filtered = materiais.filter(m => m.descricao.toLowerCase().includes(filtro));
  tbodyMat.innerHTML = filtered
    .map(
      m => `
    <tr>
      <td>${m.id}</td>
      <td>${escapeHtml(m.descricao)}</td>
      <td>${formatCurrency(m.preco_compra)}</td>
      <td>${formatCurrency(m.preco_venda)}</td>
      <td>
        <button class="btn-edit" onclick="editMaterial(${m.id})">Editar</button>
        <button class="btn-delete" onclick="deleteMaterial(${m.id})">Excluir</button>
      </td>
    </tr>`
    )
    .join('');
}

buscaMaterial.addEventListener('input', renderMateriais);

formMat.addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    descricao: matDescricao.value.trim(),
    preco_compra: parseFloat(matPrecoCompra.value),
    preco_venda: parseFloat(matPrecoVenda.value),
  };

  if (matId.value) {
    await fetch(API + '/api/materiais/' + matId.value, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    showToast('Material atualizado!');
  } else {
    await fetch(API + '/api/materiais', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    showToast('Material cadastrado!');
  }

  resetFormMat();
  loadMateriais();
});

function editMaterial(id) {
  const m = materiais.find(x => x.id === id);
  if (!m) return;
  matId.value = m.id;
  matDescricao.value = m.descricao;
  matPrecoCompra.value = m.preco_compra;
  matPrecoVenda.value = m.preco_venda;
  btnSalvarMat.textContent = 'Atualizar';
  btnCancelarMat.style.display = 'inline-block';
  matDescricao.focus();
}

async function deleteMaterial(id) {
  if (!confirm('Deseja realmente excluir este material?')) return;
  await fetch(API + '/api/materiais/' + id, { method: 'DELETE' });
  showToast('Material excluído!');
  loadMateriais();
}

function resetFormMat() {
  formMat.reset();
  matId.value = '';
  btnSalvarMat.textContent = 'Salvar';
  btnCancelarMat.style.display = 'none';
}

btnCancelarMat.addEventListener('click', resetFormMat);

// ══════════════════════════════════════════════════════════
// CLIENTES
// ══════════════════════════════════════════════════════════

const formCli = document.getElementById('form-cliente');
const cliId = document.getElementById('cli-id');
const cliNome = document.getElementById('cli-nome');
const btnCancelarCli = document.getElementById('btn-cancelar-cli');
const btnSalvarCli = document.getElementById('btn-salvar-cli');
const tbodyCli = document.getElementById('tbody-clientes');
const buscaCliente = document.getElementById('busca-cliente');

let clientes = [];

async function loadClientes() {
  const res = await fetch(API + '/api/clientes');
  clientes = await res.json();
  renderClientes();
  if (typeof populateSelects === 'function') populateSelects();
}

function renderClientes() {
  const filtro = buscaCliente.value.toLowerCase();
  const filtered = clientes.filter(c => c.nome.toLowerCase().includes(filtro));
  tbodyCli.innerHTML = filtered
    .map(
      c => `
    <tr>
      <td>${c.id}</td>
      <td>${escapeHtml(c.nome)}</td>
      <td>
        <button class="btn-edit" onclick="editCliente(${c.id})">Editar</button>
        <button class="btn-delete" onclick="deleteCliente(${c.id})">Excluir</button>
      </td>
    </tr>`
    )
    .join('');
}

buscaCliente.addEventListener('input', renderClientes);

formCli.addEventListener('submit', async e => {
  e.preventDefault();
  const body = { nome: cliNome.value.trim() };

  if (cliId.value) {
    await fetch(API + '/api/clientes/' + cliId.value, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    showToast('Cliente atualizado!');
  } else {
    await fetch(API + '/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    showToast('Cliente cadastrado!');
  }

  resetFormCli();
  loadClientes();
});

function editCliente(id) {
  const c = clientes.find(x => x.id === id);
  if (!c) return;
  cliId.value = c.id;
  cliNome.value = c.nome;
  btnSalvarCli.textContent = 'Atualizar';
  btnCancelarCli.style.display = 'inline-block';
  cliNome.focus();
}

async function deleteCliente(id) {
  if (!confirm('Deseja realmente excluir este cliente?')) return;
  await fetch(API + '/api/clientes/' + id, { method: 'DELETE' });
  showToast('Cliente excluído!');
  loadClientes();
}

function resetFormCli() {
  formCli.reset();
  cliId.value = '';
  btnSalvarCli.textContent = 'Salvar';
  btnCancelarCli.style.display = 'none';
}

btnCancelarCli.addEventListener('click', resetFormCli);

// ══════════════════════════════════════════════════════════
// VENDAS
// ══════════════════════════════════════════════════════════

const formVenda = document.getElementById('form-venda');
const vendaCliente = document.getElementById('venda-cliente');
const vendaMaterial = document.getElementById('venda-material');
const vendaQuantidade = document.getElementById('venda-quantidade');
const vendaData = document.getElementById('venda-data');
const vendaPreco = document.getElementById('venda-preco');
const tbodyVendas = document.getElementById('tbody-vendas');

let vendas = [];

vendaData.value = new Date().toISOString().split('T')[0];

function populateSelects() {
  vendaCliente.innerHTML = '<option value="">Selecione o cliente...</option>' +
    clientes.map(c => `<option value="${c.id}">${escapeHtml(c.nome)}</option>`).join('');
  vendaMaterial.innerHTML = '<option value="">Selecione o material...</option>' +
    materiais.map(m => `<option value="${m.id}">${escapeHtml(m.descricao)} - ${formatCurrency(m.preco_venda)}</option>`).join('');
}

vendaMaterial.addEventListener('change', () => {
  const m = materiais.find(x => x.id === Number(vendaMaterial.value));
  vendaPreco.value = m ? formatCurrency(m.preco_venda) : '';
});

async function loadVendas() {
  const res = await fetch(API + '/api/vendas');
  vendas = await res.json();
  renderVendas();
}

function renderVendas() {
  tbodyVendas.innerHTML = vendas
    .map(
      v => `
    <tr>
      <td>${v.id}</td>
      <td>${v.data}</td>
      <td>${escapeHtml(v.cliente_nome)}</td>
      <td>${escapeHtml(v.material_descricao)}</td>
      <td>${v.quantidade}</td>
      <td>${formatCurrency(v.preco_unitario)}</td>
      <td>${formatCurrency(v.total)}</td>
      <td>
        <button class="btn-delete" onclick="deleteVenda(${v.id})">Excluir</button>
      </td>
    </tr>`
    )
    .join('');
}

formVenda.addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    cliente_id: Number(vendaCliente.value),
    material_id: Number(vendaMaterial.value),
    quantidade: parseInt(vendaQuantidade.value, 10),
    data: vendaData.value,
  };

  await fetch(API + '/api/vendas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  showToast('Venda registrada!');
  formVenda.reset();
  vendaData.value = new Date().toISOString().split('T')[0];
  vendaPreco.value = '';
  loadVendas();
});

async function deleteVenda(id) {
  if (!confirm('Deseja realmente excluir esta venda?')) return;
  await fetch(API + '/api/vendas/' + id, { method: 'DELETE' });
  showToast('Venda excluída!');
  loadVendas();
}

// ══════════════════════════════════════════════════════════
// DRE
// ══════════════════════════════════════════════════════════

const formDre = document.getElementById('form-dre-filtro');
const dreInicio = document.getElementById('dre-inicio');
const dreFim = document.getElementById('dre-fim');
const dreReceita = document.getElementById('dre-receita');
const dreCusto = document.getElementById('dre-custo');
const dreLucro = document.getElementById('dre-lucro');
const dreTotalVendas = document.getElementById('dre-total-vendas');
const tbodyDre = document.getElementById('tbody-dre');

async function loadDre() {
  const params = new URLSearchParams();
  if (dreInicio.value) params.set('inicio', dreInicio.value);
  if (dreFim.value) params.set('fim', dreFim.value);

  const res = await fetch(API + '/api/dre?' + params.toString());
  const { resumo, porMaterial } = await res.json();

  dreReceita.textContent = formatCurrency(resumo.receita_bruta);
  dreCusto.textContent = formatCurrency(resumo.custo_total);
  dreLucro.textContent = formatCurrency(resumo.lucro_bruto);
  dreTotalVendas.textContent = resumo.total_vendas;

  tbodyDre.innerHTML = porMaterial
    .map(
      p => {
        const margem = p.receita > 0 ? ((p.lucro / p.receita) * 100).toFixed(1) : '0.0';
        return `
    <tr>
      <td>${escapeHtml(p.descricao)}</td>
      <td>${p.qtd_vendida}</td>
      <td>${formatCurrency(p.receita)}</td>
      <td>${formatCurrency(p.custo)}</td>
      <td>${formatCurrency(p.lucro)}</td>
      <td>${margem}%</td>
    </tr>`;
      }
    )
    .join('');
}

formDre.addEventListener('submit', e => {
  e.preventDefault();
  loadDre();
});

// ── Init ──────────────────────────────────────────────────

async function init() {
  await Promise.all([loadMateriais(), loadClientes()]);
  populateSelects();
  loadVendas();
  loadDre();
}

init();
