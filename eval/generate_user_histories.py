"""
Gerador de User Histories simuladas para o FinTrack.
Cria 5 perfis de usuário em estágios diferentes com 100+ transações cada.
Total: 500+ transações realistas com valores brasileiros.
"""
import json
import random
import uuid
from datetime import date, timedelta
from decimal import Decimal

random.seed(42)

# === PERFIS DE USUÁRIO ===
USERS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Ana Silva",
        "email": "ana.silva@email.com",
        "role": "USER",
        "profile": "conservador",
        "monthly_income": 4500.00,
        "stage": "mes_1",
        "description": "Recém-formada, primeiro emprego. Começando a controlar finanças. Sem fundo de emergência.",
        "start_date": "2026-04-01",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Bruno Oliveira",
        "email": "bruno.oliveira@email.com",
        "role": "USER",
        "profile": "moderado",
        "monthly_income": 7200.00,
        "stage": "mes_3",
        "description": "Desenvolvedor pleno. 3 meses usando o app. Já tem orçamento base zero configurado.",
        "start_date": "2026-02-01",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Carla Mendes",
        "email": "carla.mendes@email.com",
        "role": "USER",
        "profile": "arrojado",
        "monthly_income": 12000.00,
        "stage": "mes_6",
        "description": "Gerente de marketing. 6 meses no app. Investe ativamente, tem fundo de emergência.",
        "start_date": "2025-11-01",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Daniel Costa",
        "email": "daniel.costa@email.com",
        "role": "USER",
        "profile": "conservador",
        "monthly_income": 3200.00,
        "stage": "mes_12",
        "description": "Professor. 12 meses no app. Renda menor, mas disciplinado. Poupou consistentemente.",
        "start_date": "2025-05-01",
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Elena Rodrigues",
        "email": "elena.rodrigues@email.com",
        "role": "USER",
        "profile": "moderado",
        "monthly_income": 18000.00,
        "stage": "mes_24",
        "description": "Médica. 24 meses no app. Alta renda, muitas assinaturas, investimentos diversificados.",
        "start_date": "2024-05-01",
    },
]

# === CATEGORIAS E SUBCATEGORIAS ===
FIXED_EXPENSES = {
    "Moradia": [
        ("Aluguel", 800, 3500),
        ("Condomínio", 200, 900),
        ("IPTU (parcela)", 80, 400),
    ],
    "Utilidades": [
        ("Conta de luz", 80, 350),
        ("Conta de água", 40, 150),
        ("Gás encanado", 30, 100),
        ("Internet", 89, 200),
        ("Celular", 45, 120),
    ],
    "Saúde": [
        ("Plano de saúde", 200, 800),
        ("Academia", 60, 200),
    ],
    "Transporte": [
        ("Seguro do carro", 120, 400),
        ("Financiamento carro (parcela)", 500, 1500),
    ],
    "Educação": [
        ("Faculdade/Pós", 300, 2000),
        ("Curso online", 30, 150),
    ],
}

SUBSCRIPTIONS = [
    ("Netflix", 39.90, "streaming"),
    ("Spotify", 21.90, "streaming"),
    ("Disney+", 33.90, "streaming"),
    ("Amazon Prime", 14.90, "streaming"),
    ("YouTube Premium", 24.90, "streaming"),
    ("HBO Max", 34.90, "streaming"),
    ("Apple Music", 21.90, "streaming"),
    ("iCloud 200GB", 10.90, "cloud"),
    ("Google One 100GB", 6.99, "cloud"),
    ("Notion", 0, "produtividade"),
    ("ChatGPT Plus", 104.90, "produtividade"),
    ("GitHub Copilot", 50.00, "produtividade"),
    ("Adobe Creative Cloud", 112.00, "produtividade"),
    ("Canva Pro", 34.90, "produtividade"),
    ("Headspace", 29.90, "saude"),
    ("Strava", 31.90, "saude"),
    ("Duolingo Plus", 39.90, "educacao"),
    ("Alura", 89.90, "educacao"),
    ("Coursera Plus", 199.00, "educacao"),
    ("Xbox Game Pass", 44.90, "entretenimento"),
    ("PlayStation Plus", 42.90, "entretenimento"),
    ("Crunchyroll", 14.99, "entretenimento"),
    ("Globoplay", 24.90, "streaming"),
    ("Paramount+", 19.90, "streaming"),
]

VARIABLE_EXPENSES = {
    "Alimentação": [
        ("Supermercado", 80, 600),
        ("Feira", 30, 120),
        ("Padaria", 5, 40),
        ("Delivery iFood", 25, 80),
        ("Delivery Rappi", 20, 70),
        ("Restaurante almoço", 25, 60),
        ("Restaurante jantar", 50, 180),
        ("Café cafeteria", 8, 25),
        ("Lanchonete", 10, 35),
    ],
    "Transporte": [
        ("Combustível", 100, 400),
        ("Uber/99", 10, 50),
        ("Estacionamento", 5, 25),
        ("Pedágio", 5, 20),
        ("Manutenção carro", 100, 800),
        ("Lavagem carro", 30, 80),
    ],
    "Saúde": [
        ("Farmácia", 15, 150),
        ("Consulta médica", 100, 400),
        ("Exame laboratorial", 50, 300),
        ("Dentista", 100, 500),
    ],
    "Lazer": [
        ("Cinema", 25, 60),
        ("Teatro/Show", 50, 250),
        ("Bar", 30, 150),
        ("Viagem (hospedagem)", 200, 1500),
        ("Viagem (passagem)", 300, 2000),
        ("Livro", 25, 80),
        ("Jogo", 50, 250),
        ("Hobby/Material", 20, 200),
    ],
    "Vestuário": [
        ("Roupa", 50, 300),
        ("Calçado", 80, 400),
        ("Acessório", 20, 150),
    ],
    "Pets": [
        ("Ração", 80, 200),
        ("Veterinário", 100, 500),
        ("Banho e tosa", 40, 100),
        ("Petshop acessórios", 20, 100),
    ],
    "Casa": [
        ("Produto de limpeza", 15, 60),
        ("Manutenção doméstica", 50, 500),
        ("Decoração", 30, 300),
        ("Eletrodoméstico", 100, 2000),
    ],
    "Presentes": [
        ("Presente aniversário", 50, 300),
        ("Presente natal", 80, 500),
        ("Presente dia dos namorados", 50, 250),
    ],
}

def generate_fixed_for_user(user, months):
    """Gera gastos fixos mensais para N meses."""
    transactions = []
    income_ratio = user["monthly_income"] / 7000
    start = date.fromisoformat(user["start_date"])

    for month_offset in range(months):
        month_date = start + timedelta(days=30 * month_offset)
        
        # Salário
        transactions.append({
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "amount": float(user["monthly_income"]),
            "category": "Renda",
            "description": "Salário mensal",
            "date": (month_date + timedelta(days=4)).isoformat(),
            "type": "income",
        })
        
        # Gastos fixos selecionados com base na renda
        for cat, items in FIXED_EXPENSES.items():
            for desc, min_val, max_val in items:
                if random.random() < 0.6:
                    val = round(min_val + (max_val - min_val) * income_ratio * random.uniform(0.7, 1.0), 2)
                    val = min(val, max_val)
                    transactions.append({
                        "id": str(uuid.uuid4()),
                        "user_id": user["id"],
                        "amount": val,
                        "category": cat,
                        "description": desc,
                        "date": (month_date + timedelta(days=random.randint(1, 10))).isoformat(),
                        "type": "fixed",
                    })
    return transactions

def generate_subscriptions_for_user(user, months):
    """Gera cobranças de assinaturas mensais."""
    transactions = []
    start = date.fromisoformat(user["start_date"])
    
    # Cada usuário tem entre 3 e 10 assinaturas
    num_subs = min(3 + int(user["monthly_income"] / 3000), 10)
    user_subs = random.sample(SUBSCRIPTIONS, num_subs)
    
    for month_offset in range(months):
        month_date = start + timedelta(days=30 * month_offset)
        for name, price, sub_cat in user_subs:
            if price == 0:
                continue
            # Variação de ±5% no preço (reajustes)
            actual_price = round(price * random.uniform(0.95, 1.05), 2)
            transactions.append({
                "id": str(uuid.uuid4()),
                "user_id": user["id"],
                "amount": actual_price,
                "category": "Assinaturas",
                "description": f"{name} ({sub_cat})",
                "date": (month_date + timedelta(days=random.randint(1, 5))).isoformat(),
                "type": "subscription",
            })
    return transactions

def generate_variable_for_user(user, months):
    """Gera gastos variáveis realistas com sazonalidade e anomalias."""
    transactions = []
    income_ratio = user["monthly_income"] / 7000
    start = date.fromisoformat(user["start_date"])
    
    for month_offset in range(months):
        month_date = start + timedelta(days=30 * month_offset)
        month_num = (month_date.month)
        
        # Sazonalidade: dezembro gasta mais (natal), janeiro (férias/IPVA)
        seasonal_multiplier = 1.0
        if month_num == 12:
            seasonal_multiplier = 1.4
        elif month_num == 1:
            seasonal_multiplier = 1.2
        elif month_num == 7:
            seasonal_multiplier = 1.15  # férias de julho
        
        for cat, items in VARIABLE_EXPENSES.items():
            for desc, min_val, max_val in items:
                # Nem todo gasto acontece todo mês
                frequency = 0.35 if cat in ["Presentes", "Vestuário", "Pets"] else 0.55
                if random.random() < frequency:
                    base_val = min_val + (max_val - min_val) * income_ratio * random.uniform(0.3, 0.8)
                    val = round(base_val * seasonal_multiplier, 2)
                    val = max(min_val, min(val, max_val))
                    
                    # Anomalia: 3% de chance de gasto muito acima do normal
                    if random.random() < 0.03:
                        val = round(val * random.uniform(2.5, 4.0), 2)
                        desc = f"{desc} (ANOMALIA)"
                    
                    day = random.randint(1, 28)
                    transactions.append({
                        "id": str(uuid.uuid4()),
                        "user_id": user["id"],
                        "amount": val,
                        "category": cat,
                        "description": desc,
                        "date": (month_date.replace(day=1) + timedelta(days=day - 1)).isoformat(),
                        "type": "variable",
                    })
    return transactions

def generate_budgets(user):
    """Gera orçamentos por categoria para cada usuário."""
    income = user["monthly_income"]
    return {
        "user_id": user["id"],
        "monthly_income": income,
        "budgets": {
            "Moradia": round(income * 0.30, 2),
            "Alimentação": round(income * 0.15, 2),
            "Transporte": round(income * 0.10, 2),
            "Saúde": round(income * 0.08, 2),
            "Educação": round(income * 0.05, 2),
            "Lazer": round(income * 0.10, 2),
            "Assinaturas": round(income * 0.05, 2),
            "Vestuário": round(income * 0.03, 2),
            "Poupança": round(income * 0.14, 2),
        },
        "strategy": "regra-50-30-20" if user["profile"] == "conservador" else "orcamento-base-zero",
    }

def generate_goals(user):
    """Gera metas financeiras por perfil."""
    goals = []
    if user["stage"] in ["mes_1", "mes_3"]:
        goals.append({
            "name": "Fundo de emergência",
            "target": round(user["monthly_income"] * 6, 2),
            "current": round(user["monthly_income"] * random.uniform(0.2, 1.5), 2),
            "deadline": "2027-01-01",
            "priority": "alta",
        })
    if user["stage"] in ["mes_6", "mes_12", "mes_24"]:
        goals.append({
            "name": "Fundo de emergência",
            "target": round(user["monthly_income"] * 6, 2),
            "current": round(user["monthly_income"] * random.uniform(3, 6), 2),
            "deadline": "2026-06-01",
            "priority": "alta",
        })
        goals.append({
            "name": "Viagem internacional",
            "target": 15000.00,
            "current": round(random.uniform(2000, 10000), 2),
            "deadline": "2027-06-01",
            "priority": "média",
        })
    if user["profile"] in ["moderado", "arrojado"]:
        goals.append({
            "name": "Carteira de investimentos",
            "target": round(user["monthly_income"] * 24, 2),
            "current": round(user["monthly_income"] * random.uniform(2, 12), 2),
            "deadline": "2028-01-01",
            "priority": "média",
        })
    if user["stage"] == "mes_24":
        goals.append({
            "name": "Entrada apartamento",
            "target": 80000.00,
            "current": round(random.uniform(20000, 55000), 2),
            "deadline": "2028-06-01",
            "priority": "alta",
        })
    return {"user_id": user["id"], "goals": goals}

# === GERAÇÃO PRINCIPAL ===
def main():
    months_map = {"mes_1": 1, "mes_3": 3, "mes_6": 6, "mes_12": 12, "mes_24": 24}
    
    all_transactions = []
    all_budgets = []
    all_goals = []
    
    for user in USERS:
        months = months_map[user["stage"]]
        fixed = generate_fixed_for_user(user, months)
        subs = generate_subscriptions_for_user(user, months)
        variable = generate_variable_for_user(user, months)
        
        all_transactions.extend(fixed)
        all_transactions.extend(subs)
        all_transactions.extend(variable)
        all_budgets.append(generate_budgets(user))
        all_goals.append(generate_goals(user))
    
    # Ordenar por data
    all_transactions.sort(key=lambda t: t["date"])
    
    dataset = {
        "metadata": {
            "generated_at": "2026-05-14",
            "total_users": len(USERS),
            "total_transactions": len(all_transactions),
            "description": "Dataset simulado de transações financeiras brasileiras para treino e avaliação dos agentes do FinTrack.",
        },
        "users": USERS,
        "transactions": all_transactions,
        "budgets": all_budgets,
        "goals": all_goals,
    }
    
    with open("user_histories.json", "w", encoding="utf-8") as f:
        json.dump(dataset, f, ensure_ascii=False, indent=2, default=str)
    
    print(f"✅ Gerado: {len(all_transactions)} transações para {len(USERS)} usuários")
    
    # Stats por usuário
    for user in USERS:
        user_txns = [t for t in all_transactions if t["user_id"] == user["id"]]
        total = sum(t["amount"] for t in user_txns if t["type"] != "income")
        income = sum(t["amount"] for t in user_txns if t["type"] == "income")
        print(f"  {user['name']} ({user['stage']}): {len(user_txns)} txns, renda={income:.2f}, gastos={total:.2f}")

if __name__ == "__main__":
    main()
