const KEY = 'estoque_produtos_v1';
const LOGKEY = 'estoque_log_v1';
let produtos = [];
let logs = [];

function loadData(){
  try{
    const p = localStorage.getItem(KEY);
    produtos = p ? JSON.parse(p) : [];
  }catch(e){ produtos = []; }
  try{
    const l = localStorage.getItem(LOGKEY);
    logs = l ? JSON.parse(l) : [];
  }catch(e){ logs = []; }
}
function saveData(){
  try{
    localStorage.setItem(KEY, JSON.stringify(produtos));
    localStorage.setItem(LOGKEY, JSON.stringify(logs));
  }catch(e){ console.error('Erro ao salvar', e); }
}
function addLog(msg){
  logs.unshift({msg, time:new Date().toLocaleString('pt-BR')});
  logs = logs.slice(0,50);
}
function fmt(n){ return 'R$ ' + Number(n).toFixed(2).replace('.',','); }

function render(){
  const busca = document.getElementById('busca').value.toLowerCase();
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca) || (p.codigo||'').toLowerCase().includes(busca)
  );
  document.getElementById('empty').style.display = filtrados.length ? 'none' : 'block';

  filtrados.forEach(p => {
    const low = p.qtd <= p.min;
    const tr = document.createElement('tr');
    if(low) tr.className = 'low';
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.codigo||'-'}</td>
      <td>${p.qtd}</td>
      <td><span class="badge ${low?'low':'ok'}">${low?'Estoque baixo':'OK'}</span></td>
      <td>${fmt(p.custo)}</td>
      <td>${fmt(p.venda)}</td>
      <td class="actions">
        <button class="btn-add" onclick="mover('${p.id}',1)">+1</button>
        <button class="btn-sub" onclick="mover('${p.id}',-1)">-1</button>
        <button class="btn-edit" onclick="editar('${p.id}')">✏️</button>
        <button class="btn-del" id="del-${p.id}" onclick="remover('${p.id}')">🗑</button>
      </td>`;
    tbody.appendChild(tr);
  });

  const totalItens = produtos.reduce((s,p)=>s+p.qtd,0);
  const totalValor = produtos.reduce((s,p)=>s+p.qtd*p.custo,0);
  const baixos = produtos.filter(p=>p.qtd<=p.min).length;
  document.getElementById('summary').innerHTML = `
    <div class="stat"><div class="n">${produtos.length}</div><div class="l">Produtos cadastrados</div></div>
    <div class="stat"><div class="n">${totalItens}</div><div class="l">Itens em estoque</div></div>
    <div class="stat"><div class="n">${fmt(totalValor)}</div><div class="l">Valor total (custo)</div></div>
    <div class="stat alert"><div class="n">${baixos}</div><div class="l">Alertas de estoque baixo</div></div>
  `;

  document.getElementById('log').innerHTML = logs.length
    ? logs.map(l=>`<div><span>${l.time}</span> — ${l.msg}</div>`).join('')
    : '<div>Nenhuma movimentação registrada ainda.</div>';

  saveData();
}

function mover(id, delta){
  const p = produtos.find(x=>x.id===id);
  if(!p) return;
  const novaQtd = p.qtd + delta;
  if(novaQtd < 0) return;
  p.qtd = novaQtd;
  addLog(`${delta>0?'Entrada':'Saída'} de 1 un. — ${p.nome} (novo saldo: ${p.qtd})`);
  render();
}
function remover(id){
  const btn = document.getElementById('del-'+id);
  if(btn && btn.dataset.armado !== '1'){
    btn.dataset.armado = '1';
    btn.textContent = 'Confirmar?';
    btn.style.background = 'var(--danger)';
    btn.style.color = '#fff';
    setTimeout(()=>{
      if(btn && btn.dataset.armado === '1'){
        btn.dataset.armado = '0';
        btn.textContent = '🗑';
        btn.style.background = '';
        btn.style.color = '';
      }
    }, 3000);
    return;
  }
  const p = produtos.find(x=>x.id===id);
  if(!p) return;
  produtos = produtos.filter(x=>x.id!==id);
  addLog(`Produto removido — ${p.nome}`);
  if(document.getElementById('f-id').value === id) cancelarEdicao();
  render();
}

function editar(id){
  const p = produtos.find(x=>x.id===id);
  if(!p) return;
  document.getElementById('f-id').value = p.id;
  document.getElementById('f-nome').value = p.nome;
  document.getElementById('f-codigo').value = p.codigo||'';
  document.getElementById('f-categoria').value = p.categoria||'';
  document.getElementById('f-qtd').value = p.qtd;
  document.getElementById('f-min').value = p.min;
  document.getElementById('f-custo').value = p.custo;
  document.getElementById('f-venda').value = p.venda;
  document.getElementById('f-qtd-label').textContent = 'Qtd. atual';
  document.getElementById('form-titulo').textContent = `Editando: ${p.nome}`;
  document.getElementById('f-submit').textContent = 'Salvar alterações';
  document.getElementById('f-cancelar').style.display = 'inline-block';
  document.getElementById('form-produto').scrollIntoView({behavior:'smooth', block:'start'});
}

function cancelarEdicao(){
  document.getElementById('form-produto').reset();
  document.getElementById('f-id').value = '';
  document.getElementById('f-qtd').value = 0;
  document.getElementById('f-min').value = 5;
  document.getElementById('f-custo').value = 0;
  document.getElementById('f-venda').value = 0;
  document.getElementById('f-qtd-label').textContent = 'Qtd. inicial';
  document.getElementById('form-titulo').textContent = 'Adicionar produto';
  document.getElementById('f-submit').textContent = '+ Adicionar produto';
  document.getElementById('f-cancelar').style.display = 'none';
}
document.getElementById('f-cancelar').addEventListener('click', cancelarEdicao);

document.getElementById('form-produto').addEventListener('submit', e=>{
  e.preventDefault();
  const nome = document.getElementById('f-nome').value.trim();
  if(!nome) return;
  const editId = document.getElementById('f-id').value;
  const dados = {
    nome,
    codigo: document.getElementById('f-codigo').value.trim(),
    categoria: document.getElementById('f-categoria').value.trim(),
    qtd: Number(document.getElementById('f-qtd').value)||0,
    min: Number(document.getElementById('f-min').value)||0,
    custo: Number(document.getElementById('f-custo').value)||0,
    venda: Number(document.getElementById('f-venda').value)||0,
  };

  if(editId){
    const p = produtos.find(x=>x.id===editId);
    if(p){
      Object.assign(p, dados);
      addLog(`Produto editado — ${p.nome}`);
    }
    cancelarEdicao();
  } else {
    const p = { id: Date.now().toString(36)+Math.random().toString(36).slice(2,6), ...dados };
    produtos.push(p);
    addLog(`Produto cadastrado — ${p.nome} (qtd inicial: ${p.qtd})`);
    e.target.reset();
    document.getElementById('f-qtd').value = 0;
    document.getElementById('f-min').value = 5;
    document.getElementById('f-custo').value = 0;
    document.getElementById('f-venda').value = 0;
  }
  render();
});

document.getElementById('busca').addEventListener('input', render);

loadData();
render();
