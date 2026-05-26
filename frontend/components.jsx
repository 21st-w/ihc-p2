/* global React */
// Tio Patinhas — Shared components & helpers

const { useState, useMemo, useEffect, useRef } = React;

// ===== Formatting helpers =====
const fmtBRL = (n, opts = {}) => {
  const { showZero = true, sign = false } = opts;
  if (!n && !showZero) return "—";
  const v = Math.abs(n || 0);
  const formatted = v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (sign && n > 0) return "+ " + formatted;
  if (n < 0) return "− " + formatted;
  return formatted;
};
const fmtBRLCompact = (n) =>
  (n || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
const fmtPct = (n, digits = 1) =>
  (Number.isFinite(n) ? n : 0).toFixed(digits).replace(".", ",") + "%";

// ===== Icons (minimal stroke set) =====
const Icon = ({ name, size = 16, stroke = 1.6 }) => {
  const paths = {
    panel: "M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 14h7v7H3z",
    dashboard: "M3 12a9 9 0 1 1 18 0M12 12V3M12 12l5-3",
    diagnosis: "M12 2v6M12 22v-4M4.93 4.93l4.24 4.24M19.07 4.93l-4.24 4.24M2 12h6M22 12h-4M4.93 19.07l4.24-4.24",
    sim: "M3 17l5-5 4 4 7-9M14 7h6v6",
    brain: "M3 8a4 4 0 0 1 4-4h1v16H7a4 4 0 0 1-4-4zM21 8a4 4 0 0 0-4-4h-1v16h1a4 4 0 0 0 4-4z",
    skill: "M12 2l3 6 6 1-4.5 4.5L18 20l-6-3-6 3 1.5-6.5L3 9l6-1z",
    events: "M3 5h18M3 12h18M3 19h18",
    obsidian: "M12 2l9 5v10l-9 5-9-5V7zM12 12l9-5M12 12l-9-5M12 12v10",
    settings: "M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z M19 12l2-1-1-2-2 1-1-1V7l-2-1-1 2h-2l-1-2-2 1v2l-1 1-2-1-1 2 2 1v2l-2 1 1 2 2-1 1 1v2l2 1 1-2h2l1 2 2-1v-2l1-1 2 1 1-2z",
    plus: "M12 5v14M5 12h14",
    minus: "M5 12h14",
    x: "M6 6l12 12M18 6L6 18",
    arrow: "M5 12h14M13 6l6 6-6 6",
    check: "M5 13l4 4L19 7",
    download: "M12 3v12M7 10l5 5 5-5M5 21h14",
    copy: "M9 9h11v11H9zM4 4h11v3M4 4v11h3",
    folder: "M3 7v12h18V9h-9l-2-2H3z",
    file: "M14 3H6v18h12V7zM14 3v4h4",
    spark: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
    alert: "M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
    chevron: "M9 18l6-6-6-6",
    search: "M11 11a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM20 20l-5-5",
    book: "M4 4h7a3 3 0 0 1 3 3v13M20 4h-7a3 3 0 0 0-3 3v13",
    tag: "M3 12V3h9l9 9-9 9z M8 8h.01",
    user: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    edit: "M11 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6M19 3l3 3-9 9h-3v-3z",
    link: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1 M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
    coin: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v12M9 9h4.5a2.5 2.5 0 0 1 0 5H9M9 14h6",
    trend: "M3 17l5-5 4 4 7-9",
    bell: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] || ""} />
    </svg>
  );
};

// ===== Buttons =====
const Btn = ({ variant = "soft", size = "md", icon, iconRight, children, onClick, type = "button", style }) => {
  const cls = `btn btn-${variant}${size === "lg" ? " btn-lg" : size === "sm" ? " btn-sm" : ""}`;
  return (
    <button type={type} className={cls} onClick={onClick} style={style}>
      {icon && <Icon name={icon} size={size === "lg" ? 16 : 14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 16 : 14} />}
    </button>
  );
};

// ===== Money input =====
const MoneyInput = ({ value, onChange, placeholder = "0,00", big = false, autoFocus }) => {
  const displayValue = value === 0 || value === "" ? "" : value;
  return (
    <div className={`input-money-wrap${big ? " big" : ""}`}>
      <span className="sym">R$</span>
      <input
        type="text"
        inputMode="decimal"
        className={`input-money${big ? " big" : ""}`}
        value={displayValue === "" ? "" : displayValue.toString().replace(".", ",")}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d,.-]/g, "").replace(",", ".");
          const n = parseFloat(raw);
          onChange(Number.isFinite(n) ? n : 0);
        }}
      />
    </div>
  );
};

// ===== Expense list editor =====
const ExpenseListEditor = ({ items, onChange, addLabel = "Adicionar", placeholders = [] }) => {
  const update = (i, patch) => {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { id: Math.random().toString(36).slice(2), name: "", value: 0 }]);
  return (
    <div>
      {items.map((it, i) => (
        <div key={it.id} className="expense-row">
          <input
            className="input"
            placeholder={placeholders[i] || "Nome do gasto"}
            value={it.name}
            onChange={(e) => update(i, { name: e.target.value })}
          />
          <MoneyInput value={it.value} onChange={(v) => update(i, { value: v })} />
          <button className="remove" onClick={() => remove(i)} aria-label="Remover">
            <Icon name="x" size={14} />
          </button>
        </div>
      ))}
      <button className="add-row" onClick={add}>
        <Icon name="plus" size={13} /> {addLabel}
      </button>
    </div>
  );
};

// ===== Agent seal =====
const AgentSeal = ({ agent, event }) => {
  const meta = {
    Freud:    { initial: "F", label: "Freud — análise comportamental" },
    Moriarty: { initial: "M", label: "Moriarty — cálculos financeiros" },
    Athena:   { initial: "A", label: "Athena — conhecimento & nodos" },
  }[agent] || { initial: "?", label: agent };
  return (
    <span className={`agent-seal ${agent.toLowerCase()}`}>
      <span className="av">{meta.initial}</span>
      <span>{meta.label}{event ? <> · <span className="mono dim" style={{fontSize: 11}}>{event}</span></> : null}</span>
    </span>
  );
};

// ===== Educational disclaimer =====
const EducationalDisclaimer = ({ inline = false }) => (
  <div className={inline ? "row" : ""} style={{
    background: inline ? "transparent" : "var(--card-muted)",
    border: inline ? "0" : "1px dashed var(--border-strong)",
    color: "var(--ink-3)",
    padding: inline ? 0 : "10px 14px",
    borderRadius: 10,
    fontSize: 12,
    display: "flex",
    gap: 8,
    alignItems: "flex-start"
  }}>
    <Icon name="alert" size={13} />
    <span>Esta análise possui finalidade educacional e não representa recomendação de investimento.</span>
  </div>
);

// ===== Empty state =====
const EmptyState = ({ title, body, action, icon = "spark" }) => (
  <div style={{
    border: "1px dashed var(--border-strong)",
    background: "var(--bg-elev)",
    borderRadius: 14,
    padding: "40px 32px",
    textAlign: "center"
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: "#fff", border: "1px solid var(--border)",
      display: "grid", placeItems: "center", margin: "0 auto 14px", color: "var(--gold)"
    }}>
      <Icon name={icon} size={20} />
    </div>
    <div className="serif" style={{fontSize: 20, letterSpacing: -0.3, marginBottom: 6}}>{title}</div>
    <div className="muted" style={{fontSize: 13.5, maxWidth: 380, margin: "0 auto 16px"}}>{body}</div>
    {action}
  </div>
);

// ===== Toast =====
const Toast = ({ message, onDone }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [message]);
  if (!message) return null;
  return <div className="toast"><Icon name="check" size={14} /> {message}</div>;
};

// ===== Modal =====
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

// ===== Donut chart =====
const Donut = ({ segments, size = 160, thickness = 22 }) => {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--card-muted)" strokeWidth={thickness} />
      {segments.map((s, i) => {
        const len = (s.value / total) * c;
        const seg = (
          <circle
            key={i}
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
          />
        );
        offset += len;
        return seg;
      })}
    </svg>
  );
};

// ===== Helpers (categories meta) =====
const CATS = {
  fixos:        { label: "Gastos fixos",      color: "#1B3A5C" },
  variaveis:    { label: "Gastos variáveis",  color: "#5B7BA5" },
  assinaturas:  { label: "Assinaturas",       color: "#A6843D" },
  dividas:      { label: "Dívidas",           color: "#B23A3A" },
  sobra:        { label: "Sobra",             color: "#2F7A56" },
};

Object.assign(window, {
  Icon, Btn, MoneyInput, ExpenseListEditor,
  AgentSeal, EducationalDisclaimer, EmptyState,
  Toast, Modal, Donut,
  fmtBRL, fmtBRLCompact, fmtPct, CATS,
});
