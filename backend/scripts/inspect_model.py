"""
Script para analisar o que o modelo Naive Bayes (Categorization Agent) aprendeu.
Extrai as top 10 palavras mais indicativas para cada categoria com base nas probabilidades (log).
"""
import joblib
import numpy as np
import os

MODEL_PATH = "app/ml/categorization_model.joblib"
VAULT_PATH = "../../tio patinhas/10-Permanent/aprendizados-do-naive-bayes.md"

def inspect_model():
    if not os.path.exists(MODEL_PATH):
        print(f"Modelo não encontrado em {MODEL_PATH}")
        return
        
    pipeline = joblib.load(MODEL_PATH)
    
    # O pipeline tem ['tfidf', 'clf']
    tfidf = pipeline.named_steps['tfidf']
    clf = pipeline.named_steps['clf']
    
    # Obter os nomes das features (palavras)
    feature_names = np.array(tfidf.get_feature_names_out())
    classes = clf.classes_
    
    # clf.feature_log_prob_ tem formato (n_classes, n_features)
    # Valores mais altos significam maior probabilidade condicional P(feature | classe)
    
    markdown_content = [
        "---",
        "domain: categorization",
        "agent: categorization_agent",
        "tags: [ml, ia, aprendizado, classificador, naive-bayes]",
        "confidence: high",
        "---",
        "",
        "# Aprendizados do Classificador Naive Bayes",
        "",
        "> Esta nota documenta o que o modelo de inteligência artificial (MultinomialNB) aprendeu após ser treinado com mais de 150.000 transações financeiras reais simuladas.",
        "",
        "Para cada categoria financeira, o modelo associou maiores pesos probabilísticos (baseado em TF-IDF) a palavras específicas presentes na descrição da fatura do cartão ou extrato bancário.",
        "",
        "## Top Palavras por Categoria",
        ""
    ]
    
    for i, category in enumerate(classes):
        # Pegar as probabilidades log para esta classe
        class_prob = clf.feature_log_prob_[i]
        
        # Pegar os índices das 10 features com maiores probabilidades
        top_indices = np.argsort(class_prob)[-10:][::-1]
        top_features = feature_names[top_indices]
        
        markdown_content.append(f"### {category}")
        for word in top_features:
            markdown_content.append(f"- **{word}**")
        markdown_content.append("")
        
    # Salvar no Vault
    os.makedirs(os.path.dirname(VAULT_PATH), exist_ok=True)
    with open(VAULT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(markdown_content))
        
    # Copiar também para o repositório local
    REPO_VAULT_PATH = "../vault/10-Permanent/aprendizados-do-naive-bayes.md"
    with open(REPO_VAULT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(markdown_content))
        
    print(f"✅ Análise do modelo extraída e salva em {VAULT_PATH}")

if __name__ == "__main__":
    inspect_model()
