/* global React */
// Tio Patinhas — Landing, Onboarding, Mobile preview

const { useState: useS_aux } = React;

// ============================================
// LANDING — Screen 1
// ============================================
const LandingScreen = ({ onStart, onExample }) => (
  <div className="landing">
    <nav className="landing-nav">
      <div style={{display: "flex", alignItems: "center", gap: 10}}>
        <div className="brand-mark">tp</div>
        <div style={{fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 18, letterSpacing: -0.3}}>Tio Patinhas</div>
      </div>
      <div className="links">
        <a>Como funciona</a>
        <a>Exemplo</a>
        <a>Sobre os agentes</a>
        <a>Obsidian</a>
      </div>
      <div style={{display: "flex", gap: 8}}>
        <Btn variant="ghost" size="sm" onClick={onExample}>Ver exemplo</Btn>
        <Btn variant="primary" size="sm" onClick={onStart}>Começar</Btn>
      </div>
    </nav>

    <div className="landing-hero">
      <div>
        <div style={{display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 6px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 999, fontSize: 12, color: "var(--ink-2)"}}>
          <span style={{width: 18, height: 18, borderRadius: 999, background: "var(--gold-soft)", color: "var(--gold)", display: "grid", placeItems: "center"}}>
            <Icon name="coin" size={11} />
          </span>
          MVP educacional · 26 nov 2025
        </div>
        <h1>
          Entenda quanto<br />você <em>realmente</em><br />tem sobrando.
        </h1>
        <p className="lead">
          Um painel financeiro educacional que transforma sua renda e seus gastos em
          diagnóstico, simulações e nodos organizados no Obsidian.
        </p>
        <div className="actions">
          <Btn variant="primary" size="lg" icon="arrow" onClick={onStart}>Começar agora</Btn>
          <Btn variant="ghost" size="lg" icon="eye" onClick={onExample}>Ver exemplo de análise</Btn>
        </div>

        <div className="landing-flow">
          {[
            "Informe sua renda",
            "Cadastre seus gastos",
            "Veja sua sobra real",
            "Gere seu diagnóstico",
            "Salve no Obsidian",
          ].map((t, i) => (
            <div key={i} className="step">
              <span className="n">0{i + 1}</span>
              <div className="t">{t}</div>
            </div>
          ))}
        </div>

        <div className="disclaimer-small">
          As análises são educacionais e não representam recomendação de investimento.
          Os agentes Freud, Moriarty e Athena atuam como módulos internos de análise.
        </div>
      </div>

      {/* Preview card */}
      <div className="preview-card">
        <div className="ph-bar">
          <i></i><i></i><i></i>
          <span className="url">tio-patinhas · dashboard</span>
        </div>
        <div style={{padding: 22, background: "var(--bg-elev)"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14}}>
            <div>
              <div style={{fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-4)", fontWeight: 600}}>Novembro 2025</div>
              <div className="serif" style={{fontSize: 22, letterSpacing: -0.3}}>Resumo do seu mês</div>
            </div>
            <span className="tag gold">atenção: margem baixa</span>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10}}>
            <div className="stat dark" style={{padding: 14}}>
              <div className="lbl" style={{fontSize: 10}}>Recebeu</div>
              <div className="val tnum" style={{fontSize: 22}}>R$ 5.000</div>
            </div>
            <div className="stat" style={{padding: 14}}>
              <div className="lbl" style={{fontSize: 10}}>Gastou</div>
              <div className="val tnum" style={{fontSize: 22}}>R$ 4.180</div>
            </div>
            <div className="stat green" style={{padding: 14}}>
              <div className="lbl" style={{fontSize: 10}}>Sobrou</div>
              <div className="val tnum" style={{fontSize: 22, color: "var(--green-ink)"}}>R$ 820</div>
            </div>
          </div>

          <div style={{marginTop: 14}}>
            <div style={{fontSize: 11.5, color: "var(--ink-3)", marginBottom: 6}}>Para onde foi o dinheiro?</div>
            <div className="alloc">
              <div style={{width: "43%", background: "#1B3A5C"}}></div>
              <div style={{width: "23%", background: "#5B7BA5"}}></div>
              <div style={{width: "4%",  background: "#A6843D"}}></div>
              <div style={{width: "13%", background: "#B23A3A"}}></div>
              <div style={{width: "17%", background: "#2F7A56"}}></div>
            </div>
            <div className="alloc-legend">
              <span className="item"><span className="sw" style={{background: "#1B3A5C"}}></span>Fixos · 43%</span>
              <span className="item"><span className="sw" style={{background: "#5B7BA5"}}></span>Variáveis · 23%</span>
              <span className="item"><span className="sw" style={{background: "#A6843D"}}></span>Assinaturas · 4%</span>
              <span className="item"><span className="sw" style={{background: "#B23A3A"}}></span>Dívidas · 13%</span>
              <span className="item"><span className="sw" style={{background: "#2F7A56"}}></span>Sobra · 17%</span>
            </div>
          </div>

          <div style={{marginTop: 14, padding: "12px 14px", background: "var(--card-muted)", borderRadius: 10, fontSize: 12.5, color: "var(--ink-2)"}}>
            <div style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 6}}>
              <AgentSeal agent="Freud" />
            </div>
            "Seu mês mostra <b>baixa margem de segurança</b>. O ponto de atenção principal está
            em gastos fixos e dívidas."
          </div>
        </div>
      </div>
    </div>

    {/* Three-up below */}
    <div style={{maxWidth: 1180, margin: "60px auto 80px", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18}}>
      <FeatureCard icon="panel" title="Painel único" body="Renda, gastos, assinaturas e dívidas em uma página. Resumo lateral em tempo real enquanto você preenche." />
      <FeatureCard icon="brain" title="Second Brain" body="Cada análise vira nodo em Markdown no seu vault Obsidian. Conhecimento auditável, não caixa-preta." />
      <FeatureCard icon="skill" title="Skills educacionais" body="O sistema aprende padrões e cria skills para repetir análises úteis. Sem prometer rentabilidade." />
    </div>
  </div>
);

const FeatureCard = ({ icon, title, body }) => (
  <div className="card" style={{padding: 22}}>
    <span style={{width: 32, height: 32, borderRadius: 8, background: "var(--card-muted)", color: "var(--navy)", display: "grid", placeItems: "center", marginBottom: 12}}>
      <Icon name={icon} size={16} />
    </span>
    <div className="serif" style={{fontSize: 18, letterSpacing: -0.3, marginBottom: 6}}>{title}</div>
    <div className="muted" style={{fontSize: 13.5, lineHeight: 1.55}}>{body}</div>
  </div>
);

// ============================================
// ONBOARDING — Screen 2
// ============================================
const OnboardingScreen = ({ onDone }) => {
  const [step, setStep] = useS_aux(0);
  const [data, setData] = useS_aux({
    name: "",
    email: "",
    goal: "",
    risk: "Média",
    aim: "organizar gastos",
  });

  const goals = ["Organizar meus gastos", "Quitar minhas dívidas", "Formar uma reserva", "Entender para onde vai o dinheiro"];
  const risks = [
    { v: "Baixa", d: "Prefiro evitar oscilações" },
    { v: "Média", d: "Aceito alguma variação" },
    { v: "Alta",  d: "Tolero perdas pontuais" },
  ];
  const aims = [
    { v: "organizar gastos", d: "Quero clareza sobre o mês" },
    { v: "quitar dívidas",   d: "Tenho dívidas a quitar" },
    { v: "formar reserva",   d: "Quero criar reserva" },
    { v: "entender o fluxo", d: "Pra onde vai meu dinheiro?" },
  ];

  return (
    <div className="onboarding">
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%", maxWidth: 520}}>
        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <div className="brand-mark">tp</div>
          <div style={{fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 18, letterSpacing: -0.3}}>Tio Patinhas</div>
        </div>

        <div className="card">
          <div style={{padding: "20px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div className="eyebrow" style={{fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-4)"}}>
              Onboarding · etapa {step + 1} de 3
            </div>
            <div className="steps-dots">
              <i className={step >= 0 ? (step > 0 ? "done" : "on") : ""}></i>
              <i className={step >= 1 ? (step > 1 ? "done" : "on") : ""}></i>
              <i className={step >= 2 ? "on" : ""}></i>
            </div>
          </div>

          <div style={{padding: "16px 32px 28px"}}>
            {step === 0 && (
              <>
                <h2 className="serif" style={{margin: "8px 0 4px", fontSize: 26, fontWeight: 500, letterSpacing: -0.3}}>Vamos começar?</h2>
                <p className="muted" style={{margin: "0 0 18px", fontSize: 13.5}}>Essas informações ajudam o sistema a explicar sua situação financeira com mais contexto.</p>
                <div className="col" style={{gap: 14}}>
                  <div className="field">
                    <label>Nome</label>
                    <input className="input" placeholder="Como podemos te chamar?" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>E-mail</label>
                    <input className="input" type="email" placeholder="você@email.com" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                    <div className="help">Não pedimos CPF, nem dados bancários. Só o necessário.</div>
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="serif" style={{margin: "8px 0 4px", fontSize: 26, fontWeight: 500, letterSpacing: -0.3}}>Qual seu objetivo financeiro?</h2>
                <p className="muted" style={{margin: "0 0 18px", fontSize: 13.5}}>Você pode mudar depois. Isso só ajuda o painel a se ajustar.</p>
                <div className="col" style={{gap: 8}}>
                  {goals.map((g) => (
                    <button key={g}
                      className={`choice ${data.goal === g ? "on" : ""}`}
                      style={{flexDirection: "row", alignItems: "center"}}
                      onClick={() => setData({ ...data, goal: g })}>
                      <span style={{width: 18, height: 18, borderRadius: 999, border: "1.5px solid var(--border-strong)", background: data.goal === g ? "var(--navy)" : "transparent", display: "grid", placeItems: "center", flexShrink: 0}}>
                        {data.goal === g && <span style={{width: 6, height: 6, borderRadius: "50%", background: "#fff"}}></span>}
                      </span>
                      <div className="t" style={{flex: 1}}>{g}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="serif" style={{margin: "8px 0 4px", fontSize: 26, fontWeight: 500, letterSpacing: -0.3}}>Última pergunta.</h2>
                <p className="muted" style={{margin: "0 0 18px", fontSize: 13.5}}>Como você descreveria seu apetite a risco?</p>
                <div className="choice-grid" style={{gridTemplateColumns: "1fr 1fr 1fr"}}>
                  {risks.map((r) => (
                    <button key={r.v}
                      className={`choice ${data.risk === r.v ? "on" : ""}`}
                      onClick={() => setData({ ...data, risk: r.v })}>
                      <div className="t">{r.v}</div>
                      <div className="d">{r.d}</div>
                    </button>
                  ))}
                </div>
                <p className="muted" style={{margin: "20px 0 8px", fontSize: 13}}>Meta inicial:</p>
                <div className="choice-grid">
                  {aims.map((a) => (
                    <button key={a.v}
                      className={`choice ${data.aim === a.v ? "on" : ""}`}
                      onClick={() => setData({ ...data, aim: a.v })}>
                      <div className="t">{a.v.charAt(0).toUpperCase() + a.v.slice(1)}</div>
                      <div className="d">{a.d}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div style={{display: "flex", gap: 8, marginTop: 24, alignItems: "center"}}>
              {step > 0 ? <Btn variant="ghost" onClick={() => setStep(step - 1)}>Voltar</Btn> : <Btn variant="ghost" onClick={() => onDone(null)}>Pular</Btn>}
              <div style={{flex: 1}}></div>
              {step < 2 ? (
                <Btn variant="primary" iconRight="arrow" onClick={() => setStep(step + 1)}>Continuar</Btn>
              ) : (
                <Btn variant="primary" iconRight="arrow" onClick={() => onDone(data)}>Continuar para o painel</Btn>
              )}
            </div>
          </div>
        </div>

        <div className="muted" style={{fontSize: 12, textAlign: "center", maxWidth: 380}}>
          Não pedimos CPF, dados bancários ou senhas. Tio Patinhas é uma ferramenta educacional.
        </div>
      </div>
    </div>
  );
};

// ============================================
// EMPTY STATE — Screen 12 (standalone reference)
// ============================================
const EmptyStateScreen = ({ go }) => (
  <div className="content">
    <div className="page-head">
      <div className="eyebrow">Primeiro uso</div>
      <h1>Seu painel ainda está vazio</h1>
      <div className="sub">Comece informando quanto você recebeu e quais foram seus principais gastos do mês.</div>
    </div>
    <div style={{display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18}}>
      <div className="card" style={{padding: 28}}>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12}}>
          <div style={{background: "var(--card-muted)", padding: 16, borderRadius: 10}}>
            <div style={{fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-4)", fontWeight: 600}}>Recebeu</div>
            <div className="serif tnum" style={{fontSize: 22}}>R$ 5.000</div>
          </div>
          <div style={{background: "var(--card-muted)", padding: 16, borderRadius: 10}}>
            <div style={{fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ink-4)", fontWeight: 600}}>Gastou</div>
            <div className="serif tnum" style={{fontSize: 22}}>R$ 4.180</div>
          </div>
          <div style={{background: "var(--green-soft)", padding: 16, borderRadius: 10}}>
            <div style={{fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--green-ink)", fontWeight: 600}}>Sobrou</div>
            <div className="serif tnum" style={{fontSize: 22, color: "var(--green-ink)"}}>R$ 820</div>
          </div>
        </div>
        <div style={{marginTop: 20}} className="muted">
          Este é só um exemplo de como o resumo do seu mês vai aparecer. Quanto mais informações você preencher, mais útil fica o painel.
        </div>
        <div style={{marginTop: 20}}>
          <Btn variant="primary" size="lg" icon="arrow" onClick={() => go("painel")}>Preencher meu primeiro mês</Btn>
        </div>
      </div>
      <div className="card" style={{padding: 22}}>
        <div className="serif" style={{fontSize: 18, letterSpacing: -0.3, marginBottom: 10}}>O que você consegue depois</div>
        <ul style={{listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5}}>
          {["Resumo do mês em uma página", "Diagnóstico do Freud sobre seu padrão", "Simulações de reserva com o Moriarty", "Nodos automáticos no Obsidian", "Skills aprendidas pelo sistema"].map((t, i) => (
            <li key={i} style={{display: "flex", gap: 10}}>
              <span style={{width: 18, height: 18, borderRadius: 999, background: "var(--green-soft)", color: "var(--green)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1}}>
                <Icon name="check" size={11} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// ============================================
// MOBILE PREVIEW — Screen 13
// ============================================
const MobileScreen = () => {
  const phones = [
    { id: "home",  label: "Início", body: <PhoneHome /> },
    { id: "painel", label: "Painel", body: <PhonePainel /> },
    { id: "dash",  label: "Dashboard", body: <PhoneDash /> },
    { id: "diag",  label: "Diagnóstico", body: <PhoneDiag /> },
    { id: "brain", label: "Second Brain", body: <PhoneBrain /> },
  ];
  return (
    <div className="content">
      <div className="page-head">
        <div className="eyebrow">Responsivo</div>
        <h1>Versão mobile</h1>
        <div className="sub">Telas principais empilhadas, com cards grandes, navegação por tabs e resumo fixo.</div>
      </div>

      <div style={{display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", padding: "12px 0 40px"}}>
        {phones.map((p) => (
          <div key={p.id} style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14}}>
            <div className="phone">
              <div className="pn-status">
                <span>9:41</span>
                <span style={{display: "inline-flex", gap: 4, alignItems: "center"}}>
                  <span style={{width: 14, height: 9, border: "1px solid var(--ink)", borderRadius: 2, display: "inline-block", position: "relative"}}>
                    <span style={{position: "absolute", inset: 1, background: "var(--ink)", width: "70%"}}></span>
                  </span>
                </span>
              </div>
              <div className="pn-content">{p.body}</div>
            </div>
            <div style={{fontSize: 12.5, color: "var(--ink-3)"}}>{p.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PhoneHome = () => (
  <div>
    <div style={{display: "flex", alignItems: "center", gap: 8}}>
      <div className="brand-mark" style={{width: 22, height: 22, fontSize: 12}}>tp</div>
      <div style={{fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: 14}}>Tio Patinhas</div>
    </div>
    <h3 className="pn-title" style={{lineHeight: 1.1}}>Quanto você <em style={{color: "var(--gold)", fontStyle: "italic"}}>realmente</em> tem sobrando?</h3>
    <div className="muted" style={{fontSize: 11.5, marginTop: 4}}>Painel financeiro educacional com diagnóstico e Obsidian.</div>
    <div className="pn-card" style={{background: "var(--navy)", color: "#fff", border: "0"}}>
      <div style={{fontSize: 9.5, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em"}}>Sobra do mês</div>
      <div className="serif tnum" style={{fontSize: 22, letterSpacing: -0.3}}>R$ 820</div>
      <div style={{fontSize: 10.5, opacity: 0.7, marginTop: 4}}>83,6% da renda comprometida</div>
    </div>
    <button className="btn btn-primary" style={{width: "100%", marginTop: 12, padding: "12px 14px", fontSize: 13}}>Começar agora</button>
    <button className="btn btn-ghost" style={{width: "100%", marginTop: 8, padding: "10px 14px", fontSize: 12.5}}>Ver exemplo</button>

    <div className="pn-tabs">
      <button>Início</button>
      <button className="on">Painel</button>
      <button>Dash</button>
      <button>Brain</button>
    </div>
  </div>
);

const PhonePainel = () => (
  <div>
    <div style={{position: "sticky", top: 0, background: "var(--bg)", paddingBottom: 6, marginBottom: 4}}>
      <h3 className="pn-title" style={{margin: 0}}>Painel mensal</h3>
      <div className="muted" style={{fontSize: 11}}>Preencha para ver sua sobra</div>
    </div>
    <div className="pn-card" style={{background: "var(--bg-elev)"}}>
      <div style={{fontSize: 10.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Renda</div>
      <div style={{height: 36, marginTop: 6, background: "#fff", borderRadius: 7, border: "1px solid var(--border-strong)", padding: "6px 10px", display: "flex", alignItems: "center", gap: 6}}>
        <span style={{color: "var(--ink-4)", fontSize: 12}}>R$</span>
        <span className="serif tnum" style={{fontSize: 18, color: "var(--ink)"}}>5.000,00</span>
      </div>
    </div>
    <div className="pn-card">
      <div style={{display: "flex", justifyContent: "space-between", marginBottom: 6}}>
        <div style={{fontSize: 11.5, fontWeight: 600}}>Gastos fixos</div>
        <div className="tnum" style={{fontSize: 11}}>R$ 1.800</div>
      </div>
      {["Aluguel · R$ 1.200", "Energia · R$ 220", "Internet · R$ 130"].map((t, i) => (
        <div key={i} style={{fontSize: 11.5, padding: "5px 0", borderBottom: i < 2 ? "1px dashed var(--divider)" : "0", color: "var(--ink-2)"}}>{t}</div>
      ))}
    </div>
    <div className="pn-card">
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div style={{fontSize: 11.5, fontWeight: 600}}>Variáveis · Assinaturas · Dívidas</div>
      </div>
      <div className="muted" style={{fontSize: 10.5, marginTop: 4}}>3 categorias · tocar para abrir</div>
    </div>
    <div style={{position: "sticky", bottom: 0, background: "var(--bg)", paddingTop: 8}}>
      <div className="pn-card" style={{background: "var(--green-soft)", border: "1px solid #CFE3D3"}}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <div style={{fontSize: 10.5, color: "var(--green-ink)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Sobra parcial</div>
          <div style={{fontSize: 10.5, color: "var(--green-ink)"}}>83,6%</div>
        </div>
        <div className="serif tnum" style={{fontSize: 20, color: "var(--green-ink)"}}>R$ 820</div>
      </div>
      <button className="btn btn-primary" style={{width: "100%", marginTop: 8, padding: "10px 14px", fontSize: 12.5}}>Gerar análise</button>
    </div>
  </div>
);

const PhoneDash = () => (
  <div>
    <h3 className="pn-title">Resumo do mês</h3>
    <div className="muted" style={{fontSize: 11}}>Novembro 2025</div>
    <div className="pn-card" style={{background: "var(--navy)", color: "#fff", border: "0"}}>
      <div style={{fontSize: 9.5, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.08em"}}>Sobra estimada</div>
      <div className="serif tnum" style={{fontSize: 26, letterSpacing: -0.5}}>R$ 820</div>
      <div style={{fontSize: 11, opacity: 0.7, marginTop: 4}}>De R$ 5.000 recebidos</div>
    </div>
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8}}>
      <div className="pn-card" style={{padding: 10}}>
        <div style={{fontSize: 9.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Recebeu</div>
        <div className="serif tnum" style={{fontSize: 15}}>R$ 5.000</div>
      </div>
      <div className="pn-card" style={{padding: 10}}>
        <div style={{fontSize: 9.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Gastou</div>
        <div className="serif tnum" style={{fontSize: 15}}>R$ 4.180</div>
      </div>
    </div>
    <div className="pn-card">
      <div style={{fontSize: 11, color: "var(--ink-3)", marginBottom: 6}}>Para onde foi o dinheiro?</div>
      <div className="alloc" style={{height: 10}}>
        <div style={{width: "43%", background: "#1B3A5C"}}></div>
        <div style={{width: "23%", background: "#5B7BA5"}}></div>
        <div style={{width: "4%", background: "#A6843D"}}></div>
        <div style={{width: "13%", background: "#B23A3A"}}></div>
        <div style={{width: "17%", background: "#2F7A56"}}></div>
      </div>
      <div style={{display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, fontSize: 10}}>
        <span style={{display: "flex", alignItems: "center", gap: 4}}><span style={{width: 8, height: 8, background: "#1B3A5C", borderRadius: 2}}></span>Fixos</span>
        <span style={{display: "flex", alignItems: "center", gap: 4}}><span style={{width: 8, height: 8, background: "#5B7BA5", borderRadius: 2}}></span>Variáveis</span>
        <span style={{display: "flex", alignItems: "center", gap: 4}}><span style={{width: 8, height: 8, background: "#B23A3A", borderRadius: 2}}></span>Dívidas</span>
      </div>
    </div>
    <div className="pn-card" style={{background: "var(--gold-soft)", border: "1px solid #E5D5A8"}}>
      <div style={{display: "flex", gap: 6, alignItems: "center", fontSize: 11}}>
        <Icon name="alert" size={11} />
        <span style={{color: "#6E5621", fontWeight: 600}}>Atenção: margem baixa</span>
      </div>
    </div>
  </div>
);

const PhoneDiag = () => (
  <div>
    <h3 className="pn-title">Diagnóstico</h3>
    <div style={{marginTop: 4}}>
      <AgentSeal agent="Freud" />
    </div>
    <div className="pn-card">
      <div style={{fontSize: 10.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Perfil do mês</div>
      <div className="serif" style={{fontSize: 17, letterSpacing: -0.2, marginTop: 4}}>Baixa margem de segurança</div>
    </div>
    <div className="pn-card">
      <div style={{fontSize: 10.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 6}}>Resumo</div>
      <div style={{fontSize: 11.5, lineHeight: 1.45, color: "var(--ink-2)"}}>
        Grande parte da renda está comprometida antes da formação de uma reserva. Isso reduz sua flexibilidade.
      </div>
    </div>
    <div className="pn-card" style={{background: "var(--green-soft)", border: "1px solid #CFE3D3"}}>
      <div style={{fontSize: 10, color: "var(--green-ink)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Pontos fortes</div>
      <div style={{fontSize: 11, marginTop: 4, color: "var(--green-ink)"}}>• Sobra positiva<br />• Gastos organizados</div>
    </div>
    <div className="pn-card" style={{background: "var(--gold-soft)", border: "1px solid #E5D5A8"}}>
      <div style={{fontSize: 10, color: "#6E5621", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600}}>Atenção</div>
      <div style={{fontSize: 11, marginTop: 4, color: "#6E5621"}}>• Dívidas pesadas<br />• Assinaturas a revisar</div>
    </div>
    <button className="btn btn-primary" style={{width: "100%", marginTop: 8, padding: "10px 14px", fontSize: 12}}>
      Salvar no Obsidian
    </button>
  </div>
);

const PhoneBrain = () => (
  <div>
    <h3 className="pn-title">Second Brain</h3>
    <div className="muted" style={{fontSize: 11}}>Vault local · 4 nodos</div>
    <div className="pn-tabs">
      <button className="on">Diagnósticos</button>
      <button>Simulações</button>
      <button>Skills</button>
    </div>
    {NODES.slice(0, 3).map((n) => (
      <div key={n.id} className="pn-card">
        <div style={{display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500}}>
          <Icon name="file" size={11} /> {n.title}
        </div>
        <div style={{marginTop: 4}}><AgentSeal agent={n.agent} /></div>
        <div className="mono" style={{fontSize: 10, color: "var(--navy)", marginTop: 4}}>{n.event}</div>
        <div style={{display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6}}>
          {n.tags.slice(0, 2).map((t) => (
            <span key={t} style={{fontFamily: "var(--font-mono)", fontSize: 9, color: "#6E5621", background: "var(--gold-soft)", padding: "1px 5px", borderRadius: 3}}>{t}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

Object.assign(window, { LandingScreen, OnboardingScreen, EmptyStateScreen, MobileScreen });
