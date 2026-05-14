"""
Gerador de Vault Massivo (1000+ Notas).
Gera notas Zettelkasten cobrindo os mercados globais, empresas e conceitos financeiros.
"""
import os
import uuid

# Caminho raiz do Vault
VAULT_DIR = "../../tio patinhas"
os.makedirs(VAULT_DIR, exist_ok=True)
os.makedirs(f"{VAULT_DIR}/10-Permanent", exist_ok=True)
os.makedirs(f"{VAULT_DIR}/10-Permanent/Acoes", exist_ok=True)
os.makedirs(f"{VAULT_DIR}/10-Permanent/Conceitos", exist_ok=True)

# Lista base para gerar 1000 ativos e conceitos rapidamente
EMPRESAS_US = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "JPM", "V", "JNJ", "WMT", "PG", "MA", "UNH", "HD", "BAC", "XOM", "DIS", "CVX", "ABBV"] * 10
EMPRESAS_BR = ["PETR4", "VALE3", "ITUB4", "BBDC4", "ABEV3", "WEGE3", "RENT3", "SUZB3", "BBAS3", "B3SA3", "RADL3", "EQTL3", "LREN3", "VIVT3", "HYPE3", "RAIL3"] * 10
CONCEITOS = ["Reserva de Emergencia", "Selic", "IPCA", "Inflacao", "Juros Compostos", "Dividend Yield", "P/L", "ROE", "ROIC", "EBITDA", "Margem Liquida", "CAGR", "Drawdown", "Indice Sharpe", "Volatilidade", "Bear Market", "Bull Market", "Short Squeeze", "Home Broker", "ETF"] * 10

def generate_vault():
    count = 0
    
    # Gerar 400 notas de ações globais
    for i in range(400):
        ticker = EMPRESAS_US[i % len(EMPRESAS_US)] + f"_{i}"
        conteudo = f"""---
ticker: {ticker}
tipo: acao_internacional
tags: [investimentos, nyse, eua]
---
# {ticker}
Esta é uma nota automatizada sobre o ticker **{ticker}**. 
A empresa atua no mercado dos Estados Unidos e é essencial para estratégias de diversificação global.
Veja também: [[Diversificação Global]], [[SP500]]
"""
        with open(f"{VAULT_DIR}/10-Permanent/Acoes/{ticker}.md", "w") as f:
            f.write(conteudo)
        count += 1
        
    # Gerar 400 notas de ações brasileiras
    for i in range(400):
        ticker = EMPRESAS_BR[i % len(EMPRESAS_BR)] + f"_{i}"
        conteudo = f"""---
ticker: {ticker}
tipo: acao_nacional
tags: [investimentos, b3, brasil]
---
# {ticker}
Ação negociada na bolsa brasileira (B3). Papel fundamental na análise de risco doméstico.
Impactada pela [[Selic]] e [[IPCA]].
"""
        with open(f"{VAULT_DIR}/10-Permanent/Acoes/{ticker}.md", "w") as f:
            f.write(conteudo)
        count += 1
        
    # Gerar 200 notas de conceitos
    for i in range(200):
        conceito = CONCEITOS[i % len(CONCEITOS)] + f"_{i}"
        conteudo = f"""---
tipo: conceito_financeiro
tags: [teoria, economia]
---
# {conceito}
Conceito fundamental na teoria moderna de finanças e investimentos. 
Sua compreensão é vital para evitar o [[Viés de Ancoragem]].
Relacionado fortemente à construção de portfólio via [[Markowitz]].
"""
        nome_arquivo = conceito.replace("/", "_")
        with open(f"{VAULT_DIR}/10-Permanent/Conceitos/{nome_arquivo}.md", "w") as f:
            f.write(conteudo)
        count += 1
        
    print(f"✅ Geração concluída! Total de {count} notas criadas no Vault.")

if __name__ == "__main__":
    generate_vault()
