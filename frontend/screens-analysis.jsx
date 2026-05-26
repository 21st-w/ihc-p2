/* global React */
// Tio Patinhas — Diagnóstico + Simulações + Aviso

const { useState: useS_an, useMemo: useM_an } = React;

// ============================================
// DIAGNÓSTICO — Screen 5
// ============================================
const DiagnosticoScreen = ({ state, go, openSave }) => {
  const sum = (a) => a.reduce((x, y) => x + (Number(y.value) || 0), 0);
  const renda = sum(state.renda);
  const fixos = sum(state.fixos);
  const variaveis = sum(state.variaveis);
  const assinaturas = sum(state.assinaturas);
  const dividas = sum(state.dividas);
  const totalGastos = fixos + variaveis + assinaturas + dividas;
  const sobra = renda - totalGastos;
  const comprometido = renda > 0 ? (totalGastos / renda) * 100 : 0;

  const perfil = comprometido > 90 ? "Perfil de margem crítica"
              : comprometido > 75 ? "Perfil de baixa margem de segurança"
              : comprometido > 50 ? "Perfil de margem moderada"
              : "Perfil de margem saudável";

  return (
    <div className="content">
      <div className="page-head" style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
        <div>
          <div className="eyebrow">Análise · Novembro 2025</div>
          <h1>Diagnóstico financeiro</h1>
          <div className="sub" style={{marginTop: 6}}>
            <AgentSeal agent="Freud" event="MONTHLY_PANEL_SUBMITTED" />
          </div>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <Btn variant="ghost" icon="arrow" onClick={() => go("dashboard")}>Voltar ao dashboard</Btn>
          <Btn variant="primary" icon="obsidian" onClick={openSave}>Gerar nodo no Obsidian</Btn>
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18}}>
        {/* LEFT */}
        <div className="col" style={{gap: 14}}>
          <div className="diag-card">
            <h4>Perfil do mês</h4>
            <div className="text" style={{fontSize: 22, letterSpacing: -0.3}}>{perfil}</div>
            <div style={{display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap"}}>
              <span className="tag navy">comprometimento {fmtPct(comprometido, 1)}</span>
              <span className="tag green">sobra {fmtBRL(sobra)}</span>
              <span className="tag gold">renda {fmtBRL(renda)}</span>
            </div>
          </div>

          <div className="diag-card">
            <h4>Resumo</h4>
            <div className="text">
              Seu mês mostra que <b>grande parte da renda está comprometida</b> antes da formação de uma reserva.
              Isso reduz sua flexibilidade e aumenta o risco de depender de crédito em imprevistos. Dos
              {" "}{fmtBRL(renda)} recebidos, {fmtBRL(totalGastos)} já estão alocados em gastos recorrentes,
              variáveis, assinaturas e dívidas.
            </div>
          </div>

          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
            <div className="diag-card green">
              <h4>Pontos fortes</h4>
              <ul>
                <li><span className="b"><Icon name="check" size={11} /></span><span>Você informou sua renda e gastos de forma organizada.</span></li>
                <li><span className="b"><Icon name="check" size={11} /></span><span>Existe sobra mensal {sobra >= 0 ? "positiva" : "monitorada e auditável"}.</span></li>
                <li><span className="b"><Icon name="check" size={11} /></span><span>Há potencial claro para revisar gastos recorrentes.</span></li>
              </ul>
            </div>
            <div className="diag-card warn">
              <h4>Pontos de atenção</h4>
              <ul>
                <li><span className="b"><Icon name="alert" size={11} /></span><span>Gastos fixos somam {fmtBRL(fixos)} — peso elevado na renda.</span></li>
                <li><span className="b"><Icon name="alert" size={11} /></span><span>Dívidas ocupam {fmtPct(renda > 0 ? (dividas / renda) * 100 : 0, 1)} da renda.</span></li>
                <li><span className="b"><Icon name="alert" size={11} /></span><span>Assinaturas podem estar reduzindo a margem.</span></li>
                <li><span className="b"><Icon name="alert" size={11} /></span><span>Reserva de emergência ainda não está clara.</span></li>
              </ul>
            </div>
          </div>

          <div className="diag-card" style={{borderColor: "var(--navy)", background: "#F4F7FB"}}>
            <h4 style={{color: "var(--navy)"}}>Próximo passo educacional</h4>
            <div className="text">
              Antes de pensar em investimentos, o foco educacional deve ser <b>entender sua sobra real</b>,
              revisar gastos recorrentes e definir uma meta de reserva de emergência.
            </div>
            <div style={{display: "flex", gap: 8, marginTop: 14}}>
              <Btn variant="soft" icon="sim" onClick={() => go("simulacoes")}>Ver simulações</Btn>
              <Btn variant="soft" icon="brain" onClick={() => go("vault")}>Ver no Second Brain</Btn>
            </div>
          </div>

          <EducationalDisclaimer />
        </div>

        {/* RIGHT — agent panel */}
        <div className="col" style={{gap: 14}}>
          <div className="card">
            <div className="card-head">
              <div className="lead">
                <h3>Análise por agente</h3>
                <div className="hint">Como cada agente interpreta seu mês.</div>
              </div>
            </div>
            <div className="card-body" style={{padding: 0}}>
              <AgentRow agent="Freud" status="diagnóstico gerado" desc="Identifica padrões comportamentais e risco psicológico do mês." />
              <AgentRow agent="Moriarty" status="simulações disponíveis" desc="Faz os cálculos de reserva, juros e cenários." />
              <AgentRow agent="Athena" status="nodos prontos" desc="Organiza tudo no vault como conhecimento auditável." />
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="lead">
                <h3>Eventos gerados</h3>
                <div className="hint">Esta análise disparou os eventos abaixo.</div>
              </div>
            </div>
            <div className="card-body" style={{padding: "10px 18px 14px"}}>
              <EventLine code="MONTHLY_PANEL_SUBMITTED" />
              <EventLine code="FINANCIAL_SUMMARY_CALCULATED" />
              <EventLine code="DIAGNOSIS_CREATED" />
              <EventLine code="NODE_CREATED" />
            </div>
            <div className="card-foot">
              <Btn variant="link" icon="events" onClick={() => go("eventos")}>Ver linha do tempo completa</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentRow = ({ agent, status, desc }) => (
  <div style={{display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid var(--divider)"}}>
    <AgentSeal agent={agent} />
    <div style={{flex: 1}}>
      <div style={{fontSize: 12.5, color: "var(--ink-3)"}}>{desc}</div>
    </div>
    <span className="tag green">{status}</span>
  </div>
);

const EventLine = ({ code }) => (
  <div style={{display: "flex", alignItems: "center", gap: 8, padding: "6px 0"}}>
    <span style={{width: 6, height: 6, borderRadius: "50%", background: "var(--gold)"}}></span>
    <span className="mono" style={{fontSize: 11.5, color: "var(--navy)"}}>{code}</span>
  </div>
);

// ============================================
// SIMULAÇÕES — Screen 6
// ============================================
const SimulacoesScreen = ({ state, go, openSave }) => {
  const sum = (a) => a.reduce((x, y) => x + (Number(y.value) || 0), 0);
  const renda = sum(state.renda);
  const fixos = sum(state.fixos);
  const variaveis = sum(state.variaveis);
  const assinaturas = sum(state.assinaturas);
  const dividas = sum(state.dividas);
  const totalGastos = fixos + variaveis + assinaturas + dividas;
  const sobra = renda - totalGastos;
  const comprometido = renda > 0 ? (totalGastos / renda) * 100 : 0;

  // Reserva
  const gastoEssencial = fixos + dividas;
  const reservaRecomendada = gastoEssencial * 6;
  const [aporte, setAporte] = useS_an(Math.max(sobra > 0 ? Math.floor(sobra * 0.5) : 200, 100));
  const mesesReserva = aporte > 0 ? Math.ceil(reservaRecomendada / aporte) : 0;

  // Cenário melhorado
  const [reducao, setReducao] = useS_an(200);
  const sobraMelhorada = sobra + reducao;
  const compMelhorado = renda > 0 ? ((totalGastos - reducao) / renda) * 100 : 0;

  // Juros
  const [taxaMensal, setTaxaMensal] = useS_an(0.7);
  const [prazo, setPrazo] = useS_an(24);
  const i = taxaMensal / 100;
  const fv = aporte * ((Math.pow(1 + i, prazo) - 1) / (i || 1));

  return (
    <div className="content">
      <div className="page-head" style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
        <div>
          <div className="eyebrow">Simulações</div>
          <h1>Simulações educacionais</h1>
          <div className="sub" style={{marginTop: 6}}>
            <AgentSeal agent="Moriarty" event="SIMULATION_CREATED" />
          </div>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <Btn variant="ghost" icon="arrow" onClick={() => go("dashboard")}>Voltar ao dashboard</Btn>
          <Btn variant="primary" icon="obsidian" onClick={openSave}>Salvar simulação no Obsidian</Btn>
        </div>
      </div>

      {/* 1 — Reserva de emergência */}
      <div className="card" style={{marginBottom: 18}}>
        <div className="card-head">
          <div className="lead">
            <h3>1 · Reserva de emergência</h3>
            <div className="hint">Quanto tempo até cobrir 6 meses dos seus gastos essenciais.</div>
          </div>
          <span className="tag navy">premissa: 6× gasto essencial</span>
        </div>
        <div className="card-body" style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.2fr", gap: 18, alignItems: "end"}}>
          <KV label="Gasto mensal essencial" value={fmtBRL(gastoEssencial)} sub="fixos + dívidas" />
          <KV label="Reserva recomendada" value={fmtBRL(reservaRecomendada)} sub="6 × essencial" />
          <div>
            <div style={{fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 6}}>Economia mensal</div>
            <MoneyInput value={aporte} onChange={setAporte} />
          </div>
          <div className="card-muted" style={{background: "var(--green-soft)", borderRadius: 10, padding: "12px 14px"}}>
            <div style={{fontSize: 11, color: "var(--green-ink)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Tempo estimado</div>
            <div className="serif tnum" style={{fontSize: 26, letterSpacing: -0.3, color: "var(--green-ink)"}}>
              {mesesReserva} {mesesReserva === 1 ? "mês" : "meses"}
            </div>
            <div style={{fontSize: 12, color: "var(--green-ink)", opacity: 0.8}}>
              ≈ {Math.floor(mesesReserva / 12) > 0 ? `${Math.floor(mesesReserva / 12)} ano(s) ` : ""}
              {mesesReserva % 12} mês{mesesReserva % 12 === 1 ? "" : "es"}
            </div>
          </div>
        </div>
        <div className="card-foot" style={{fontSize: 12.5, color: "var(--ink-3)"}}>
          Com economia mensal de <b className="tnum">{fmtBRL(aporte)}</b>, você levaria cerca de{" "}
          <b>{mesesReserva} {mesesReserva === 1 ? "mês" : "meses"}</b> para formar uma reserva de{" "}
          <b className="tnum">{fmtBRL(reservaRecomendada)}</b>.
        </div>
      </div>

      {/* 2 — Cenário atual vs melhorado */}
      <div className="card" style={{marginBottom: 18}}>
        <div className="card-head">
          <div className="lead">
            <h3>2 · Cenário atual vs cenário melhorado</h3>
            <div className="hint">Quanto sua margem mudaria reduzindo gastos recorrentes.</div>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 10}}>
            <span style={{fontSize: 12, color: "var(--ink-3)"}}>Reduzir gastos em</span>
            <div style={{width: 130}}>
              <MoneyInput value={reducao} onChange={setReducao} />
            </div>
          </div>
        </div>
        <div className="card-body" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
          <ScenarioCard
            title="Cenário atual"
            sobra={sobra}
            comp={comprometido}
            tone="muted"
          />
          <ScenarioCard
            title={`Reduzindo ${fmtBRL(reducao)} em recorrentes`}
            sobra={sobraMelhorada}
            comp={compMelhorado}
            tone="good"
            delta={{
              sobra: sobraMelhorada - sobra,
              comp: compMelhorado - comprometido,
            }}
          />
        </div>
      </div>

      {/* 3 — Juros compostos educacional */}
      <div className="card">
        <div className="card-head">
          <div className="lead">
            <h3>3 · Juros compostos · educacional</h3>
            <div className="hint">Simulação didática. Não representa rentabilidade real.</div>
          </div>
          <span className="tag gold">premissa: taxa hipotética</span>
        </div>
        <div className="card-body" style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.4fr", gap: 18, alignItems: "end"}}>
          <div>
            <div style={{fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 6}}>Aporte mensal</div>
            <MoneyInput value={aporte} onChange={setAporte} />
          </div>
          <div>
            <div style={{fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 6}}>Taxa mensal (%)</div>
            <input className="input" value={taxaMensal} type="number" step="0.1" onChange={(e) => setTaxaMensal(parseFloat(e.target.value || 0))} />
          </div>
          <div>
            <div style={{fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 6}}>Prazo (meses)</div>
            <input className="input" value={prazo} type="number" onChange={(e) => setPrazo(parseInt(e.target.value || 0))} />
          </div>
          <div className="card-muted" style={{background: "var(--gold-soft)", borderRadius: 10, padding: "12px 14px"}}>
            <div style={{fontSize: 11, color: "#6E5621", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Resultado estimado</div>
            <div className="serif tnum" style={{fontSize: 26, letterSpacing: -0.3, color: "#6E5621"}}>
              {fmtBRL(fv || 0)}
            </div>
            <div style={{fontSize: 12, color: "#6E5621", opacity: 0.85}}>
              em {prazo} meses · taxa {taxaMensal.toString().replace(".", ",")}%/mês
            </div>
          </div>
        </div>
        <div className="card-foot" style={{justifyContent: "space-between"}}>
          <div className="muted" style={{fontSize: 12, display: "flex", alignItems: "center", gap: 6}}>
            <Icon name="alert" size={12} /> Taxa hipotética usada apenas para fins educacionais.
          </div>
          <Btn variant="link" icon="skill" onClick={() => go("skills")}>Criar skill desta simulação</Btn>
        </div>
      </div>

      <div style={{marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <EducationalDisclaimer />
      </div>
    </div>
  );
};

const KV = ({ label, value, sub }) => (
  <div>
    <div style={{fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4}}>{label}</div>
    <div className="serif tnum" style={{fontSize: 22, letterSpacing: -0.3}}>{value}</div>
    {sub && <div className="dim" style={{fontSize: 11.5, marginTop: 2}}>{sub}</div>}
  </div>
);

const ScenarioCard = ({ title, sobra, comp, tone, delta }) => {
  const bg = tone === "good" ? "var(--green-soft)" : "var(--card-muted)";
  const ink = tone === "good" ? "var(--green-ink)" : "var(--ink)";
  return (
    <div style={{background: bg, borderRadius: 12, padding: "16px 18px", border: "1px solid var(--border)"}}>
      <div style={{fontSize: 12.5, color: "var(--ink-3)", marginBottom: 10}}>{title}</div>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
        <div>
          <div style={{fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Sobra</div>
          <div className="serif tnum" style={{fontSize: 24, letterSpacing: -0.3, color: ink}}>{fmtBRL(sobra)}</div>
          {delta && <div style={{fontSize: 11.5, color: "var(--green)"}} className="tnum">+ {fmtBRL(delta.sobra)}</div>}
        </div>
        <div>
          <div style={{fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Comprometido</div>
          <div className="serif tnum" style={{fontSize: 24, letterSpacing: -0.3, color: ink}}>{fmtPct(comp, 1)}</div>
          {delta && <div style={{fontSize: 11.5, color: "var(--green)"}} className="tnum">{delta.comp.toFixed(1).replace(".", ",")} pp</div>}
        </div>
      </div>
    </div>
  );
};

// ============================================
// AVISO EDUCACIONAL — Screen 11 (modal)
// ============================================
const DisclaimerModal = ({ open, onAccept, onClose }) => {
  const [checked, setChecked] = useS_an(false);
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 12}}>
        <span style={{width: 32, height: 32, borderRadius: 8, background: "var(--gold-soft)", color: "var(--gold)", display: "grid", placeItems: "center"}}>
          <Icon name="alert" size={16} />
        </span>
        <div style={{fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-4)"}}>Antes de continuar</div>
      </div>
      <h2>O Tio Patinhas é uma ferramenta educacional.</h2>
      <p style={{color: "var(--ink-3)", fontSize: 13.5, lineHeight: 1.55, margin: "0 0 14px"}}>
        Ele não é uma corretora, consultoria financeira, casa de análise ou recomendador de
        investimentos. Use-o para organizar sua vida financeira com clareza.
      </p>
      <ul style={{listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: 8}}>
        {[
          "Não recomendamos compra ou venda de ativos;",
          "Não prometemos rentabilidade;",
          "Não indicamos carteira de investimentos;",
          "As simulações usam premissas informadas;",
          "As análises servem para educação e organização financeira.",
        ].map((t, i) => (
          <li key={i} style={{display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13}}>
            <span style={{width: 16, height: 16, borderRadius: 4, background: "var(--card-muted)", color: "var(--ink-3)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 2}}>
              <Icon name="check" size={11} />
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <label style={{display: "flex", gap: 10, alignItems: "flex-start", padding: "12px", background: "var(--card-muted)", borderRadius: 10, cursor: "pointer"}}>
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} style={{marginTop: 2}} />
        <span style={{fontSize: 13}}>Entendi que as análises são educacionais e não representam recomendação de investimento.</span>
      </label>
      <div style={{display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18}}>
        <Btn variant="ghost" onClick={onClose}>Voltar</Btn>
        <Btn variant="primary" onClick={onAccept} style={{opacity: checked ? 1 : 0.5, pointerEvents: checked ? "auto" : "none"}}>Continuar</Btn>
      </div>
    </Modal>
  );
};

Object.assign(window, { DiagnosticoScreen, SimulacoesScreen, DisclaimerModal });
