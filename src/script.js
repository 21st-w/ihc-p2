/* ============ NAVEGAÇÃO ENTRE TELAS ============ */
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.setAttribute('aria-selected', 'false'));
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    t.setAttribute('aria-selected', 'true');
    document.getElementById(t.dataset.screen).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ============ ACESSIBILIDADE ============ */
const body = document.body;
const panel = document.getElementById('a11yPanel');
const tog = document.getElementById('a11yToggle');

tog.addEventListener('click', () => {
  const o = panel.classList.toggle('open');
  tog.setAttribute('aria-expanded', o);
});

let fs = 16;
function setFs(v) {
  fs = Math.max(13, Math.min(24, v));
  document.documentElement.style.setProperty('--fs', fs + 'px');
  document.documentElement.style.fontSize = fs + 'px';
  document.getElementById('fsReset').setAttribute('aria-pressed', fs === 16);
}

document.getElementById('fsPlus').onclick = () => setFs(fs + 2);
document.getElementById('fsMinus').onclick = () => setFs(fs - 2);
document.getElementById('fsReset').onclick = () => setFs(16);

const cb = document.getElementById('contrastBtn');
const db = document.getElementById('darkModeBtn');

cb.onclick = () => {
  const on = body.classList.toggle('contrast');
  cb.setAttribute('aria-pressed', on);
  cb.textContent = on ? 'Ativado' : 'Desativado';
  if (on && db) {
    body.classList.remove('dark');
    db.setAttribute('aria-pressed', false);
    db.textContent = 'Desativado';
  }
};

if (db) {
  db.onclick = () => {
    const on = body.classList.toggle('dark');
    db.setAttribute('aria-pressed', on);
    db.textContent = on ? 'Ativado' : 'Desativado';
    if (on && cb) {
      body.classList.remove('contrast');
      cb.setAttribute('aria-pressed', false);
      cb.textContent = 'Desativado';
    }
  };
}

const vb = document.getElementById('vlibrasBtn');
let vlibrasLoaded = false;
let vlibrasActive = false;
if (vb) {
  vb.onclick = () => {
    const vwContainer = document.querySelector('[vw]');
    vlibrasActive = !vlibrasActive;
    
    if (vlibrasLoaded) {
      if (vwContainer) vwContainer.style.display = vlibrasActive ? 'block' : 'none';
      vb.textContent = vlibrasActive ? 'Ativado' : 'Desativado';
      vb.setAttribute('aria-pressed', vlibrasActive);
      return;
    }
    
    // Primeiro carregamento
    vlibrasLoaded = true;
    vb.textContent = 'Carregando...';
    vb.setAttribute('aria-pressed', 'true');

    // Suprime o alerta nativo irritante do Unity WebGL caso o VLibras falhe
    const _alert = window.alert;
    window.alert = function(msg) {
      if (typeof msg === 'string' && msg.includes('Unity')) {
        console.warn('Alerta do Unity suprimido:', msg);
        return;
      }
      _alert(msg);
    };

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.onload = () => {
      try {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
        vb.textContent = 'Ativado';
      } catch (e) {
        console.warn("VLibras failed to initialize:", e);
        vb.textContent = 'Erro';
      }
    };
    script.onerror = () => {
      vb.textContent = 'Erro de rede';
    };
    document.body.appendChild(script);
  };
}

/* ============ TELA 1 — GERENCIADOR ============ */
const data = {
  renda: [{ n: 'Salário', v: 3200 }],
  fixos: [{ n: 'Aluguel', v: 950 }, { n: 'Internet', v: 99 }],
  var: [{ n: 'Mercado', v: 600 }, { n: 'Transporte', v: 220 }, { n: 'Luz', v: 180 }],
  ass: [{ n: 'Netflix', v: 39.9 }, { n: 'Spotify', v: 21.9 }, { n: 'Selfit', v: 27.9 }]
};
const icons = { renda: 'R', fixos: 'F', var: 'V', ass: 'A' };
const colors = { renda: '#10b981', fixos: '#3b82f6', var: '#f59e0b', ass: '#8b5cf6' };

const brl = n => 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const brl0 = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');

function render(cat) {
  const ul = document.getElementById('list-' + cat);
  ul.innerHTML = '';
  data[cat].forEach((it, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="ico" style="background:${colors[cat]}22; color:${colors[cat]}">${icons[cat]}</span>
      <span class="nm" style="flex:1">${it.n}</span>
      <span class="vl">${brl(it.v)}</span>
      <button class="del" aria-label="Remover ${it.n}">✕</button>`;
    li.querySelector('.del').onclick = () => { data[cat].splice(i, 1); render(cat); calc(); };
    ul.appendChild(li);
  });
}

document.querySelectorAll('[data-add]').forEach(b => {
  b.onclick = () => {
    const c = b.dataset.add;
    const map = { renda: ['nr', 'vr'], fixos: ['nf', 'vf'], var: ['nv', 'vv'], ass: ['na', 'va'] };
    const n = document.getElementById(map[c][0]), v = document.getElementById(map[c][1]);
    if (n.value && v.value) {
      data[c].push({ n: n.value, v: parseFloat(v.value) });
      n.value = '';
      v.value = '';
      render(c);
      calc();
    }
  };
});

function calc() {
  const sum = c => data[c].reduce((a, b) => a + b.v, 0);
  const receita = sum('renda');
  const tf = sum('fixos'), tv = sum('var'), ta = sum('ass'), desp = tf + tv + ta, saldo = receita - desp;
  
  document.getElementById('kReceita').textContent = brl0(receita);
  document.getElementById('kDesp').textContent = brl0(desp);
  const ks = document.getElementById('kSaldo');
  ks.textContent = brl0(saldo);
  ks.parentElement.className = 'kpi ' + (saldo >= 0 ? 'pos' : 'neg');
  
  const pct = receita ? Math.min(100, desp / receita * 100) : 0;
  document.getElementById('barUse').style.width = pct + '%';
  document.getElementById('useTxt').textContent = `Você compromete ${pct.toFixed(0)}% da sua renda com despesas.`;
  
  // donut
  const tot = desp || 1;
  const pf = tf / tot * 100, pv = tv / tot * 100, pa = ta / tot * 100;
  document.getElementById('arcF').setAttribute('stroke-dasharray', `${pf} ${100 - pf}`);
  document.getElementById('arcV').setAttribute('stroke-dasharray', `${pv} ${100 - pv}`);
  document.getElementById('arcV').setAttribute('stroke-dashoffset', -pf);
  document.getElementById('arcA').setAttribute('stroke-dasharray', `${pa} ${100 - pa}`);
  document.getElementById('arcA').setAttribute('stroke-dashoffset', -(pf + pv));
  document.getElementById('lgF').textContent = brl0(tf);
  document.getElementById('lgV').textContent = brl0(tv);
  document.getElementById('lgA').textContent = brl0(ta);
  
  // conselho
  let txt;
  if (receita === 0) txt = 'Informe sua renda para começar a planejar.';
  else if (saldo < 0) txt = `Atenção! Suas despesas passam a renda em ${brl0(-saldo)}. Reveja os gastos variáveis primeiro.`;
  else if (ta > receita * 0.1) txt = `Suas assinaturas custam ${brl0(ta)}/mês. Cortando metade você guarda ${brl0(ta * 0.5)} por mês.`;
  else if (pct > 70) txt = `Você usa ${pct.toFixed(0)}% da renda. Tente manter as despesas abaixo de 70% e poupe o resto.`;
  else txt = `Muito bem! Sobram ${brl0(saldo)}. Que tal investir parte disso? Veja a aba Simulador.`;
  document.getElementById('adviceTxt').textContent = txt;
}

['renda', 'fixos', 'var', 'ass'].forEach(render);
calc();

/* ============ TELA 2 — CHATBOT (scriptado) ============ */
const replies = {
  'Como economizar?': 'Comece pelos gastos variáveis e assinaturas — costumam ter mais gordura para cortar. Definir um teto mensal para mercado e lazer já ajuda muito.',
  'Quanto posso investir?': 'Pelo seu resumo, sobra um saldo no fim do mês. Uma boa regra é investir entre 10% e 20% da renda. Simule na aba Simulador para ver o rendimento.',
  'Explique a poupança': 'A poupança rende cerca de 0,5% ao mês, é segura e você pode sacar quando quiser — ótima para reserva de emergência, mas rende menos que CDB ou Tesouro.'
};
const chatBody = document.getElementById('chatBody');

function add(text, who) {
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.innerHTML = text;
  chatBody.appendChild(d);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function botReply(q) {
  setTimeout(() => add(replies[q] || 'Ótima pergunta! Nesta versão de protótipo eu respondo a alguns temas pré-definidos. Em breve estarei conectado a uma IA completa.', 'bot'), 500);
}

document.querySelectorAll('#chips .chip').forEach(c => {
  c.onclick = () => {
    add(c.textContent, 'user');
    botReply(c.textContent);
  };
});

function sendMsg() {
  const i = document.getElementById('chatTxt');
  if (!i.value.trim()) return;
  add(i.value, 'user');
  const q = i.value;
  i.value = '';
  botReply(q);
}

document.getElementById('chatSend').onclick = sendMsg;
document.getElementById('chatTxt').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMsg();
});

/* ============ TELA 3 — SIMULADOR ============ */
let rate = 0.005, risk = 'low';
const riskTxt = { low: 'baixo risco', mid: 'risco médio', high: 'risco alto' };

document.querySelectorAll('#seg button').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('#seg button').forEach(x => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', 'true');
    rate = parseFloat(b.dataset.rate);
    risk = b.dataset.risk;
    simulate();
  };
});

const period = document.getElementById('period');
period.addEventListener('input', () => {
  document.getElementById('periodLbl').textContent = period.value + ' meses';
  simulate();
});

function fv(init, mon, r, m) {
  let t = init;
  for (let i = 0; i < m; i++) t = t * (1 + r) + mon;
  return t;
}

function simulate() {
  const init = parseFloat(document.getElementById('initial').value) || 0;
  const mon = parseFloat(document.getElementById('monthly').value) || 0;
  const m = parseInt(period.value);
  const invested = init + mon * m, final = fv(init, mon, rate, m), gain = final - invested;
  
  document.getElementById('rInvest').textContent = brl0(invested);
  document.getElementById('rFinal').textContent = brl0(final);
  document.getElementById('rGain').textContent = brl0(gain);
  
  const tag = document.getElementById('riskTag');
  tag.className = 'risk ' + risk;
  tag.textContent = riskTxt[risk];
  
  // barras de evolução (5 pontos)
  const bars = document.getElementById('bars');
  bars.innerHTML = '';
  const pts = [0, .25, .5, .75, 1].map(p => fv(init, mon, rate, Math.round(m * p)));
  const max = Math.max(...pts);
  
  pts.forEach((v, i) => {
    const d = document.createElement('div');
    d.className = 'b';
    d.innerHTML = `<i style="height:${(v / max * 130)}px"></i><small>${i === 0 ? 'hoje' : Math.round(m * [0, .25, .5, .75, 1][i]) + 'm'}</small>`;
    bars.appendChild(d);
  });
  
  // comparativo
  const opts = [['Poupança', 0.005, 'low'], ['CDB / Tesouro', 0.0095, 'mid'], ['Ações', 0.012, 'high']];
  document.getElementById('cmpBody').innerHTML = opts.map(o =>
    `<tr><td>${o[0]}</td><td><b>${brl0(fv(init, mon, o[1], m))}</b></td><td><span class="risk ${o[2]}">${riskTxt[o[2]]}</span></td></tr>`
  ).join('');
}

['initial', 'monthly'].forEach(id => document.getElementById(id).addEventListener('input', simulate));
simulate();
