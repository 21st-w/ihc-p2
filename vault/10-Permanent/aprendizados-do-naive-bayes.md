---
domain: categorization
agent: categorization_agent
tags: [ml, ia, aprendizado, classificador, naive-bayes]
confidence: high
---

# Aprendizados do Classificador Naive Bayes

> Esta nota documenta o que o modelo de inteligência artificial (MultinomialNB) aprendeu após ser treinado com mais de 150.000 transações financeiras reais simuladas.

Para cada categoria financeira, o modelo associou maiores pesos probabilísticos (baseado em TF-IDF) a palavras específicas presentes na descrição da fatura do cartão ou extrato bancário.

## Top Palavras por Categoria

### Alimentação
- **restaurante**
- **mcdonalds**
- **starbucks**
- **padaria**
- **atacadao**
- **ifood**
- **supermercado**
- **rappi**
- **rappi brasil**
- **supermercado carrefour**

### Assinaturas
- **netflix**
- **disney**
- **plus**
- **strava**
- **spotify**
- **duolingo plus**
- **duolingo**
- **chatgpt**
- **chatgpt plus**
- **premium**

### Casa
- **kalunga**
- **leroy**
- **leroy merlin**
- **merlin**
- **mercado**
- **mercado livre**
- **stok**
- **tok**
- **tok stok**
- **livre**

### Lazer
- **com**
- **sympla**
- **cinemark**
- **airbnb**
- **ingresso com**
- **ingresso**
- **decolar**
- **decolar com**
- **livraria**
- **livraria cultura**

### Moradia
- **aluguel**
- **condomínio**
- **parcela**
- **iptu parcela**
- **iptu**
- **vivo fibra**
- **vivo**
- **veterinaria**
- **veiculo bv**
- **veiculo**

### Pets
- **cobasi**
- **petz**
- **clinica veterinaria**
- **clinica**
- **veterinaria**
- **youtube**
- **vivo fibra**
- **vivo**
- **veiculo bv**
- **veiculo**

### Saúde
- **academia**
- **plano**
- **plano de**
- **de saúde**
- **saúde**
- **drogasil**
- **bodytech**
- **academia bodytech**
- **de**
- **smartfit**

### Transporte
- **posto**
- **do**
- **veiculo**
- **financiamento**
- **veiculo bv**
- **financiamento veiculo**
- **bv**
- **posto ipiranga**
- **ipiranga**
- **posto shell**

### Utilidades
- **celular**
- **vivo**
- **internet**
- **conta de**
- **conta**
- **de**
- **celular vivo**
- **tim**
- **celular tim**
- **internet claro**

### Vestuário
- **renner**
- **arezzo**
- **centauro**
- **zara**
- **zara brasil**
- **brasil**
- **vivo fibra**
- **veterinaria**
- **veiculo bv**
- **veiculo**
