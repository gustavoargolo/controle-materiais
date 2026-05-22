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
}

function renderMateriais() {
  const filtro = buscaMaterial.value.toLowerCase();
  const filtered = materiais.filter(m => m.descricao.toLowerCase().includes(filtro));
  tbodyMat.innerHTML = filtered
    .map(
      m => `
    <tr>
      <td>${m.id}</td>
      <td>${m.descricao}</td>
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
}

function renderClientes() {
  const filtro = buscaCliente.value.toLowerCase();
  const filtered = clientes.filter(c => c.nome.toLowerCase().includes(filtro));
  tbodyCli.innerHTML = filtered
    .map(
      c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.nome}</td>
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

// ── Init ──────────────────────────────────────────────────

loadMateriais();
loadClientes();
