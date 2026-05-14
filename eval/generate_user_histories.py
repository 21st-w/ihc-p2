"""
Gerador Massivo de User Histories para Treinamento de IA.
Gera 1000 perfis de usuário com 100.000+ transações combinadas.
"""
import json
import random
import uuid
from datetime import date, timedelta

random.seed(42)

# Pools para geração de usuários
FIRST_NAMES = ["Ana", "Bruno", "Carla", "Daniel", "Elena", "Felipe", "Gabriela", "Henrique", "Isabela", "João", "Karina", "Lucas", "Mariana", "Nicolas", "Olivia", "Pedro", "Quintino", "Rafael", "Sofia", "Tiago"]
LAST_NAMES = ["Silva", "Oliveira", "Mendes", "Costa", "Rodrigues", "Santos", "Souza", "Lima", "Ferreira", "Alves", "Ribeiro", "Carvalho", "Gomes", "Martins", "Araujo", "Melo", "Barbosa", "Rocha", "Dias", "Moreira"]
PROFILES = ["conservador", "moderado", "arrojado"]
STAGES = ["mes_1", "mes_3", "mes_6", "mes_12", "mes_24"]

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
        ("Internet Vivo Fibra", 89, 200),
        ("Internet Claro", 89, 200),
        ("Celular Tim", 45, 120),
        ("Celular Vivo", 45, 120),
    ],
    "Saúde": [
        ("Plano de saúde Amil", 200, 800),
        ("Plano de saúde SulAmerica", 300, 1000),
        ("Academia SmartFit", 60, 120),
        ("Academia Bodytech", 200, 500),
    ],
    "Transporte": [
        ("Seguro do carro Porto", 120, 400),
        ("Financiamento veiculo BV", 500, 1500),
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
    ("Canva Pro", 34.90, "produtividade"),
    ("Strava", 31.90, "saude"),
    ("Duolingo Plus", 39.90, "educacao"),
]

VARIABLE_EXPENSES = {
    "Alimentação": [
        ("Supermercado Carrefour", 80, 600),
        ("Supermercado Pao de Acucar", 100, 800),
        ("Atacadao", 150, 900),
        ("Feira Livre", 30, 120),
        ("Padaria", 5, 40),
        ("IFOOD *IFOOD", 25, 80),
        ("RAPPI BRASIL", 20, 70),
        ("Restaurante Outback", 150, 300),
        ("Restaurante Madero", 80, 200),
        ("Starbucks", 15, 45),
        ("McDonalds", 25, 60),
    ],
    "Transporte": [
        ("Posto Ipiranga", 100, 250),
        ("Posto Shell", 100, 250),
        ("UBER DO BRASIL", 10, 50),
        ("99 POP", 10, 45),
        ("Estapar Estacionamentos", 10, 40),
        ("Sem Parar", 30, 150),
        ("Oficina Mecanica", 100, 800),
    ],
    "Saúde": [
        ("Droga Raia", 15, 150),
        ("Drogasil", 15, 150),
        ("Consulta Medica", 100, 400),
        ("Laboratorio Fleury", 50, 300),
    ],
    "Lazer": [
        ("Cinemark", 25, 80),
        ("Ingresso.com", 40, 150),
        ("Sympla", 50, 250),
        ("Bar do Juarez", 60, 200),
        ("Airbnb", 300, 1500),
        ("Decolar.com", 500, 2000),
        ("Livraria Cultura", 40, 100),
        ("Amazon.com.br", 30, 300),
        ("Steam Games", 20, 150),
    ],
    "Vestuário": [
        ("Zara Brasil", 100, 500),
        ("Renner", 50, 300),
        ("Centauro", 80, 400),
        ("Arezzo", 100, 400),
    ],
    "Pets": [
        ("Cobasi", 80, 250),
        ("Petz", 80, 250),
        ("Clinica Veterinaria", 100, 500),
    ],
    "Casa": [
        ("Leroy Merlin", 100, 800),
        ("Tok&Stok", 100, 800),
        ("Kalunga", 30, 150),
        ("Mercado Livre", 50, 500),
    ],
}

def generate_users(num_users=1000):
    users = []
    for _ in range(num_users):
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        stage = random.choice(STAGES)
        
        # Rendimentos variam entre 2.000 e 50.000 (distribuição com mais peso na base)
        income = round(random.lognormvariate(8.5, 0.8), 2)
        income = max(2000.0, min(income, 50000.0))
        
        # Mapeamento do tempo baseado no stage
        months_ago_map = {"mes_1": 1, "mes_3": 3, "mes_6": 6, "mes_12": 12, "mes_24": 24}
        months_ago = months_ago_map[stage]
        start_date = date.today() - timedelta(days=30 * months_ago)
        
        users.append({
            "id": str(uuid.uuid4()),
            "name": f"{first} {last}",
            "email": f"{first.lower()}.{last.lower()}{random.randint(1,99)}@email.com",
            "role": "USER",
            "profile": random.choice(PROFILES),
            "monthly_income": income,
            "stage": stage,
            "start_date": start_date.isoformat(),
            "months_active": months_ago
        })
    return users

def generate_transactions_for_user(user):
    transactions = []
    income_ratio = user["monthly_income"] / 7000.0
    start = date.fromisoformat(user["start_date"])
    months = user["months_active"]
    
    # Assinaturas fixas do usuário
    num_subs = min(2 + int(user["monthly_income"] / 2500), 8)
    user_subs = random.sample(SUBSCRIPTIONS, num_subs)
    
    for month_offset in range(months):
        month_date = start + timedelta(days=30 * month_offset)
        
        # Renda
        transactions.append({
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "amount": float(user["monthly_income"]),
            "category": "Renda",
            "description": "TED SALARIO",
            "date": (month_date + timedelta(days=4)).isoformat(),
            "type": "income",
        })
        
        # Gastos fixos
        for cat, items in FIXED_EXPENSES.items():
            for desc, min_val, max_val in items:
                if random.random() < 0.3: # Nem todos tem todos os gastos fixos
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
        
        # Assinaturas
        for name, price, _ in user_subs:
            if price > 0:
                transactions.append({
                    "id": str(uuid.uuid4()),
                    "user_id": user["id"],
                    "amount": price,
                    "category": "Assinaturas",
                    "description": name,
                    "date": (month_date + timedelta(days=random.randint(1, 28))).isoformat(),
                    "type": "subscription",
                })
                
        # Variáveis
        month_num = month_date.month
        seasonal_mult = 1.3 if month_num in [12, 1] else 1.0
        
        for cat, items in VARIABLE_EXPENSES.items():
            for desc, min_val, max_val in items:
                # Menor probabilidade para não estourar o limite de memória muito rápido
                if random.random() < 0.2: 
                    base_val = min_val + (max_val - min_val) * income_ratio * random.uniform(0.3, 0.8)
                    val = round(base_val * seasonal_mult, 2)
                    
                    transactions.append({
                        "id": str(uuid.uuid4()),
                        "user_id": user["id"],
                        "amount": val,
                        "category": cat,
                        "description": desc,
                        "date": (month_date.replace(day=1) + timedelta(days=random.randint(0, 27))).isoformat(),
                        "type": "variable",
                    })
                    
    return transactions

def main():
    print("Gerando 1000 usuários...")
    users = generate_users(1000)
    
    all_transactions = []
    
    print("Gerando transações (isso pode demorar alguns segundos)...")
    for u in users:
        all_transactions.extend(generate_transactions_for_user(u))
        
    print(f"Total de transações geradas: {len(all_transactions)}")
    
    # Ordenar por data
    all_transactions.sort(key=lambda t: t["date"])
    
    dataset = {
        "metadata": {
            "total_users": len(users),
            "total_transactions": len(all_transactions)
        },
        "users": users,
        "transactions": all_transactions
    }
    
    with open("user_histories.json", "w", encoding="utf-8") as f:
        json.dump(dataset, f, ensure_ascii=False)
        
    print("Salvo em user_histories.json com sucesso!")

if __name__ == "__main__":
    main()
