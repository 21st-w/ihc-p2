/* global React */
// Tio Patinhas — Second Brain / Skills / Eventos / Obsidian Config

const { useState: useS_v, useMemo: useM_v } = React;

const NODES = [
  {
    id: "n1",
    folder: "Diagnósticos",
    title: "Diagnóstico Financeiro Inicial",
    agent: "Freud",
    event: "MONTHLY_PANEL_SUBMITTED",
    date: "26 nov · 14:23",
    tags: ["#diagnostico", "#freud", "#mensal"],
    md: `---
title: "Diagnóstico Financeiro Inicial"
agent: "Freud"
type: "diagnostico"
event: "MONTHLY_PANEL_SUBMITTED"
date: "2025-11-26"
tags:
  - diagnostico
  - financeiro
  - mensal
---

# Diagnóstico Financeiro Inicial

## Perfil do mês
Perfil de **baixa margem de segurança**.

## Resumo
Grande parte da renda está comprometida antes da formação de uma reserva.
Isso reduz a flexibilidade do mês e aumenta a dependência de crédito em imprevistos.

## Pontos fortes
- Renda e gastos foram informados de forma organizada
- Existe sobra mensal positiva
- Potencial para revisar gastos recorrentes

## Pontos de atenção
- Gastos fixos representam fatia relevante da renda
- Dívidas ocupam parte importante do orçamento
- Assinaturas podem estar reduzindo a margem

## Próximo passo educacional
Antes de pensar em investimentos, entender a sobra real e
definir uma meta de reserva de emergência.

> [!warning] Aviso educacional
> Esta análise possui finalidade educacional e não representa
> recomendação de investimento.

[[Resumo Financeiro do Mês]] · [[Plano Educacional Inicial]]`
  },
  {
    id: "n2",
    folder: "Simulações",
    title: "Resumo Financeiro do Mês",
    agent: "Moriarty",
    event: "FINANCIAL_SUMMARY_CALCULATED",
    date: "26 nov · 14:22",
    tags: ["#simulacao", "#resumo", "#moriarty"],
    md: `---
title: "Resumo Financeiro do Mês"
agent: "Moriarty"
type: "simulacao"
event: "FINANCIAL_SUMMARY_CALCULATED"
tags:
  - simulacao
  - resumo
  - moriarty
---

# Resumo Financeiro do Mês

## Entradas
- Renda total: R$ 5.000

## Saídas
- Gastos fixos: R$ 1.800
- Gastos variáveis: R$ 980
- Assinaturas: R$ 180
- Dívidas: R$ 1.220

## Resultado
- Sobra estimada: **R$ 820**
- Comprometimento: **83,6%**

[[Diagnóstico Financeiro Inicial]]`
  },
  {
    id: "n3",
    folder: "Plano educacional",
    title: "Plano Educacional Inicial",
    agent: "Athena",
    event: "NODE_CREATED",
    date: "26 nov · 14:23",
    tags: ["#plano", "#athena", "#obsidian"],
    md: `---
title: "Plano Educacional Inicial"
agent: "Athena"
type: "plano"
event: "NODE_CREATED"
tags:
  - plano
  - athena
  - obsidian
---

# Plano Educacional Inicial

## Etapas sugeridas
1. Entender a sobra real (concluído)
2. Revisar gastos recorrentes
3. Definir meta de reserva de emergência
4. Mapear dívidas e prioridades de quitação
5. Estudar conceitos básicos antes de investir

[[Diagnóstico Financeiro Inicial]] · [[Resumo Financeiro do Mês]]`
  },
  {
    id: "n4",
    folder: "Skills",
    title: "Skill — Detectar baixa margem",
    agent: "Freud",
    event: "SKILL_CREATED",
    date: "26 nov · 14:24",
    tags: ["#skill", "#freud", "#margem"],
    md: `---
name: "detectar-baixa-margem-seguranca"
agent: "Freud"
trigger_event: "MONTHLY_PANEL_SUBMITTED"
status: "active"
---

# Skill: Detectar Baixa Margem de Segurança

## Objetivo
Identificar quando o usuário possui pouca sobra mensal.

## Regra inicial
Se o saldo estimado for menor que 20% da renda,
classificar como **baixa margem de segurança**.

## Saída esperada
Diagnóstico educacional e nodo no Obsidian.`
  },
];

const FOLDERS = [
  { id: "diagnosticos",    label: "Diagnósticos",        count: 1, key: "Diagnósticos" },
  { id: "simulacoes",      label: "Simulações",          count: 1, key: "Simulações" },
  { id: "skills",          label: "Skills",              count: 1, key: "Skills" },
  { id: "plano",           label: "Plano educacional",   count: 1, key: "Plano educacional" },
  { id: "publico",         label: "Conhecimento público",count: 0, key: "Conhecimento público" },
];

// ============================================
// SECOND BRAIN — Screen 7
// ============================================

// Map an API node (from backend) to the display format used by VaultScreen
const mapApiNode = (n) => {
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const day = d.getDate();
      const months = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
      const mon = months[d.getMonth()];
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      return `${day} ${mon} · ${hh}:${mm}`;
    } catch (e) { return iso; }
  };
  const parseTags = (raw) => {
    if (!raw) return [];
    return raw.split(/[,\s]+/).filter(Boolean).map((t) => t.startsWith("#") ? t : `#${t}`);
  };
  return {
    id: String(n.id),
    folder: capitalize(n.type),
    title: n.title,
    agent: capitalize(n.agent),
    event: "NODE_CREATED",
    date: formatDate(n.created_at),
    tags: parseTags(n.tags),
    md: n.content || "",
  };
};

const VaultScreen = ({ go, toast, apiNodes, userId }) => {
  const displayNodes = (apiNodes && apiNodes.length > 0) ? apiNodes.map(mapApiNode) : NODES;
  const [folder, setFolder] = useS_v(displayNodes[0] ? displayNodes[0].folder : "Diagnósticos");
  const filtered = displayNodes.filter((n) => folder === "all" ? true : n.folder === folder);
  const [selected, setSelected] = useS_v(displayNodes[0] ? displayNodes[0].id : NODES[0].id);
  const node = displayNodes.find((n) => n.id === selected) || displayNodes[0] || NODES[0];

  return (
    <div className="content">
      <div className="page-head" style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
        <div>
          <div className="eyebrow">Vault</div>
          <h1>Second Brain financeiro</h1>
          <div className="sub">Seus diagnósticos, simulações e aprendizados organizados em Markdown.</div>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <Btn variant="ghost" icon="folder" onClick={() => toast("Estrutura aberta no Finder.")}>Abrir pasta do vault</Btn>
          <Btn variant="soft" icon="skill" onClick={() => go("skills")}>Ver skills geradas</Btn>
          <Btn variant="primary" icon="download">Exportar nodo</Btn>
        </div>
      </div>

      <div className="vault">
        {/* Folders */}
        <div className="vault-col">
          <div className="vault-col-head"><Icon name="folder" size={12} />Pastas</div>
          <div style={{padding: "6px 0"}}>
            {(apiNodes && apiNodes.length > 0 ? (() => {
              const folderMap = {};
              displayNodes.forEach((n) => { folderMap[n.folder] = (folderMap[n.folder] || 0) + 1; });
              return Object.entries(folderMap).map(([key, count]) => ({ id: key, label: key, count, key }));
            })() : FOLDERS).map((f) => (
              <button
                key={f.id}
                className={`folder ${folder === f.key ? "on" : ""}`}
                onClick={() => setFolder(f.key)}
              >
                <Icon name="folder" size={13} />
                <span>{f.label}</span>
                <span className="count">{f.count}</span>
              </button>
            ))}
          </div>
          <div className="vault-col-head" style={{marginTop: 12}}><Icon name="tag" size={11} />Tags</div>
          <div style={{padding: "10px 14px", display: "flex", flexWrap: "wrap", gap: 6}}>
            {["#diagnostico", "#freud", "#moriarty", "#athena", "#mensal", "#simulacao", "#skill", "#plano"].map((t) => (
              <span key={t} className="mono" style={{fontSize: 11, color: "#6E5621", background: "var(--gold-soft)", padding: "2px 7px", borderRadius: 4}}>{t}</span>
            ))}
          </div>
        </div>

        {/* Nodes list */}
        <div className="vault-col">
          <div className="vault-col-head">
            <Icon name="file" size={12} />
            {folder} · {filtered.length}
            <span style={{marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, color: "var(--ink-4)"}}>
              <Icon name="search" size={12} />
            </span>
          </div>
          <div>
            {filtered.length === 0 ? (
              <div style={{padding: 24, fontSize: 12.5, color: "var(--ink-4)", textAlign: "center"}}>
                Nenhum nodo nesta pasta ainda.
              </div>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  className={`node-item ${selected === n.id ? "on" : ""}`}
                  onClick={() => setSelected(n.id)}
                >
                  <div className="t">
                    <Icon name="file" size={12} /> {n.title}
                  </div>
                  <div className="m">
                    <AgentSeal agent={n.agent} />
                    <span>·</span>
                    <span>{n.date}</span>
                  </div>
                  <div className="m">
                    <span className="mono" style={{fontSize: 10.5, color: "var(--navy)"}}>{n.event}</span>
                  </div>
                  <div className="tags">
                    {n.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Markdown preview */}
        <div className="vault-col" style={{display: "flex", flexDirection: "column"}}>
          <div className="vault-col-head" style={{justifyContent: "space-between"}}>
            <span><Icon name="file" size={12} /> Prévia · Markdown</span>
            <div style={{display: "flex", gap: 4, marginLeft: "auto"}}>
              <button className="btn btn-sm btn-soft" onClick={() => toast("Markdown copiado.")}><Icon name="copy" size={12} /> Copiar</button>
              <button className="btn btn-sm btn-soft"><Icon name="download" size={12} /></button>
            </div>
          </div>
          <MarkdownPreview md={node.md} />
        </div>
      </div>

      {/* Graph mini + path */}
      <div style={{display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16, marginTop: 16}}>
        <div className="card">
          <div className="card-head">
            <div className="lead">
              <h3>Caminho no vault</h3>
              <div className="hint">Onde este nodo está armazenado.</div>
            </div>
          </div>
          <div className="card-body">
            <pre className="mono" style={{margin: 0, fontSize: 12, color: "var(--ink-2)", background: "var(--card-muted)", padding: "12px 14px", borderRadius: 8, border: "1px solid var(--border)"}}>{`obsidian-vault/
├── usuarios/
│   └── ${(node.folder || "diagnosticos").toLowerCase().replace(/[áã]/g, "a").replace(/ç/g, "c").replace(/ /g, "-")}/
│       └── ${node.title.toLowerCase().replace(/[áéíóúãâç]/g, c => "aeiouaac"["áéíóúãâç".indexOf(c)]).replace(/ /g, "-")}.md
├── agentes/${node.agent.toLowerCase()}/
├── conhecimento-publico/
└── skills/`}</pre>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="lead">
              <h3>Relações entre nodos</h3>
              <div className="hint">Visualização leve do grafo. Os agentes aparecem como origem das análises.</div>
            </div>
          </div>
          <div className="card-body" style={{padding: 0}}>
            <GraphMini />
          </div>
        </div>
      </div>
    </div>
  );
};

const MarkdownPreview = ({ md }) => {
  const parts = useM_v(() => {
    const fmMatch = md.match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
    const fm = fmMatch ? fmMatch[1] : "";
    const body = fmMatch ? fmMatch[2] : md;
    const lines = body.split("\n");
    return { fm, lines };
  }, [md]);

  return (
    <div className="md-preview">
      {parts.fm && (
        <div className="frontmatter">{parts.fm.split("\n").map((l, i) => (
          <div key={i}>{l}</div>
        ))}</div>
      )}
      {parts.lines.map((l, i) => {
        if (l.startsWith("# ")) return <div key={i} className="h1">{l.slice(2)}</div>;
        if (l.startsWith("## ")) return <div key={i} className="h2">{l.slice(3)}</div>;
        if (l.startsWith("- ")) return <div key={i}>• {renderInline(l.slice(2))}</div>;
        if (l.startsWith("> ")) return <div key={i} style={{borderLeft: "3px solid var(--gold)", paddingLeft: 8, color: "var(--ink-3)"}}>{l.slice(2)}</div>;
        if (l.trim() === "") return <div key={i}>&nbsp;</div>;
        return <div key={i}>{renderInline(l)}</div>;
      })}
    </div>
  );
};

const renderInline = (text) => {
  // wikilinks [[...]] and inline tags
  const out = [];
  let rest = text;
  let idx = 0;
  while (rest.length > 0) {
    const link = rest.match(/\[\[([^\]]+)\]\]/);
    if (link) {
      out.push(rest.slice(0, link.index));
      out.push(<span key={"l" + idx++} className="link">{link[1]}</span>);
      rest = rest.slice(link.index + link[0].length);
      continue;
    }
    const bold = rest.match(/\*\*([^*]+)\*\*/);
    if (bold) {
      out.push(rest.slice(0, bold.index));
      out.push(<b key={"b" + idx++}>{bold[1]}</b>);
      rest = rest.slice(bold.index + bold[0].length);
      continue;
    }
    out.push(rest);
    rest = "";
  }
  return out;
};

// Mini Obsidian-like graph
const GraphMini = () => {
  const W = 520, H = 260;
  const nodes = [
    { id: "panel",  label: "MONTHLY_PANEL", x: 80,  y: 130, type: "evt" },
    { id: "diag",   label: "Diagnóstico",   x: 220, y: 70,  type: "node", agent: "Freud" },
    { id: "sum",    label: "Resumo",        x: 220, y: 200, type: "node", agent: "Moriarty" },
    { id: "plan",   label: "Plano",         x: 360, y: 130, type: "node", agent: "Athena" },
    { id: "skill",  label: "Skill margem",  x: 470, y: 70,  type: "skill" },
    { id: "skill2", label: "Skill reserva", x: 470, y: 200, type: "skill" },
  ];
  const edges = [
    ["panel", "diag"], ["panel", "sum"],
    ["diag", "plan"], ["sum", "plan"],
    ["diag", "skill"], ["sum", "skill2"],
  ];
  const colorOf = (n) =>
    n.type === "evt" ? "#5B7BA5" :
    n.type === "skill" ? "var(--gold)" :
    n.agent === "Freud" ? "#6A4F8A" :
    n.agent === "Moriarty" ? "var(--navy)" :
    "var(--green)";

  return (
    <div className="graph-mini" style={{height: H}}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.5" fill="#cfc9b8" opacity="0.6" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />
        {edges.map(([a, b], i) => {
          const na = nodes.find(n => n.id === a);
          const nb = nodes.find(n => n.id === b);
          return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#C5BFAE" strokeWidth="1" />;
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={n.type === "evt" ? 6 : 9} fill={colorOf(n)} opacity={n.type === "evt" ? 0.7 : 1} />
            <text x={n.x} y={n.y + 22} textAnchor="middle" fontSize="10" fill="var(--ink-2)" fontFamily="var(--font-mono)">{n.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ============================================
// SKILLS — Screen 8
// ============================================
const SKILLS = [
  {
    id: "s1",
    name: "Detectar baixa margem de segurança",
    agent: "Freud",
    event: "MONTHLY_PANEL_SUBMITTED",
    status: "active",
    goal: "Identificar quando o usuário possui pouca sobra mensal.",
    inputs: ["renda do mês", "soma de gastos", "soma de dívidas"],
    rule: "Se o saldo estimado for menor que 20% da renda, classificar como baixa margem de segurança.",
    output: "Diagnóstico educacional e nodo no Obsidian.",
    limit: "Não considera variações estacionais (13º, férias).",
  },
  {
    id: "s2",
    name: "Analisar peso das assinaturas",
    agent: "Athena",
    event: "HIGH_SUBSCRIPTION_COST_DETECTED",
    status: "suggested",
    goal: "Avaliar se assinaturas estão consumindo margem da renda.",
    inputs: ["lista de assinaturas", "renda mensal"],
    rule: "Se assinaturas > 5% da renda, sugerir revisão.",
    output: "Nota educacional e recomendação de auditoria.",
    limit: "Sem distinção entre essencial vs lazer.",
  },
  {
    id: "s3",
    name: "Calcular reserva de emergência",
    agent: "Moriarty",
    event: "SIMULATION_CREATED",
    status: "active",
    goal: "Estimar tempo para formar reserva de 6 meses.",
    inputs: ["gasto essencial", "aporte mensal"],
    rule: "tempo = (6 × gasto essencial) / aporte mensal.",
    output: "Card de simulação e nodo de plano.",
    limit: "Não considera rentabilidade durante o acúmulo.",
  },
];

const SkillsScreen = ({ go, toast }) => {
  const [sel, setSel] = useS_v(SKILLS[0].id);
  const skill = SKILLS.find((s) => s.id === sel);
  return (
    <div className="content">
      <div className="page-head" style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
        <div>
          <div className="eyebrow">Vault · Skills</div>
          <h1>Skills financeiras</h1>
          <div className="sub">Capacidades criadas para ajudar o sistema a analisar padrões financeiros.</div>
        </div>
        <Btn variant="ghost" icon="arrow" onClick={() => go("vault")}>Voltar ao Second Brain</Btn>
      </div>

      <div className="banner" style={{marginBottom: 18}}>
        <div className="ic" style={{color: "var(--navy)"}}><Icon name="book" size={14} /></div>
        <div>
          <h4>O que é uma skill?</h4>
          <p>São instruções em Markdown que ensinam os agentes a repetir análises úteis. <b>No MVP, elas não executam código</b> — funcionam como conhecimento estruturado e auditável.</p>
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16}}>
        <div className="col" style={{gap: 10}}>
          {SKILLS.map((s) => (
            <div key={s.id} className="skill-card" onClick={() => setSel(s.id)} style={{borderColor: sel === s.id ? "var(--navy)" : "var(--border)"}}>
              <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8}}>
                <div style={{display: "flex", alignItems: "center", gap: 8}}>
                  <span style={{width: 26, height: 26, borderRadius: 7, background: "var(--card-muted)", display: "grid", placeItems: "center", color: "var(--gold)"}}>
                    <Icon name="skill" size={13} />
                  </span>
                  <div style={{fontWeight: 600, fontSize: 13.5}}>{s.name}</div>
                </div>
                <span className={`tag ${s.status === "active" ? "green" : "gold"}`}>
                  {s.status === "active" ? "ativa" : "sugerida"}
                </span>
              </div>
              <div style={{display: "flex", alignItems: "center", gap: 8}}>
                <AgentSeal agent={s.agent} />
              </div>
              <div className="mono" style={{fontSize: 11, color: "var(--navy)"}}>{s.event}</div>
            </div>
          ))}
        </div>

        {/* Skill detail */}
        <div className="card">
          <div className="card-head">
            <div className="lead">
              <h3>{skill.name}</h3>
              <div className="hint">Detalhes técnicos e regra utilizada.</div>
            </div>
            <span className={`tag ${skill.status === "active" ? "green" : "gold"}`}>{skill.status}</span>
          </div>
          <div className="card-body" style={{display: "flex", flexDirection: "column", gap: 16}}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
              <SkillKV label="Agente" value={<AgentSeal agent={skill.agent} />} />
              <SkillKV label="Evento ativador" value={<span className="mono" style={{fontSize: 12, color: "var(--navy)"}}>{skill.event}</span>} />
            </div>
            <SkillKV label="Objetivo" value={skill.goal} />
            <SkillKV label="Entradas necessárias" value={
              <div style={{display: "flex", flexWrap: "wrap", gap: 6}}>
                {skill.inputs.map((i) => <span key={i} className="tag">{i}</span>)}
              </div>
            } />
            <SkillKV label="Regra utilizada" value={<code className="mono" style={{fontSize: 12, background: "var(--card-muted)", padding: "8px 10px", borderRadius: 6, display: "block", border: "1px solid var(--border)"}}>{skill.rule}</code>} />
            <SkillKV label="Saída esperada" value={skill.output} />
            <SkillKV label="Limitações" value={<span className="muted">{skill.limit}</span>} />

            <details>
              <summary style={{cursor: "pointer", fontSize: 12.5, color: "var(--ink-3)"}}>Ver skill em Markdown</summary>
              <pre className="mono" style={{fontSize: 11.5, background: "var(--card-muted)", padding: 14, borderRadius: 8, marginTop: 8, border: "1px solid var(--border)", overflow: "auto"}}>{`---
name: "${skill.name.toLowerCase().replace(/ /g, "-")}"
agent: "${skill.agent}"
trigger_event: "${skill.event}"
status: "${skill.status}"
---

# Skill: ${skill.name}

## Objetivo
${skill.goal}

## Regra
${skill.rule}

## Saída esperada
${skill.output}`}</pre>
            </details>
          </div>
          <div className="card-foot">
            <Btn variant="soft" icon="obsidian" onClick={() => toast("Skill aberta no vault.")}>Ver no Obsidian</Btn>
            <Btn variant="ghost" icon="x">Arquivar skill</Btn>
            <div style={{flex: 1}}></div>
            <EducationalDisclaimer inline />
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillKV = ({ label, value }) => (
  <div>
    <div style={{fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 6}}>{label}</div>
    <div style={{fontSize: 13.5, color: "var(--ink-2)"}}>{value}</div>
  </div>
);

// ============================================
// EVENTOS — Screen 9
// ============================================
const EVENTS = [
  { code: "USER_CREATED",                 desc: "Usuário criado no sistema.",                    time: "14:20", agent: null,       status: "ok" },
  { code: "MONTHLY_PANEL_SUBMITTED",      desc: "Painel financeiro mensal enviado.",             time: "14:22", agent: null,       status: "ok" },
  { code: "FINANCIAL_SUMMARY_CALCULATED", desc: "Moriarty calculou resumo financeiro.",          time: "14:22", agent: "Moriarty", status: "ok" },
  { code: "DIAGNOSIS_CREATED",            desc: "Freud gerou diagnóstico educacional.",          time: "14:23", agent: "Freud",    status: "ok" },
  { code: "NODE_CREATED",                 desc: "Athena criou nodo no Obsidian.",                time: "14:23", agent: "Athena",   status: "ok" },
  { code: "SKILL_CREATED",                desc: "Athena criou skill de baixa margem de segurança.", time: "14:24", agent: "Athena", status: "ok" },
];

const EventosScreen = ({ go }) => {
  const [sel, setSel] = useS_v(3);
  const e = EVENTS[sel];
  return (
    <div className="content">
      <div className="page-head" style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
        <div>
          <div className="eyebrow">Auditoria</div>
          <h1>Eventos do sistema</h1>
          <div className="sub">Como cada ação gerou análises, nodos e skills. Use isso para auditoria e defesa técnica.</div>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <span className="tag green"><span style={{width: 6, height: 6, borderRadius: "50%", background: "var(--green)"}}></span> 6 eventos · todos ok</span>
        </div>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16}}>
        <div className="card">
          <div className="card-head">
            <div className="lead">
              <h3>Linha do tempo</h3>
              <div className="hint">Sessão atual · 26 nov 2025</div>
            </div>
          </div>
          <div className="card-body">
            <div className="timeline">
              {EVENTS.map((ev, i) => (
                <div key={i} className="tl-item" onClick={() => setSel(i)} style={{cursor: "pointer", opacity: sel === i ? 1 : 0.85}}>
                  <div>
                    <span className="code">{ev.code}</span>
                    <div className="what" style={{marginTop: 4}}>{ev.desc}</div>
                    {ev.agent && <div style={{marginTop: 6}}><AgentSeal agent={ev.agent} /></div>}
                  </div>
                  <div className="when">{ev.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="lead">
              <h3>Detalhes do evento</h3>
              <div className="hint">Entrada, saída e nodos relacionados.</div>
            </div>
            <span className="tag green">status: ok</span>
          </div>
          <div className="card-body" style={{display: "flex", flexDirection: "column", gap: 14}}>
            <SkillKV label="Tipo do evento" value={<span className="mono" style={{fontSize: 12.5, color: "var(--navy)"}}>{e.code}</span>} />
            <SkillKV label="Agente acionado" value={e.agent ? <AgentSeal agent={e.agent} /> : <span className="muted">sistema</span>} />
            <SkillKV label="Data / hora" value={<span className="tnum">26 nov 2025 · {e.time}</span>} />
            <SkillKV label="Entrada" value={
              <pre className="mono" style={{margin: 0, fontSize: 11.5, background: "var(--card-muted)", padding: 10, borderRadius: 6, border: "1px solid var(--border)"}}>{`{
  "user_id": "u_4f81",
  "session": "s_2025_11_26"
}`}</pre>
            } />
            <SkillKV label="Saída" value={
              <pre className="mono" style={{margin: 0, fontSize: 11.5, background: "var(--card-muted)", padding: 10, borderRadius: 6, border: "1px solid var(--border)"}}>{`{
  "node_id": "n_diag_001",
  "status": "created"
}`}</pre>
            } />
            <SkillKV label="Nodo relacionado" value={<span className="btn-link" style={{cursor: "pointer"}} onClick={() => go("vault")}>Diagnóstico Financeiro Inicial ↗</span>} />
            <SkillKV label="Skill relacionada" value={<span className="btn-link" style={{cursor: "pointer"}} onClick={() => go("skills")}>Detectar baixa margem de segurança ↗</span>} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// OBSIDIAN CONFIG — Screen 10
// ============================================
const ObsidianScreen = ({ toast }) => (
  <div className="content">
    <div className="page-head" style={{flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"}}>
      <div>
        <div className="eyebrow">Integrações</div>
        <h1>Configurações do Obsidian</h1>
        <div className="sub">Onde seus nodos são gravados e qual a saúde da integração.</div>
      </div>
      <Btn variant="primary" icon="check" onClick={() => toast("Integração testada — tudo ok.")}>Testar integração</Btn>
    </div>

    <div style={{display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16}}>
      <div className="col" style={{gap: 16}}>
        <div className="card" style={{background: "linear-gradient(180deg, #102A43 0%, #1B3A5C 100%)", border: "none", color: "#fff"}}>
          <div style={{padding: "20px 22px"}}>
            <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 8}}>
              <span style={{width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.1)", display: "grid", placeItems: "center"}}><Icon name="obsidian" size={14} /></span>
              <span className="tag green" style={{background: "rgba(47,122,86,0.25)", color: "#A8E6BA", border: "1px solid rgba(168,230,186,0.3)"}}>
                <span style={{width: 6, height: 6, borderRadius: "50%", background: "#A8E6BA"}}></span>
                Integração ativa
              </span>
            </div>
            <div className="serif" style={{fontSize: 22, letterSpacing: -0.3, marginBottom: 4}}>Os nodos estão sendo salvos automaticamente em arquivos Markdown.</div>
            <div style={{fontSize: 13, opacity: 0.75}}>Cada análise gerada vira um arquivo .md auditável no seu vault local.</div>
          </div>
          <div style={{borderTop: "1px solid rgba(255,255,255,0.08)", padding: "14px 22px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16}}>
            <div>
              <div style={{fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6}}>Última exportação</div>
              <div className="tnum" style={{fontSize: 14, marginTop: 3}}>há 2 minutos</div>
            </div>
            <div>
              <div style={{fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6}}>Nodos criados</div>
              <div className="tnum serif" style={{fontSize: 22, letterSpacing: -0.3}}>12</div>
            </div>
            <div>
              <div style={{fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6}}>Skills criadas</div>
              <div className="tnum serif" style={{fontSize: 22, letterSpacing: -0.3}}>3</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="lead">
              <h3>Caminho do vault</h3>
              <div className="hint">Pasta local onde os arquivos Markdown são gravados.</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{display: "flex", gap: 8}}>
              <input className="input mono" style={{fontSize: 12}} defaultValue="/Users/maria/Documents/obsidian-vault/tio-patinhas" />
              <Btn variant="soft" icon="folder">Escolher pasta</Btn>
            </div>
            <div className="dim" style={{fontSize: 12, marginTop: 8, display: "flex", gap: 6, alignItems: "center"}}>
              <Icon name="alert" size={12} />
              No MVP, a integração é feita por arquivos Markdown locais. Não há plugin oficial do Obsidian.
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="lead">
              <h3>Ações rápidas</h3>
              <div className="hint">Para testar e validar a integração.</div>
            </div>
          </div>
          <div className="card-body" style={{display: "flex", flexWrap: "wrap", gap: 8}}>
            <Btn variant="soft" icon="plus" onClick={() => toast("Nodo de teste criado.")}>Criar nodo de teste</Btn>
            <Btn variant="soft" icon="folder">Abrir estrutura</Btn>
            <Btn variant="soft" icon="book">Ver documentação</Btn>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="lead">
            <h3>Estrutura do vault</h3>
            <div className="hint">Organização padrão criada pelo Tio Patinhas.</div>
          </div>
        </div>
        <div className="card-body">
          <pre className="mono" style={{margin: 0, fontSize: 12.5, color: "var(--ink-2)", background: "var(--card-muted)", padding: 16, borderRadius: 8, border: "1px solid var(--border)", lineHeight: 1.8}}>{`obsidian-vault/
├── usuarios/
│   └── maria/
│       ├── diagnosticos/
│       ├── simulacoes/
│       └── plano-educacional/
├── conhecimento-publico/
│   ├── reserva-de-emergencia.md
│   ├── juros-compostos.md
│   └── orcamento-mensal.md
├── agentes/
│   ├── freud/
│   ├── moriarty/
│   └── athena/
└── skills/
    ├── detectar-baixa-margem.md
    ├── analisar-assinaturas.md
    └── calcular-reserva.md`}</pre>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, { VaultScreen, SkillsScreen, EventosScreen, ObsidianScreen, NODES });
