import os

def write_note(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")

# --- PERMANENT NOTES ---
PERMANENT_NOTES = {
    "viés-de-ancoragem.md": """
---
domain: behavioral_finance
agent: supervisor
tags: [psicologia, vieses, comportamento]
confidence: high
---
# Viés de Ancoragem
Tendência humana de confiar excessivamente na primeira informação oferecida (a "âncora") ao tomar decisões.
Em finanças:
- Manter uma ação que caiu 80% porque você está ancorado no preço de compra.
- Achar que um produto está barato só porque tem uma etiqueta de "De R$ 1000 por R$ 500" (a âncora foi R$ 1000).
- Orçamento: ancorar seus gastos na sua renda atual, dificultando cortes (Inflação do estilo de vida).
""",
    "aversão-a-perda.md": """
---
domain: behavioral_finance
agent: investment_advisor
tags: [psicologia, risco, kahneman]
confidence: high
---
# Aversão à Perda
Conceito fundamental da Teoria da Perspectiva (Kahneman & Tversky). A dor de perder $100 é psicologicamente duas vezes mais forte do que a alegria de ganhar $100.
Consequências:
- Investidores vendem ativos vencedores muito cedo (para garantir lucro).
- Seguram ativos perdedores por muito tempo (esperando voltar ao preço pago).
- Perfil conservador exagerado que corrói patrimônio para a inflação.
""",
    "sunk-cost-fallacy.md": """
---
domain: behavioral_finance
agent: insights_agent
tags: [psicologia, falácia, assinaturas]
confidence: high
---
# Falácia do Custo Irrecuperável (Sunk Cost)
Continuar investindo tempo, dinheiro ou esforço em algo que já falhou, apenas porque você já investiu muito até agora.
Em finanças:
- Continuar pagando academia que não frequenta "para se motivar a ir".
- Manter o conserto infinito de um carro velho porque "já gastei muito nele".
- Não cancelar uma assinatura inútil porque já pagou o ano todo.
O dinheiro já foi gasto. Decisões futuras devem ser baseadas no benefício marginal futuro.
""",
    "juros-compostos.md": """
---
domain: investment
agent: investment_advisor
tags: [matemática, crescimento, tempo]
confidence: high
---
# Juros Compostos
Juros calculados sobre o principal inicial, mais todos os juros acumulados de períodos anteriores.
A oitava maravilha do mundo (atribuído a Einstein).
Fórmula: A = P (1 + r/n)^(nt)
O fator mais importante nos juros compostos não é a taxa de retorno (r), nem o montante inicial (P), mas o tempo (t), pois a função é exponencial em relação a ele.
""",
    "cagr.md": """
---
domain: investment
agent: investment_advisor
tags: [métricas, retorno, avaliação]
confidence: high
---
# CAGR (Compound Annual Growth Rate)
A taxa de retorno anualizada e constante que levaria o investimento do valor inicial ao valor final, assumindo reinvestimento total.
Útil para comparar investimentos com volatilidade diferente ao longo de vários anos, pois elimina as flutuações de curto prazo.
Se uma carteira sobe 100% num ano e cai 50% no outro, a média aritmética dos retornos é 25%, mas o CAGR é 0%.
""",
    "indice-sharpe.md": """
---
domain: investment
agent: investment_advisor
tags: [métricas, risco-retorno]
confidence: high
---
# Índice Sharpe
Métrica que avalia o retorno de um investimento ajustado pelo risco.
Fórmula: (Retorno do Ativo - Taxa Livre de Risco) / Volatilidade do Ativo
Indica quanto de excesso de retorno o investidor recebe por unidade de risco assumida.
O **Investment Advisor** usa a otimização de Markowitz para tentar maximizar o Sharpe Ratio da carteira do usuário.
""",
    "drawdown.md": """
---
domain: investment
agent: investment_advisor
tags: [métricas, risco, queda]
confidence: high
---
# Drawdown
Medida da queda do valor de um investimento a partir do seu pico histórico até o seu vale.
Expressa em porcentagem. O *Maximum Drawdown* (MDD) é o pior cenário possível sofrido por um investidor que comprou no topo e vendeu no fundo.
Métrica crucial para alinhar portfólio com perfil de risco: o usuário aguenta ver seu patrimônio cair 40% sem entrar em pânico?
""",
    "criterio-de-kelly.md": """
---
domain: investment
agent: investment_advisor
tags: [matemática, aposta, alocação]
confidence: high
---
# Critério de Kelly
Fórmula matemática usada para determinar o tamanho ótimo de uma série de apostas ou investimentos para maximizar a taxa de crescimento a longo prazo do capital.
Fórmula básica: f* = p - q/b (onde p=prob. ganhar, q=prob. perder, b=odds).
A lição principal de Kelly para finanças pessoais: nunca arrisque 100% do seu capital, mesmo em apostas favoráveis, pois o risco de ruína (ir a zero) encerra o jogo.
""",
    "monte-carlo.md": """
---
domain: financial_planning
agent: supervisor
tags: [matemática, simulação, aposentadoria]
confidence: high
---
# Simulação de Monte Carlo
Técnica estatística que roda milhares de cenários usando variáveis aleatórias baseadas em distribuições de probabilidade históricas.
Em finanças: usada para testar o **Pilar da Liberdade**. Qual a chance de o seu dinheiro acabar antes de você morrer, considerando inflação estocástica, volatilidade do mercado e saques anuais?
Garante que planos de aposentadoria não confiem em "rentabilidade linear constante", que não existe na vida real.
""",
    "movimento-fire.md": """
---
domain: financial_planning
agent: supervisor
tags: [aposentadoria, liberdade, independência]
confidence: high
---
# FIRE (Financial Independence, Retire Early)
Movimento focado em extrema poupança e investimento para alcançar a independência financeira muito antes da idade tradicional de aposentadoria.
Baseia-se fortemente na [[regra-dos-4-porcento]] (TSR - Trinity Study Rule).
Variações:
- LeanFIRE: Aposentar com gastos mínimos.
- FatFIRE: Aposentar mantendo alto padrão de vida.
- BaristaFIRE: Aposentar-se da carreira principal, mas trabalhar part-time para cobrir custos de saúde/básicos.
""",
    "regra-dos-4-porcento.md": """
---
domain: financial_planning
agent: supervisor
tags: [aposentadoria, fire, saques]
confidence: high
---
# Regra dos 4% (Estudo Trinity)
Regra de bolso baseada no Trinity Study: você pode retirar 4% do seu portfólio inicial (ajustado anualmente pela inflação) e, historicamente, o dinheiro não acabará num período de 30 anos (com portfólio 50% ações / 50% bonds).
Críticas: 4% pode ser otimista demais no cenário macroeconômico atual. Alguns advogam 3% ou 3.5% para segurança (Safe Withdrawal Rate).
Para chegar na meta de FIRE: Custo Anual x 25 = Patrimônio Necessário.
""",
}

# --- LITERATURE NOTES ---
LITERATURE_NOTES = {
    "thinking-fast-and-slow-kahneman.md": """
---
domain: behavioral_finance
agent: supervisor
tags: [literatura, livro, psicologia, kahneman]
source: "Thinking, Fast and Slow — Daniel Kahneman (2011)"
confidence: high
---
# Thinking, Fast and Slow — Daniel Kahneman
A bíblia da economia comportamental.
Divide a mente em:
- **Sistema 1**: Rápido, intuitivo, automático, emocional.
- **Sistema 2**: Devagar, deliberativo, lógico, calculista.
Muitos erros financeiros ocorrem porque decisões de dinheiro (que exigem Sistema 2) são feitas com o Sistema 1 (compras por impulso, pânico na bolsa).
O **FinTrack** visa ser o Sistema 2 artificial do usuário.
""",
    "intelligent-investor-graham.md": """
---
domain: investment
agent: investment_advisor
tags: [literatura, livro, value-investing, graham]
source: "The Intelligent Investor — Benjamin Graham (1949)"
confidence: high
---
# The Intelligent Investor — Benjamin Graham
O livro definitivo sobre Value Investing (Investimento em Valor).
Conceitos-chave:
- **Mr. Market**: Metáfora para o mercado. Ele é maníaco-depressivo. Não deixe que os preços dele ditem o valor intrínseco do ativo.
- **Margem de Segurança**: Comprar o ativo muito abaixo do seu valor intrínseco calculado para proteger contra erros de cálculo ou azar.
- Investidor defensivo vs. empreendedor.
""",
    "little-book-of-common-sense-investing-bogle.md": """
---
domain: investment
agent: investment_advisor
tags: [literatura, livro, etfs, bogle]
source: "The Little Book of Common Sense Investing — John C. Bogle (2007)"
confidence: high
---
# The Little Book of Common Sense Investing — John C. Bogle
Bogle é o criador do primeiro fundo de índice (Vanguard) e revolucionou o investimento para a pessoa física.
Tese: Não tente encontrar a agulha no palheiro; compre o palheiro inteiro.
O investimento em fundos de índice (ETFs) amplamente diversificados e de baixíssimo custo bate a grande maioria dos fundos geridos ativamente no longo prazo.
Custos importam: taxas de administração corroem os [[juros-compostos]] implacavelmente.
""",
    "nudge-thaler.md": """
---
domain: behavioral_finance
agent: supervisor
tags: [literatura, livro, economia-comportamental, thaler]
source: "Nudge — Richard Thaler & Cass Sunstein (2008)"
confidence: high
---
# Nudge — Richard Thaler
Explora a "arquitetura de escolha".
Um *nudge* (empurrãozinho) é qualquer intervenção no ambiente de escolha que altera o comportamento das pessoas de forma previsível sem proibir opções ou mudar os incentivos econômicos (ex: opt-out automático em previdência privada em vez de opt-in).
O FinTrack usa o conceito de nudges por meio das notificações do **Insights Agent** para alterar padrões de consumo de forma suave, sem proibições rígidas.
""",
    "portfolio-selection-markowitz-1952.md": """
---
domain: investment
agent: investment_advisor
tags: [literatura, paper, markowitz, teoria-moderna-portfolio]
source: "Portfolio Selection — Harry Markowitz (Journal of Finance, 1952)"
confidence: high
---
# Portfolio Selection — Harry Markowitz (1952)
O paper fundador da Teoria Moderna do Portfólio (MPT).
Mostrou matematicamente que o risco de um portfólio não é a soma simples dos riscos dos seus componentes, graças à variância e covariância (correlação) entre os ativos.
Origem do conceito de [[fronteira-eficiente]].
""",
}

# --- FLEETING NOTES ---
FLEETING_NOTES = {
    "ideia-gamificacao-anti-impulsos.md": """
---
domain: spending_patterns
agent: insights_agent
tags: [fleeting, ideia, gamificação, impulso]
confidence: low
---
# Ideia: Gamificação Anti-Impulso
E se o app tiver um "Botão de Desejo"? Quando a pessoa quer muito comprar algo supérfluo, ela aperta o botão. O app "congela" o dinheiro na meta por 48 horas.
Se depois de 48h ela ainda quiser, o app libera. (Evita compras com o Sistema 1 do Kahneman).
Poderia usar o Redis com TTL de 48h para controlar o estado da intenção de compra.
""",
    "reflexao-sobre-inflacao-oculta.md": """
---
domain: budget
agent: budget_advisor
tags: [fleeting, reflexão, inflação]
confidence: medium
---
# Reflexão sobre a inflação real vs IPCA
O IPCA é a inflação média, mas a inflação pessoal de alguém (especialmente de alta renda) é diferente. Serviços (escola, médico, diarista) sobem mais rápido que produtos.
O Budget Advisor poderia calcular o "IPCA Pessoal" baseado no histórico das compras reais nos últimos anos? Isso afetaria o planejamento do [[monte-carlo]] para aposentadoria.
""",
    "ideia-smart-alerts-assinaturas.md": """
---
domain: subscriptions
agent: subscription_auditor
tags: [fleeting, ideia, assinaturas]
confidence: low
---
# Ideia: Smart Alerts para Trials
Usar a feature de e-mail parsing? Se detectar um e-mail de "Welcome to your free trial", o Subscription Auditor automaticamente cria um lembrete (agendado) para 1 dia antes do trial expirar, avisando para cancelar.
Isso combateria a [[sunk-cost-fallacy]] e as armadilhas de [[trial-que-vira-cobranca]].
"""
}

def create_files(base_dir, notes_dict):
    os.makedirs(base_dir, exist_ok=True)
    for filename, content in notes_dict.items():
        write_note(os.path.join(base_dir, filename), content)

if __name__ == "__main__":
    create_files("vault/10-Permanent", PERMANENT_NOTES)
    create_files("vault/20-Literature", LITERATURE_NOTES)
    create_files("vault/30-Fleeting", FLEETING_NOTES)
    print("✅ Vault expansion generated successfully.")
