"""
Categorization Agent
Processamento em background. Usa modelo Naive Bayes (Scikit-Learn) treinado 
para classificar transações financeiras com base na descrição (NLP).
"""
import os
import joblib
from typing import Dict, Any

# Carrega o modelo na inicialização do módulo (Singleton)
# Isso permite que a inferência seja feita em milissegundos na memória RAM
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/categorization_model.joblib")

_model = None

def _get_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_PATH):
            _model = joblib.load(MODEL_PATH)
        else:
            raise FileNotFoundError(f"Modelo não encontrado em: {MODEL_PATH}")
    return _model

def predict_category(description: str) -> Dict[str, Any]:
    """Tool: Prediz a categoria de um gasto usando o modelo de NLP (Naive Bayes)."""
    try:
        model = _get_model()
        prediction = model.predict([description])[0]
        # Opcional: model.predict_proba para retornar 'confidence' (certeza da IA)
        return {"status": "success", "category": prediction}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def bulk_categorize(user_id: str, descriptions: list[str]) -> Dict[str, Any]:
    """Tool: Categorização em lote usando inferência vetorizada super rápida."""
    try:
        model = _get_model()
        predictions = model.predict(descriptions)
        return {"status": "success", "categories": list(predictions)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def categorization_node(state):
    """Nó do Categorization Agent no LangGraph."""
    return state
