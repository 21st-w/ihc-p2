/* global React, ReactDOM */
// Tio Patinhas — App shell & router

const { useState, useEffect, useMemo } = React;

const INITIAL_STATE = {
  renda: [{ id: "r0", name: "Salário", value: 5000 }],
  fixos: [
    { id: "f1", name: "Aluguel",   value: 1200 },
    { id: "f2", name: "Energia",   value: 220  },
    { id: "f3", name: "Internet",  value: 130  },
    { id: "f4", name: "Água",      value: 80   },
    { id: "f5", name: "Transporte fixo", value: 170 },
  ],
  variaveis: [
    { id: "v1", name: "Mercado",          value: 620 },
    { id: "v2", name: "Alimentação fora", value: 180 },
    { id: "v3", name: "Lazer",            value: 180 },
  ],
  assinaturas: [
    { id: "a1", name: "Netflix",  value: 55  },
    { id: "a2", name: "Spotify",  value: 25  },
    { id: "a3", name: "Academia", value: 99  },
  ],
  dividas: [
    { id: "d1", name: "Cartão de crédito", value: 720 },
    { id: "d2", name: "Empréstimo",        value: 500 },
  ],
  meta: 800,
};

const EMPTY_STATE = {
  renda: [{ id: "r0", name: "Salário", value: 0 }],
  fixos: [{ id: "f1", name: "Aluguel", value: 0 }, { id: "f2", name: "Energia", value: 0 }, { id: "f3", name: "Internet", value: 0 }],
  variaveis: [{ id: "v1", name: "Mercado", value: 0 }, { id: "v2", name: "Lazer", value: 0 }],
  assinaturas: [{ id: "a1", name: "Streaming", value: 0 }],
  dividas: [{ id: "d1", name: "Cartão de crédito", value: 0 }],
  meta: 0,
};

const NAV = [
  { group: "Principal", items: [
    { id: "painel",     label: "Painel",       icon: "panel"     },
    { id: "dashboard",  label: "Dashboard",    icon: "dashboard" },
  ]},
  { group: "Análise", items: [
    { id: "diagnostico", label: "Diagnóstico", icon: "diagnosis" },
    { id: "simulacoes",  label: "Simulações",  icon: "sim"       },
  ]},
  { group: "Conhecimento", items: [
    { id: "ia",        label: "IA Financeira", icon: "spark"    },
    { id: "vault",     label: "Second Brain", icon: "brain"    },
    { id: "skills",    label: "Skills",       icon: "skill"    },
    { id: "eventos",   label: "Eventos",      icon: "events"   },
    { id: "obsidian",  label: "Obsidian",     icon: "obsidian" },
  ]},
  { group: "Outros", items: [
    { id: "vazio",     label: "Estado vazio", icon: "file"  },
    { id: "mobile",    label: "Mobile",       icon: "spark" },
  ]},
];

const CRUMBS = {
  painel:      ["Workspace", "Painel"],
  dashboard:   ["Workspace", "Dashboard"],
  diagnostico: ["Análise", "Diagnóstico"],
  simulacoes:  ["Análise", "Simulações"],
  ia:          ["Conhecimento", "IA Financeira"],
  vault:       ["Conhecimento", "Second Brain"],
  skills:      ["Conhecimento", "Skills"],
  eventos:     ["Conhecimento", "Eventos"],
  obsidian:    ["Configurações", "Obsidian"],
  vazio:       ["Workspace", "Estado vazio"],
  mobile:      ["Design", "Mobile"],
};

const RISK_MAP = { "Baixa": "conservador", "Média": "moderado", "Alta": "arrojado" };

function App() {
  const [stage, setStage] = useState("landing"); // landing | onboarding | app
  const [page, setPage] = useState("painel");
  const [data, setData] = useState(INITIAL_STATE);
  const [toastMsg, setToastMsg] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [saveModal, setSaveModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [apiNodes, setApiNodes] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [clientMode, setClientMode] = useState(false);

  const toast = (m) => setToastMsg(m);

  const handleAnalyze = async () => {
    setPage("dashboard");
    if (!userId) {
      toast("Análise gerada · dados locais.");
      return;
    }
    setAnalyzing(true);
    try {
      const sum = (arr) => arr.reduce((a, b) => a + (Number(b.value) || 0), 0);
      await api.saveProfile(userId, {
        monthly_income: sum(data.renda),
        fixed_expenses: sum(data.fixos),
        variable_expenses: sum(data.variaveis),
        subscriptions: sum(data.assinaturas),
        debts: sum(data.dividas),
        financial_goal: userInfo ? userInfo.goal || "" : "",
        desired_monthly_saving: data.meta,
        risk_tolerance: RISK_MAP[userInfo ? userInfo.risk : undefined] || "moderado",
      });
      const result = await api.runFullAnalysis(userId);
      const nodes = await api.getNodes(userId);
      setApiNodes(nodes);
      toast(`Análise gerada · ${nodes.length} nodo(s) no Obsidian.`);
    } catch (e) {
      toast("Análise gerada localmente.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = () => {
    setSaveModal(false);
    toast(apiNodes.length > 0 ? `${apiNodes.length} nodos salvos no Obsidian.` : "Salvo no Obsidian · vault local.");
  };

  // Stage: Landing
  if (stage === "landing") {
    return (
      <>
        <LandingScreen
          onStart={() => {
            setShowOnboarding(true);
            setStage("onboarding");
          }}
          onExample={() => {
            setStage("app");
            setPage("dashboard");
          }}
        />
        <Toast message={toastMsg} onDone={() => setToastMsg("")} />
      </>
    );
  }

  // Stage: Onboarding
  if (stage === "onboarding") {
    return (
      <>
        <OnboardingScreen onDone={async (onbData) => {
          setStage("app");
          setShowDisclaimer(true);
          setPage("painel");
          setData(EMPTY_STATE);
          if (onbData && onbData.email && onbData.name) {
            setUserInfo(onbData);
            try {
              const user = await api.createOrGetUser(onbData.name, onbData.email);
              setUserId(user.id);
            } catch (e) { /* continue offline */ }
          }
        }} />
        <DisclaimerModal
          open={showDisclaimer}
          onAccept={() => setShowDisclaimer(false)}
          onClose={() => setShowDisclaimer(false)}
        />
      </>
    );
  }

  // Stage: App
  return (
    <div className={clientMode ? "app client-app" : "app"}>
      {!clientMode && <Sidebar page={page} setPage={setPage} onHome={() => setStage("landing")} />}
      <div className="main">
        <Topbar
          page={page}
          setStage={setStage}
          clientMode={clientMode}
          setClientMode={setClientMode}
        />
        {clientMode ? (
          <ClientViewer
            state={data}
            setState={setData}
            apiNodes={apiNodes}
            userId={userId}
            toast={toast}
            onExit={() => setClientMode(false)}
          />
        ) : (
          <Pages
            page={page}
            state={data}
            setState={setData}
            go={setPage}
            onAnalyze={handleAnalyze}
            openSave={() => setSaveModal(true)}
            toast={toast}
            apiNodes={apiNodes}
            userId={userId}
          />
        )}
      </div>

      <Toast message={toastMsg} onDone={() => setToastMsg("")} />

      <Modal open={saveModal} onClose={() => setSaveModal(false)}>
        <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 12}}>
          <span style={{width: 32, height: 32, borderRadius: 8, background: "var(--card-muted)", color: "var(--navy)", display: "grid", placeItems: "center"}}>
            <Icon name="obsidian" size={16} />
          </span>
          <div style={{fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-4)"}}>Salvar no Obsidian</div>
        </div>
        <h2 style={{fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 24, letterSpacing: -0.3, margin: "0 0 6px"}}>Gerar nodo do mês</h2>
        <p className="muted" style={{margin: "0 0 16px", fontSize: 13.5}}>
          Vamos criar arquivos Markdown auditáveis no seu vault local, com frontmatter YAML e links entre nodos.
        </p>
        <div style={{background: "var(--card-muted)", borderRadius: 10, padding: 12, marginBottom: 16}}>
          <div className="mono" style={{fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.7}}>
            obsidian-vault/<br />
            └── usuarios/maria/diagnosticos/<br />
            &nbsp;&nbsp;&nbsp;&nbsp;└── 2025-11-diagnostico.md ← <span style={{color: "var(--gold)"}}>novo</span>
          </div>
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 8, marginBottom: 18}}>
          {[
            { l: "Diagnóstico do mês", e: "DIAGNOSIS_CREATED", a: "Freud" },
            { l: "Resumo financeiro",  e: "FINANCIAL_SUMMARY_CALCULATED", a: "Moriarty" },
            { l: "Plano educacional",  e: "NODE_CREATED", a: "Athena" },
          ].map((x, i) => (
            <label key={i} style={{display: "flex", gap: 10, alignItems: "center", padding: "8px 12px", background: "#fff", border: "1px solid var(--border)", borderRadius: 8}}>
              <input type="checkbox" defaultChecked />
              <div style={{flex: 1, fontSize: 13}}>{x.l}</div>
              <AgentSeal agent={x.a} />
            </label>
          ))}
        </div>
        <div style={{display: "flex", gap: 10, justifyContent: "flex-end"}}>
          <Btn variant="ghost" onClick={() => setSaveModal(false)}>Cancelar</Btn>
          <Btn variant="primary" icon="check" onClick={handleSave}>Salvar 3 nodos</Btn>
        </div>
      </Modal>
    </div>
  );
}

const Sidebar = ({ page, setPage, onHome }) => (
  <aside className="sidebar">
    <div className="brand" onClick={onHome} style={{cursor: "pointer"}}>
      <div className="brand-mark">tp</div>
      <div className="brand-name">Tio Patinhas</div>
    </div>

    {NAV.map((g) => (
      <div key={g.group} className="nav-group">
        <div className="nav-label">{g.group}</div>
        {g.items.map((it) => (
          <button
            key={it.id}
            className={`nav-item ${page === it.id ? "active" : ""}`}
            onClick={() => setPage(it.id)}
          >
            <span className="nav-icon"><Icon name={it.icon} size={14} /></span>
            <span>{it.label}</span>
            {it.id === "painel" && page !== "painel" && <span className="nav-kbd">⌘1</span>}
            {it.id === "dashboard" && page !== "dashboard" && <span className="nav-kbd">⌘2</span>}
          </button>
        ))}
      </div>
    ))}

    <div className="sidebar-footer">
      <div className="obs-status">
        <span className="dot"></span>
        <span>Vault sincronizado</span>
        <span style={{marginLeft: "auto", fontSize: 10.5, color: "var(--ink-4)"}}>há 2m</span>
      </div>
      <div className="user-chip" style={{background: "#fff", border: "1px solid var(--border)"}}>
        <div className="avatar">M</div>
        <div className="meta">
          <div className="n">Maria S.</div>
          <div className="e">maria@email.com</div>
        </div>
      </div>
    </div>
  </aside>
);

const Topbar = ({ page, setStage, clientMode, setClientMode }) => {
  const crumbs = clientMode ? ["Visão do Cliente"] : (CRUMBS[page] || []);
  return (
    <div className="topbar">
      <div className="crumbs">
        <button onClick={() => setStage("landing")} style={{cursor: "pointer", color: "var(--ink-4)"}}>Início</button>
        {crumbs.map((c, i) => (
          <span key={i} style={{display: "inline-flex", alignItems: "center", gap: 6}}>
            <span className="sep">/</span>
            <span className={i === crumbs.length - 1 ? "cur" : ""}>{c}</span>
          </span>
        ))}
      </div>
      <div className="spacer"></div>
      <span className="month-pill">
        <span className="dot"></span>
        Novembro 2025
      </span>
      <button
        className="btn btn-soft"
        data-testid={clientMode ? "btn-full-mode" : "btn-client-mode"}
        onClick={() => setClientMode(!clientMode)}
      >
        <Icon name="eye" size={14} />
        {clientMode ? "Modo Completo" : "Modo Cliente"}
      </button>
      <button className="btn btn-icon btn-soft" title="Buscar"><Icon name="search" size={14} /></button>
      <button className="btn btn-icon btn-soft" title="Notificações"><Icon name="bell" size={14} /></button>
    </div>
  );
};

const Pages = ({ page, state, setState, go, onAnalyze, openSave, toast, apiNodes, userId }) => {
  switch (page) {
    case "painel":      return <PainelScreen state={state} setState={setState} onAnalyze={onAnalyze} />;
    case "dashboard":   return <DashboardScreen state={state} go={go} openSave={openSave} />;
    case "diagnostico": return <DiagnosticoScreen state={state} go={go} openSave={openSave} />;
    case "simulacoes":  return <SimulacoesScreen state={state} go={go} openSave={openSave} />;
    case "ia":          return <AIFinanceiraScreen state={state} userId={userId} toast={toast} />;
    case "vault":       return <VaultScreen go={go} toast={toast} apiNodes={apiNodes} userId={userId} />;
    case "skills":      return <SkillsScreen go={go} toast={toast} />;
    case "eventos":     return <EventosScreen go={go} />;
    case "obsidian":    return <ObsidianScreen toast={toast} />;
    case "vazio":       return <EmptyStateScreen go={go} />;
    case "mobile":      return <MobileScreen />;
    default:            return <PainelScreen state={state} setState={setState} onAnalyze={onAnalyze} />;
  }
};

const AI_SUGGESTED_QUESTIONS = [
  "Por que meu dinheiro acabou este mês?",
  "Onde estou gastando demais?",
  "Minhas assinaturas estão pesando?",
  "Quanto falta para minha reserva de emergência?",
  "Quais gastos posso revisar?",
  "O que meus nodos dizem sobre meu perfil financeiro?",
];

const buildLocalAIResponse = (state) => {
  const sum = (arr) => arr.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  const categories = [
    { name: "gastos fixos", value: sum(state.fixos) },
    { name: "gastos variáveis", value: sum(state.variaveis) },
    { name: "assinaturas", value: sum(state.assinaturas) },
    { name: "dívidas", value: sum(state.dividas) },
  ];
  const renda = sum(state.renda);
  const total = categories.reduce((acc, item) => acc + item.value, 0);
  const saldo = renda - total;
  const maior = categories.reduce((max, item) => item.value > max.value ? item : max, categories[0]);
  return (
    `Com base nos dados preenchidos, sua renda estimada é ${fmtBRL(renda)}, seus gastos totais são ${fmtBRL(total)} ` +
    `e seu saldo é ${fmtBRL(saldo)}. A maior categoria de gasto parece ser ${maior.name}, com ${fmtBRL(maior.value)}. ` +
    "A IA está indisponível no momento, então esta é uma análise local simplificada.\n\n" +
    "Análise educacional. Não representa recomendação de investimento."
  );
};

const AIFinanceiraScreen = ({ state, userId, toast }) => {
  const [status, setStatus] = useState(null);
  const [question, setQuestion] = useState(AI_SUGGESTED_QUESTIONS[0]);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [disclaimer, setDisclaimer] = useState("Análise educacional. Não representa recomendação de investimento.");
  const [loading, setLoading] = useState(false);
  const [reindexing, setReindexing] = useState(false);

  useEffect(() => {
    let alive = true;
    api.getAIStatus()
      .then((data) => { if (alive) setStatus(data); })
      .catch(() => {
        if (alive) setStatus({ ai_enabled: false, ollama_available: false, message: "IA indisponível no momento." });
      });
    return () => { alive = false; };
  }, []);

  const ask = async (nextQuestion) => {
    const finalQuestion = (nextQuestion || question || "").trim();
    if (!finalQuestion) return;
    setQuestion(finalQuestion);
    setSources([]);
    if (!userId) {
      setAnswer("Crie ou selecione um usuário para usar a IA com dados personalizados.");
      return;
    }
    setLoading(true);
    try {
      const result = await api.askAI(userId, finalQuestion);
      setAnswer(result.answer || "");
      setSources(result.sources || []);
      setDisclaimer(result.educational_disclaimer || "Análise educacional. Não representa recomendação de investimento.");
    } catch (e) {
      setAnswer(buildLocalAIResponse(state));
      setSources([]);
      setDisclaimer("Análise educacional. Não representa recomendação de investimento.");
    } finally {
      setLoading(false);
    }
  };

  const reindex = async () => {
    if (!userId) {
      setAnswer("Crie ou selecione um usuário para indexar seus nodos.");
      return;
    }
    setReindexing(true);
    try {
      const result = await api.reindexAI(userId);
      toast(result.message || "Nodos reindexados para IA.");
    } catch (e) {
      toast("A IA está indisponível no momento. Você ainda pode usar o diagnóstico local e as simulações determinísticas.");
    } finally {
      setReindexing(false);
    }
  };

  return (
    <div className="content">
      <div className="page-head" style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
        <div>
          <div className="eyebrow">IA Financeira</div>
          <h1>Converse com a IA educacional</h1>
          <div className="sub">Pergunte sobre seu orçamento, diagnósticos, simulações e nodos do Second Brain.</div>
        </div>
        <button className="btn btn-soft" data-testid="ai-reindex" onClick={reindex} disabled={reindexing}>
          <Icon name="brain" size={14} />
          {reindexing ? "Indexando..." : "Reindexar nodos"}
        </button>
      </div>

      <div className="card" style={{marginBottom: 16}}>
        <div className="card-body" data-testid="ai-status" style={{display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap"}}>
          <span className={`tag ${status && status.ollama_available ? "green" : "gold"}`}>
            {status && status.ollama_available ? "Ollama online" : "Fallback local ativo"}
          </span>
          <span className="muted" style={{fontSize: 13}}>
            {status ? status.message : "Verificando status da IA..."}
          </span>
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 18}}>
        <div className="card">
          <div className="card-head">
            <div className="lead">
              <h3>Pergunta</h3>
              <div className="hint">A resposta é educacional e usa seus dados quando há usuário selecionado.</div>
            </div>
          </div>
          <div className="card-body">
            <textarea
              className="input"
              data-testid="ai-question-input"
              rows="4"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite sua pergunta financeira educacional"
              style={{width: "100%", resize: "vertical", lineHeight: 1.5}}
            />
            <div style={{display: "flex", gap: 10, marginTop: 12, alignItems: "center"}}>
              <button className="btn btn-primary" data-testid="ai-submit" onClick={() => ask()} disabled={loading}>
                <Icon name="spark" size={14} />
                {loading ? "Pensando..." : "Perguntar à IA"}
              </button>
              {!userId && <span className="muted" style={{fontSize: 12.5}}>Crie ou selecione um usuário para dados personalizados.</span>}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="lead">
              <h3>Perguntas sugeridas</h3>
              <div className="hint">Atalhos para investigar seu mês.</div>
            </div>
          </div>
          <div className="card-body" style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
            {AI_SUGGESTED_QUESTIONS.map((item) => (
              <button
                key={item}
                className="btn btn-soft"
                data-testid="ai-suggested-question"
                onClick={() => ask(item)}
                disabled={loading}
                style={{fontSize: 12}}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop: 18}}>
        <div className="card-head">
          <div className="lead">
            <h3>Resposta</h3>
            <div className="hint">Sem recomendação de compra ou venda de ativos.</div>
          </div>
        </div>
        <div className="card-body">
          <div data-testid="ai-answer" style={{whiteSpace: "pre-wrap", lineHeight: 1.65, fontSize: 14}}>
            {answer || "Faça uma pergunta para ver a resposta da IA Financeira."}
          </div>
        </div>
        <div className="card-foot">
          <div data-testid="ai-disclaimer" style={{fontSize: 12.5, color: "var(--ink-3)"}}>{disclaimer}</div>
        </div>
      </div>

      <div className="card" style={{marginTop: 18}}>
        <div className="card-head">
          <div className="lead">
            <h3>Fontes usadas</h3>
            <div className="hint">Nodos recuperados quando disponíveis.</div>
          </div>
        </div>
        <div className="card-body" data-testid="ai-sources">
          {sources.length === 0 ? (
            <div className="muted" style={{fontSize: 13}}>Nenhuma fonte recuperada para esta resposta.</div>
          ) : sources.map((source, idx) => (
            <div key={`${source.path}-${idx}`} style={{padding: "10px 0", borderBottom: idx < sources.length - 1 ? "1px solid var(--divider)" : "none"}}>
              <div style={{fontWeight: 600, fontSize: 13.5}}>{source.title}</div>
              <div className="mono" style={{fontSize: 11.5, color: "var(--ink-4)", marginTop: 4}}>
                {source.type} · score {source.score} · {source.path}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
