"""
Treina um modelo Naive Bayes para categorização de transações usando Scikit-Learn.
O modelo aprende a mapear descrições de faturas de cartão (ex: "UBER DO BRASIL")
para suas categorias respectivas (ex: "Transporte").
"""
import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib

DATASET_PATH = "../eval/user_histories.json"
MODEL_OUTPUT_DIR = "app/ml/"
MODEL_OUTPUT_PATH = os.path.join(MODEL_OUTPUT_DIR, "categorization_model.joblib")

def train_model():
    print(f"Carregando dataset de {DATASET_PATH}...")
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    transactions = data.get("transactions", [])
    print(f"Total de transações carregadas: {len(transactions)}")
    
    # Extraindo as features (X) e os rótulos (y)
    # Não vamos treinar usando transações de "Renda", apenas gastos.
    X = []
    y = []
    for t in transactions:
        if t["type"] != "income":
            X.append(t["description"])
            y.append(t["category"])
            
    print(f"Transações válidas para treino: {len(X)}")
    
    # Split Treino / Teste (80% treino / 20% teste)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Construindo o pipeline de Machine Learning
    # TfidfVectorizer: converte o texto para matriz TF-IDF
    # MultinomialNB: classificador Naive Bayes (ótimo para textos curtos)
    print("Iniciando treinamento do Pipeline (TfidfVectorizer + MultinomialNB)...")
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), lowercase=True, max_df=0.95, min_df=2)),
        ('clf', MultinomialNB(alpha=0.1)),
    ])
    
    pipeline.fit(X_train, y_train)
    print("Treinamento concluído.")
    
    print("Avaliando modelo no conjunto de teste...")
    y_pred = pipeline.predict(X_test)
    report = classification_report(y_test, y_pred)
    print(report)
    
    # Salvando o modelo treinado
    os.makedirs(MODEL_OUTPUT_DIR, exist_ok=True)
    joblib.dump(pipeline, MODEL_OUTPUT_PATH)
    print(f"✅ Modelo salvo com sucesso em: {MODEL_OUTPUT_PATH}")

if __name__ == "__main__":
    train_model()
