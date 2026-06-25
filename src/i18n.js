const i18n = {
  pt: {
    // Header
    "skipToContent": "Pular para o conteúdo",
    "appTitle": "Tio Patinhas",
    "appTag": "Seu gestor financeiro",
    "a11yBtn": "Acessibilidade",
    
    // Acessibility panel
    "a11yPanelTitle": "Ajustes de acessibilidade visual",
    "a11yPanelSub": "Personalize a leitura da tela conforme sua necessidade.",
    "fontSize": "Tamanho da fonte",
    "fsMinus": "A−",
    "fsDefault": "Padrão",
    "fsPlus": "A+",
    "highContrast": "Alto contraste",
    "darkMode": "Modo noturno",
    "btnDisabled": "Desativado",
    "btnEnabled": "Ativado",
    
    // Navigation
    "tabFinance": "Finanças",
    "tabAssistant": "Assistente",
    "tabSim": "Simulador",
    
    // Screen 1: Finance
    "cardIncome": "Minha renda",
    "cardIncomeSub": "Informe suas fontes de renda.",
    "phIncome": "Ex.: Salário",
    "cardFixed": "Gastos fixos",
    "cardFixedSub": "Contas que se repetem todo mês.",
    "phFixed": "Ex.: Aluguel",
    "cardVar": "Gastos variáveis",
    "cardVarSub": "Mudam de mês para mês.",
    "phVar": "Ex.: Mercado",
    "cardSubs": "Assinaturas",
    "cardSubsSub": "Serviços recorrentes.",
    "phSubs": "Ex.: Streaming",
    "btnAdd": "+ Adicionar",
    
    // Summary
    "cardSummary": "Resumo do mês",
    "cardSummarySub": "Atualiza automaticamente.",
    "kpiIncome": "Receita",
    "kpiExpenses": "Despesas",
    "kpiBalance": "Saldo disponível",
    "commitment": "Comprometimento da renda",
    "legFixed": "Fixos",
    "legVar": "Variáveis",
    "legSubs": "Assinaturas",
    "adviceTitle": "Dica do Tio Patinhas:",
    
    // Screen 2: Assistant
    "astName": "Assistente Patinhas",
    "astStatus": "online — tire suas dúvidas financeiras",
    "botMsg1": "Oi! Eu sou o assistente do Tio Patinhas. Posso te ajudar a entender seus gastos, sugerir economias e explicar investimentos. O que você quer saber?",
    "userMsg1": "Estou gastando demais com assinaturas, o que faço?",
    "botMsg2": "Boa pergunta! Você tem 3 assinaturas somando R$ 89,70/mês — isso dá <b>R$ 1.076</b> por ano. Que tal revisar quais você realmente usa? Posso te mostrar onde cortar.",
    "chip1": "Como economizar?",
    "chip2": "Quanto posso investir?",
    "chip3": "Explique a poupança",
    "chatPlaceholder": "Escreva sua mensagem...",
    "astFootnote": "Protótipo: o assistente apresenta respostas pré-definidas para demonstrar a experiência da conversa (não conectado a uma IA real nesta versão).",
    
    // Screen 3: Simulator
    "simTitle": "Simulador de investimentos",
    "simSub": "Veja quanto seu dinheiro pode render.",
    "simType": "Tipo de aplicação",
    "simSave": "Poupança",
    "simBonds": "CDB / Tesouro",
    "simStocks": "Ações",
    "simInit": "Valor inicial",
    "simMonth": "Aporte mensal",
    "simPeriod": "Período:",
    "simBtn": "Simular rendimento",
    "simFootnote": "Taxas médias usadas apenas para simulação educativa. Investimentos em ações têm risco e podem ter rentabilidade negativa.",
    
    // Sim Results
    "resTitle": "Resultado da simulação",
    "resTotal": "Total investido",
    "resFinal": "Valor final",
    "resGain": "Rendimento ganho",
    "cmpTitle": "Compare as opções",
    "cmpApp": "Aplicação",
    "cmpFinal": "Valor final",
    "cmpRisk": "Risco",
    "riskLow": "baixo risco",
    "riskMid": "risco médio",
    "riskHigh": "risco alto",
    
    // Dynamic text
    "dynUseTxt": (pct) => `Você compromete ${pct.toFixed(0)}% da sua renda com despesas.`,
    "dynAdvNone": "Informe sua renda para começar a planejar.",
    "dynAdvNeg": (val) => `Atenção! Suas despesas passam a renda em ${val}. Reveja os gastos variáveis primeiro.`,
    "dynAdvSubs": (ta, half) => `Suas assinaturas custam ${ta}/mês. Cortando metade você guarda ${half} por mês.`,
    "dynAdvHigh": (pct) => `Você usa ${pct.toFixed(0)}% da renda. Tente manter as despesas abaixo de 70% e poupe o resto.`,
    "dynAdvOk": (saldo) => `Muito bem! Sobram ${saldo}. Que tal investir parte disso? Veja a aba Simulador.`,
    "dynAstReply1": "Comece pelos gastos variáveis e assinaturas — costumam ter mais gordura para cortar. Definir um teto mensal para mercado e lazer já ajuda muito.",
    "dynAstReply2": "Pelo seu resumo, sobra um saldo no fim do mês. Uma boa regra é investir entre 10% e 20% da renda. Simule na aba Simulador para ver o rendimento.",
    "dynAstReply3": "A poupança rende cerca de 0,5% ao mês, é segura e você pode sacar quando quiser — ótima para reserva de emergência, mas rende menos que CDB ou Tesouro.",
    "dynAstDefault": "Ótima pergunta! Nesta versão de protótipo eu respondo a alguns temas pré-definidos. Em breve estarei conectado a uma IA completa.",
    "dynMonths": "meses",
    "dynToday": "hoje"
  },
  en: {
    // Header
    "skipToContent": "Skip to content",
    "appTitle": "Uncle Scrooge",
    "appTag": "Your financial manager",
    "a11yBtn": "Accessibility",
    
    // Acessibility panel
    "a11yPanelTitle": "Visual accessibility settings",
    "a11yPanelSub": "Customize screen reading according to your needs.",
    "fontSize": "Font size",
    "fsMinus": "A−",
    "fsDefault": "Default",
    "fsPlus": "A+",
    "highContrast": "High contrast",
    "darkMode": "Dark mode",
    "btnDisabled": "Disabled",
    "btnEnabled": "Enabled",
    
    // Navigation
    "tabFinance": "Finances",
    "tabAssistant": "Assistant",
    "tabSim": "Simulator",
    
    // Screen 1: Finance
    "cardIncome": "My income",
    "cardIncomeSub": "Enter your income sources.",
    "phIncome": "Ex.: Salary",
    "cardFixed": "Fixed expenses",
    "cardFixedSub": "Bills that repeat every month.",
    "phFixed": "Ex.: Rent",
    "cardVar": "Variable expenses",
    "cardVarSub": "Change from month to month.",
    "phVar": "Ex.: Groceries",
    "cardSubs": "Subscriptions",
    "cardSubsSub": "Recurring services.",
    "phSubs": "Ex.: Streaming",
    "btnAdd": "+ Add",
    
    // Summary
    "cardSummary": "Monthly summary",
    "cardSummarySub": "Updates automatically.",
    "kpiIncome": "Income",
    "kpiExpenses": "Expenses",
    "kpiBalance": "Available balance",
    "commitment": "Income commitment",
    "legFixed": "Fixed",
    "legVar": "Variable",
    "legSubs": "Subscriptions",
    "adviceTitle": "Uncle Scrooge's tip:",
    
    // Screen 2: Assistant
    "astName": "Assistant Scrooge",
    "astStatus": "online — ask your financial questions",
    "botMsg1": "Hi! I'm Uncle Scrooge's assistant. I can help you understand your expenses, suggest savings, and explain investments. What do you want to know?",
    "userMsg1": "I'm spending too much on subscriptions, what should I do?",
    "botMsg2": "Great question! You have 3 subscriptions totaling R$ 89.70/month — that's <b>R$ 1,076</b> per year. How about reviewing which ones you actually use? I can show you where to cut.",
    "chip1": "How to save?",
    "chip2": "How much can I invest?",
    "chip3": "Explain savings account",
    "chatPlaceholder": "Type your message...",
    "astFootnote": "Prototype: the assistant presents predefined answers to demonstrate the conversation experience (not connected to a real AI in this version).",
    
    // Screen 3: Simulator
    "simTitle": "Investment simulator",
    "simSub": "See how much your money can yield.",
    "simType": "Investment type",
    "simSave": "Savings",
    "simBonds": "Bonds / Treasury",
    "simStocks": "Stocks",
    "simInit": "Initial value",
    "simMonth": "Monthly contribution",
    "simPeriod": "Period:",
    "simBtn": "Simulate yield",
    "simFootnote": "Average rates used only for educational simulation. Stock investments have risk and can have negative returns.",
    
    // Sim Results
    "resTitle": "Simulation result",
    "resTotal": "Total invested",
    "resFinal": "Final value",
    "resGain": "Yield gained",
    "cmpTitle": "Compare options",
    "cmpApp": "Investment",
    "cmpFinal": "Final value",
    "cmpRisk": "Risk",
    "riskLow": "low risk",
    "riskMid": "medium risk",
    "riskHigh": "high risk",
    
    // Dynamic text
    "dynUseTxt": (pct) => `You commit ${pct.toFixed(0)}% of your income to expenses.`,
    "dynAdvNone": "Enter your income to start planning.",
    "dynAdvNeg": (val) => `Attention! Your expenses exceed income by ${val}. Review variable expenses first.`,
    "dynAdvSubs": (ta, half) => `Your subscriptions cost ${ta}/month. Cutting half saves you ${half} a month.`,
    "dynAdvHigh": (pct) => `You use ${pct.toFixed(0)}% of your income. Try to keep expenses below 70% and save the rest.`,
    "dynAdvOk": (saldo) => `Well done! You have ${saldo} left. How about investing part of it? Check the Simulator tab.`,
    "dynAstReply1": "Start with variable expenses and subscriptions — they usually have more fat to trim. Setting a monthly cap for groceries and leisure helps a lot.",
    "dynAstReply2": "From your summary, you have a balance at the end of the month. A good rule is to invest between 10% and 20% of your income. Simulate in the Simulator tab to see the yield.",
    "dynAstReply3": "Savings yield about 0.5% per month, are safe, and you can withdraw anytime — great for an emergency fund, but yield less than Bonds or Treasury.",
    "dynAstDefault": "Great question! In this prototype version I answer a few predefined topics. I'll be connected to a full AI soon.",
    "dynMonths": "months",
    "dynToday": "today"
  }
};

let currentLang = 'pt';

function toggleLanguage() {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  applyLanguage();
  document.getElementById('langToggle').textContent = currentLang === 'pt' ? 'EN' : 'PT';
  document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';
}

function applyLanguage() {
  const dict = i18n[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });
  
  // Trigger recalcs to update dynamic texts
  if (typeof calc === 'function') calc();
  if (typeof simulate === 'function') simulate();
  
  // Update toggle buttons logic (accessibility panel)
  updateA11yButtonsText();
}

function updateA11yButtonsText() {
  const cb = document.getElementById('contrastBtn');
  const db = document.getElementById('darkModeBtn');
  if (cb) {
    const on = document.body.classList.contains('contrast');
    cb.textContent = on ? i18n[currentLang].btnEnabled : i18n[currentLang].btnDisabled;
  }
  if (db) {
    const on = document.body.classList.contains('dark');
    db.textContent = on ? i18n[currentLang].btnEnabled : i18n[currentLang].btnDisabled;
  }
}

// Add global event listener for language toggle once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleLanguage);
  }
});
