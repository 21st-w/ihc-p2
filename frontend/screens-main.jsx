/* global React */
// Tio Patinhas — Painel + Dashboard screens

const { useState: useS_main, useMemo: useM_main, useEffect: useE_main } = React;

// ============================================
// PAINEL FINANCEIRO MENSAL — Screen 3
// ============================================
const PainelScreen = ({ state, setState, onAnalyze }) => {
  const s = state;

  const totals = useM_main(() => {
    const sum = (arr) => arr.reduce((a, b) => a + (Number(b.value) || 0), 0);
    const renda = sum(s.renda);
    const fixos = sum(s.fixos);
    const variaveis = sum(s.variaveis);
    const assinaturas = sum(s.assinaturas);
    const dividas = sum(s.dividas);
    const totalGastos = fixos + variaveis + assinaturas + dividas;
    const sobra = renda - totalGastos;
    const comprometido = renda > 0 ? (totalGastos / renda) * 100 : 0;
    return { renda, fixos, variaveis, assinaturas, dividas, totalGastos, sobra, comprometido };
  }, [s]);

  const setList = (key) => (next) => setState({ ...s, [key]: next });

  return (
    <div className="content">
      <div className="page-head">
        <div className="eyebrow">Painel</div>
        <h1>Painel financeiro mensal</h1>
        <div className="sub">Preencha os valores do mês para descobrir sua sobra real. O resumo à direita atualiza automaticamente.</div>
      </div>

      <div className="painel-grid">
        {/* LEFT — form */}
        <div>
          {/* 1. RENDA */}
          <div className="section-card">
            <div className="section-card-head">
              <span className="num">1</span>
              <div className="titles">
                <h3>Renda do mês</h3>
                <div className="hint">Quanto você recebeu este mês — salário, freelance, renda extra.</div>
              </div>
              <div className="total tnum">{fmtBRL(totals.renda)}</div>
            </div>
            <div className="section-card-body">
              <div style={{display: "flex", gap: 12, alignItems: "flex-end"}}>
                <div style={{flex: 1}}>
                  <div className="field">
                    <label>Quanto você recebeu este mês?</label>
                    <MoneyInput
                      big
                      value={s.renda[0]?.value || 0}
                      onChange={(v) => {
                        const next = [...s.renda];
                        next[0] = { ...(next[0] || {id: "r0", name: "Salário"}), value: v };
                        setList("renda")(next);
                      }}
                    />
                  </div>
                </div>
              </div>

              {s.renda.length > 1 && (
                <div style={{marginTop: 14}}>
                  {s.renda.slice(1).map((it, i) => (
                    <div key={it.id} className="expense-row">
                      <input
                        className="input"
                        placeholder="ex. Freelance, renda extra"
                        value={it.name}
                        onChange={(e) => {
                          const next = [...s.renda];
                          next[i + 1] = { ...next[i + 1], name: e.target.value };
                          setList("renda")(next);
                        }}
                      />
                      <MoneyInput
                        value={it.value}
                        onChange={(v) => {
                          const next = [...s.renda];
                          next[i + 1] = { ...next[i + 1], value: v };
                          setList("renda")(next);
                        }}
                      />
                      <button
                        className="remove"
                        onClick={() => setList("renda")(s.renda.filter((_, idx) => idx !== i + 1))}
                      ><Icon name="x" size={14} /></button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="add-row"
                onClick={() => setList("renda")([...s.renda, { id: Math.random().toString(36).slice(2), name: "", value: 0 }])}
              >
                <Icon name="plus" size={13} /> Adicionar outra renda
              </button>
            </div>
          </div>

          {/* 2. GASTOS FIXOS */}
          <SectionCard
            num="2"
            title="Gastos fixos"
            hint="Gastos que se repetem todo mês."
            total={totals.fixos}
          >
            <ExpenseListEditor
              items={s.fixos}
              onChange={setList("fixos")}
              addLabel="Adicionar gasto fixo"
            />
          </SectionCard>

          {/* 3. GASTOS VARIÁVEIS */}
          <SectionCard
            num="3"
            title="Gastos variáveis"
            hint="Gastos que mudam de valor ao longo do mês."
            total={totals.variaveis}
          >
            <ExpenseListEditor
              items={s.variaveis}
              onChange={setList("variaveis")}
              addLabel="Adicionar gasto variável"
            />
          </SectionCard>

          {/* 4. ASSINATURAS */}
          <SectionCard
            num="4"
            title="Assinaturas"
            hint="Serviços recorrentes que podem passar despercebidos."
            total={totals.assinaturas}
          >
            <ExpenseListEditor
              items={s.assinaturas}
              onChange={setList("assinaturas")}
              addLabel="Adicionar assinatura"
            />
          </SectionCard>

          {/* 5. DÍVIDAS */}
          <SectionCard
            num="5"
            title="Dívidas"
            hint="Parcelas, cartão, empréstimos ou financiamentos."
            total={totals.dividas}
          >
            <ExpenseListEditor
              items={s.dividas}
              onChange={setList("dividas")}
              addLabel="Adicionar dívida"
            />
          </SectionCard>

          {/* 6. META */}
          <div className="section-card">
            <div className="section-card-head">
              <span className="num">6</span>
              <div className="titles">
                <h3>Meta de economia</h3>
                <div className="hint">Quanto você gostaria de guardar por mês?</div>
              </div>
              <div className="total tnum">{fmtBRL(s.meta)}</div>
            </div>
            <div className="section-card-body">
              <div style={{maxWidth: 280}}>
                <MoneyInput value={s.meta} onChange={(v) => setState({ ...s, meta: v })} />
              </div>
            </div>
          </div>

          <div style={{display: "flex", gap: 12, marginTop: 24, alignItems: "center"}}>
            <Btn variant="primary" size="lg" icon="spark" onClick={onAnalyze}>
              Gerar análise financeira
            </Btn>
            <div className="muted" style={{fontSize: 12.5}}>
              Cria diagnóstico, simulação e nodos no Obsidian em um clique.
            </div>
          </div>
        </div>

        {/* RIGHT — live summary */}
        <SummaryPanel totals={totals} meta={s.meta} />
      </div>
    </div>
  );
};

const SectionCard = ({ num, title, hint, total, children }) => (
  <div className="section-card">
    <div className="section-card-head">
      <span className="num">{num}</span>
      <div className="titles">
        <h3>{title}</h3>
        <div className="hint">{hint}</div>
      </div>
      <div className="total tnum">{fmtBRL(total)}</div>
    </div>
    <div className="section-card-body">{children}</div>
  </div>
);

const SummaryPanel = ({ totals, meta }) => {
  const max = Math.max(totals.fixos, totals.variaveis, totals.assinaturas, totals.dividas, 1);
  const sobraColor = totals.sobra < 0 ? "var(--red)" : totals.sobra < (totals.renda * 0.1) ? "var(--gold)" : "var(--green)";
  const commitClamped = Math.min(100, Math.max(0, totals.comprometido));

  return (
    <aside className="summary">
      <div className="summary-hero">
        <div className="label">Sobra estimada</div>
        <div className="val tnum" style={{color: totals.sobra < 0 ? "#F4B4A8" : "#fff"}}>
          {totals.sobra < 0 ? "− " : ""}
          {fmtBRL(Math.abs(totals.sobra)).split(",")[0]}
          <span className="cents">,{fmtBRL(Math.abs(totals.sobra)).split(",")[1]}</span>
        </div>
        <div className="sub">
          {totals.renda > 0
            ? <>De {fmtBRLCompact(totals.renda)} recebidos · {fmtPct(100 - commitClamped, 1)} livre</>
            : <>Informe sua renda para começar</>}
        </div>
      </div>

      <div className="summary-bars">
        <BarRow label="Renda" value={totals.renda} max={Math.max(totals.renda, totals.totalGastos, 1)} color="#2F7A56" />
        <BarRow label="Fixos" value={totals.fixos} max={Math.max(totals.renda, totals.totalGastos, 1)} color={CATS.fixos.color} />
        <BarRow label="Variáveis" value={totals.variaveis} max={Math.max(totals.renda, totals.totalGastos, 1)} color={CATS.variaveis.color} />
        <BarRow label="Assinaturas" value={totals.assinaturas} max={Math.max(totals.renda, totals.totalGastos, 1)} color={CATS.assinaturas.color} />
        <BarRow label="Dívidas" value={totals.dividas} max={Math.max(totals.renda, totals.totalGastos, 1)} color={CATS.dividas.color} />
      </div>

      <div className="summary-meter">
        <div className="lbl">
          <span>Renda comprometida</span>
          <b>{fmtPct(commitClamped, 1)}</b>
        </div>
        <div className="meter-track">
          <div className="meter-fill" style={{ width: `${commitClamped}%` }} />
        </div>
        <div style={{marginTop: 8, fontSize: 11.5, color: "var(--ink-4)", display: "flex", justifyContent: "space-between"}}>
          <span>Saudável &lt; 70%</span>
          <span>Atenção 70–90%</span>
          <span>Alerta &gt; 90%</span>
        </div>
      </div>

      <div style={{padding: "0 18px 18px"}}>
        <hr className="divider" style={{margin: "0 0 12px"}} />
        <div style={{display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--ink-3)"}}>
          <span>Meta de economia</span>
          <span className="tnum" style={{color: "var(--ink)"}}>{fmtBRL(meta)}</span>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--ink-3)", marginTop: 4}}>
          <span>vs. sobra estimada</span>
          <span className="tnum" style={{color: sobraColor}}>
            {totals.sobra >= meta ? "✓ atinge a meta" : `falta ${fmtBRL(meta - totals.sobra)}`}
          </span>
        </div>
      </div>
    </aside>
  );
};

const BarRow = ({ label, value, max, color }) => (
  <div className="summary-bar">
    <div className="name"><span className="swatch" style={{background: color}} />{label}</div>
    <div className="track"><div className="fill" style={{width: `${(value / max) * 100}%`, background: color}} /></div>
    <div className="v tnum">{fmtBRLCompact(value)}</div>
  </div>
);

// ============================================
// DASHBOARD — Screen 4
// ============================================
const DashboardScreen = ({ state, go, openSave }) => {
  const sum = (arr) => arr.reduce((a, b) => a + (Number(b.value) || 0), 0);
  const renda = sum(state.renda);
  const fixos = sum(state.fixos);
  const variaveis = sum(state.variaveis);
  const assinaturas = sum(state.assinaturas);
  const dividas = sum(state.dividas);
  const totalGastos = fixos + variaveis + assinaturas + dividas;
  const sobra = renda - totalGastos;
  const comprometido = renda > 0 ? (totalGastos / renda) * 100 : 0;

  const groups = [
    { key: "fixos",       value: fixos,       label: "Gastos fixos",     color: CATS.fixos.color },
    { key: "variaveis",   value: variaveis,   label: "Gastos variáveis", color: CATS.variaveis.color },
    { key: "assinaturas", value: assinaturas, label: "Assinaturas",      color: CATS.assinaturas.color },
    { key: "dividas",     value: dividas,     label: "Dívidas",          color: CATS.dividas.color },
    { key: "sobra",       value: Math.max(sobra, 0), label: "Sobra",     color: CATS.sobra.color },
  ];
  const total = groups.reduce((a, b) => a + b.value, 0) || 1;
  const heaviest = [...groups].filter(g => g.key !== "sobra").sort((a, b) => b.value - a.value)[0];

  const status = comprometido > 90 ? { tone: "bad",  text: "Alerta: margem muito baixa" }
                : comprometido > 75 ? { tone: "warn", text: "Atenção: margem baixa" }
                :                       { tone: "good", text: "Saudável: boa margem de manobra" };

  if (renda === 0 && totalGastos === 0) {
    return (
      <div className="content">
        <div className="page-head">
          <div className="eyebrow">Dashboard</div>
          <h1>Resumo do seu mês</h1>
        </div>
        <EmptyState
          title="Seu painel ainda está vazio"
          body="Comece informando quanto você recebeu e quais foram seus principais gastos do mês."
          action={<Btn variant="primary" icon="arrow" onClick={() => go("painel")}>Preencher meu primeiro mês</Btn>}
        />
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-head" style={{display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between"}}>
        <div>
          <div className="eyebrow">Dashboard · Novembro 2025</div>
          <h1>Resumo do seu mês</h1>
          <div className="sub">O que entrou, o que saiu e onde está o ponto de atenção.</div>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <Btn variant="ghost" icon="edit" onClick={() => go("painel")}>Editar valores</Btn>
          <Btn variant="primary" icon="obsidian" onClick={openSave}>Salvar no Obsidian</Btn>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="stat-grid" style={{gridTemplateColumns: "1.1fr 1fr 1fr"}}>
        <div className="stat dark">
          <div className="lbl">Renda recebida</div>
          <div className="val tnum">{fmtBRL(renda)}</div>
          <div className="delta">{state.renda.length} fonte{state.renda.length === 1 ? "" : "s"} de renda</div>
        </div>
        <div className="stat">
          <div className="lbl">Total gasto</div>
          <div className="val tnum">{fmtBRL(totalGastos)}</div>
          <div className="delta tnum">
            <span className="neg">{fmtPct(comprometido, 1)}</span> da renda
          </div>
        </div>
        <div className="stat green">
          <div className="lbl">Sobra estimada</div>
          <div className="val tnum" style={{color: sobra < 0 ? "var(--red)" : "var(--green-ink)"}}>
            {fmtBRL(sobra)}
          </div>
          <div className="delta">
            {sobra >= 0
              ? <>Equivalente a <b className="tnum">{fmtPct(100 - comprometido, 1)}</b> livre</>
              : <>Você gastou mais do que recebeu</>}
          </div>
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 14}}>
        <div className="stat">
          <div className="lbl">Maior peso financeiro</div>
          <div className="val" style={{fontSize: 22}}>{heaviest?.label || "—"}</div>
          <div className="delta tnum">{fmtBRL(heaviest?.value || 0)} · {fmtPct((heaviest?.value || 0) / (renda || 1) * 100, 1)} da renda</div>
        </div>
        <div className="stat gold">
          <div className="lbl">Status do mês</div>
          <div className="val" style={{fontSize: 22, color: status.tone === "bad" ? "var(--red)" : status.tone === "warn" ? "#6E5621" : "var(--green-ink)"}}>
            {status.text}
          </div>
          <div className="delta">{comprometido.toFixed(1)}% da renda comprometida</div>
        </div>
        <div className="stat">
          <div className="lbl">Meta de economia</div>
          <div className="val tnum">{fmtBRL(state.meta)}</div>
          <div className="delta">
            {state.meta > 0 ? (sobra >= state.meta ? <span className="pos">✓ alcançada</span> : <>falta <b className="tnum">{fmtBRL(state.meta - sobra)}</b></>) : "Defina sua meta no painel"}
          </div>
        </div>
      </div>

      {/* ALLOCATION + DONUT */}
      <div className="card" style={{marginTop: 24}}>
        <div className="card-head">
          <div className="lead">
            <h3>Para onde foi seu dinheiro?</h3>
            <div className="hint">Distribuição de {fmtBRL(total)} entre categorias.</div>
          </div>
          <div className="segmented">
            <button className="on">Barra</button>
            <button>Donut</button>
          </div>
        </div>
        <div className="card-body">
          <div className="alloc">
            {groups.map((g, i) => (
              <div key={i} style={{ width: `${(g.value / total) * 100}%`, background: g.color }} title={`${g.label}: ${fmtBRL(g.value)}`} />
            ))}
          </div>
          <div className="alloc-legend">
            {groups.map((g, i) => (
              <div key={i} className="item">
                <span className="sw" style={{background: g.color}} />
                <span>{g.label}</span>
                <span className="mono dim">{fmtPct((g.value / total) * 100, 1)}</span>
                <span className="tnum" style={{color: "var(--ink-2)"}}>{fmtBRLCompact(g.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LEITURA RÁPIDA */}
      <div style={{display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginTop: 18}}>
        <div className={`banner ${status.tone}`}>
          <div className="ic" style={{color: status.tone === "bad" ? "var(--red)" : status.tone === "warn" ? "var(--gold)" : "var(--green)"}}>
            <Icon name={status.tone === "good" ? "check" : "alert"} size={14} />
          </div>
          <div>
            <h4>Leitura rápida</h4>
            <p>
              Você recebeu <b className="tnum">{fmtBRL(renda)}</b> e comprometeu{" "}
              <b className="tnum">{fmtBRL(totalGastos)}</b>. Sua sobra estimada foi de{" "}
              <b className="tnum">{fmtBRL(sobra)}</b>. O principal ponto de atenção está em{" "}
              <b>{heaviest?.label?.toLowerCase()}</b>
              {dividas > 0 ? <> e <b>dívidas</b></> : null}.
            </p>
          </div>
        </div>

        <div className="card" style={{padding: "16px 18px"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10}}>
            <h3 style={{margin: 0, fontSize: 14}}>Próximos passos</h3>
            <AgentSeal agent="Athena" />
          </div>
          <div className="col" style={{gap: 6}}>
            <Btn variant="soft" icon="diagnosis" onClick={() => go("diagnostico")}>Ver diagnóstico</Btn>
            <Btn variant="soft" icon="sim" onClick={() => go("simulacoes")}>Ver simulações</Btn>
            <Btn variant="soft" icon="brain" onClick={() => go("vault")}>Abrir Second Brain</Btn>
          </div>
        </div>
      </div>

      <div style={{marginTop: 20}}>
        <EducationalDisclaimer />
      </div>
    </div>
  );
};

// ============================================
// CLIENT VIEWER — visao limpa para usuario final
// ============================================
const ClientViewer = ({ state, apiNodes = [] }) => {
  const sum = (arr) => arr.reduce((a, b) => a + (Number(b.value) || 0), 0);
  const renda = sum(state.renda);
  const fixos = sum(state.fixos);
  const variaveis = sum(state.variaveis);
  const assinaturas = sum(state.assinaturas);
  const dividas = sum(state.dividas);
  const totalGastos = fixos + variaveis + assinaturas + dividas;
  const saldo = renda - totalGastos;
  const comprometido = renda > 0 ? (totalGastos / renda) * 100 : 0;
  const economiaPossivel = Math.max(Math.round((variaveis * 0.1 + assinaturas * 0.25) * 100) / 100, 0);
  const reservaBase = fixos + dividas;
  const reservaAlvo = reservaBase * 6;
  const mesesReserva = state.meta > 0 ? Math.ceil(reservaAlvo / state.meta) : null;

  const diagnostico = comprometido > 90
    ? "Sua renda esta muito comprometida. O foco educacional deve ser recuperar margem antes de assumir novos compromissos."
    : comprometido > 75
      ? "Sua margem existe, mas esta apertada. O ponto principal e revisar gastos recorrentes e proteger sua reserva."
      : "Sua situacao mostra margem para organizacao. O proximo passo e transformar a sobra em rotina e acompanhar desvios.";

  return (
    <div className="content client-viewer" data-testid="client-viewer">
      <div className="page-head">
        <div className="eyebrow">Visão do Cliente</div>
        <h1>Tio Patinhas — Visão do Cliente</h1>
        <div className="sub">Resumo claro da sua vida financeira, com análise educacional.</div>
      </div>

      <div className="client-card-grid">
        <ClientMetric testId="client-income-card" label="Renda mensal" value={fmtBRL(renda)} />
        <ClientMetric testId="client-expenses-card" label="Gastos totais" value={fmtBRL(totalGastos)} />
        <ClientMetric testId="client-balance-card" label="Saldo estimado" value={fmtBRL(saldo)} tone={saldo >= 0 ? "good" : "bad"} />
        <ClientMetric label="Comprometimento" value={fmtPct(comprometido, 1)} tone={comprometido > 90 ? "bad" : comprometido > 75 ? "warn" : "good"} />
      </div>

      <div className="client-section">
        <h2>Para onde seu dinheiro foi</h2>
        <div className="client-breakdown">
          <ClientBreakdown label="Gastos fixos" value={fixos} total={totalGastos} />
          <ClientBreakdown label="Gastos variáveis" value={variaveis} total={totalGastos} />
          <ClientBreakdown label="Assinaturas" value={assinaturas} total={totalGastos} />
          <ClientBreakdown label="Dívidas" value={dividas} total={totalGastos} />
        </div>
      </div>

      <div className="client-section" data-testid="client-diagnosis-section">
        <h2>Diagnóstico</h2>
        <div className="client-diagnosis">
          <p><b>Perfil financeiro:</b> {comprometido > 75 ? "atenção à margem mensal" : "margem organizada"}</p>
          <p><b>Diagnóstico principal:</b> {diagnostico}</p>
          <p><b>Ponto forte:</b> seus dados estão organizados em categorias claras.</p>
          <p><b>Ponto de atenção:</b> dívidas e gastos recorrentes devem ser acompanhados antes de qualquer decisão financeira maior.</p>
        </div>
      </div>

      <div className="client-section" data-testid="client-simulations-section">
        <h2>Simulações principais</h2>
        <div className="client-sim-grid">
          <ClientSim title="Reserva de emergência" body={`Meta educacional de ${fmtBRL(reservaAlvo)} para cobrir 6 meses de gastos essenciais.`} />
          <ClientSim title="Cenário de economia" body={`Revisões simples podem liberar cerca de ${fmtBRL(economiaPossivel)} por mês.`} />
          <ClientSim title="Juros compostos educacionais" body={`Com aportes de ${fmtBRL(state.meta)}, acompanhe cenários sem tratar isso como promessa de rentabilidade.`} />
          <ClientSim title="Impacto das dívidas" body={`As dívidas representam ${fmtPct(renda > 0 ? (dividas / renda) * 100 : 0, 1)} da renda mensal.`} />
        </div>
        {mesesReserva && (
          <p className="muted" style={{fontSize: 13, marginTop: 12}}>
            Com a meta atual, a reserva estimada levaria cerca de {mesesReserva} meses, sem considerar rentabilidade.
          </p>
        )}
      </div>

      <div className="client-section">
        <h2>Próximas ações</h2>
        <ol className="client-actions">
          <li>Revisar os gastos variáveis da semana e definir um limite simples.</li>
          <li>Conferir assinaturas recorrentes e manter apenas as que têm uso claro.</li>
          <li>Separar a meta mensal antes de novos gastos não essenciais.</li>
        </ol>
      </div>

      {apiNodes.length > 0 && (
        <div className="client-saved">
          Análise salva no Second Brain.
        </div>
      )}

      <div data-testid="client-disclaimer">
        <EducationalDisclaimer />
      </div>
    </div>
  );
};

const ClientMetric = ({ label, value, tone, testId }) => (
  <div className={`client-metric ${tone || ""}`} data-testid={testId}>
    <div className="label">{label}</div>
    <div className="value tnum">{value}</div>
  </div>
);

const ClientBreakdown = ({ label, value, total }) => {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="client-break-row">
      <div>
        <b>{label}</b>
        <span>{fmtPct(pct, 1)} dos gastos</span>
      </div>
      <strong className="tnum">{fmtBRL(value)}</strong>
    </div>
  );
};

const ClientSim = ({ title, body }) => (
  <div className="client-sim">
    <h3>{title}</h3>
    <p>{body}</p>
  </div>
);

Object.assign(window, { PainelScreen, DashboardScreen, ClientViewer });
