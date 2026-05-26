# Camada de IA — Tio Patinhas

## Objetivo

A camada de IA serve para interpretação, contextualização e perguntas educacionais sobre a vida financeira do usuário.

Ela não substitui os cálculos determinísticos do MVP. Freud, Moriarty e Athena continuam gerando diagnóstico, simulações e nodos Markdown; a IA entra como uma camada adicional para explicar e recuperar contexto.

## O que a IA faz

- responde perguntas financeiras educacionais;
- usa dados do usuário;
- usa nodos do Obsidian;
- recupera contexto via RAG simples;
- mostra fontes usadas.

## O que a IA não faz

- não recomenda investimentos;
- não escolhe ativos;
- não promete rentabilidade;
- não substitui consultoria financeira.

## Arquitetura

- Ollama para LLM local;
- Ollama embeddings;
- SQLite para chunks e embeddings;
- similaridade de cosseno em Python;
- FastAPI para endpoints;
- frontend chama `/ai/chat/{user_id}`.

## Como rodar

Instalar Ollama.

Rodar:

```bash
ollama pull llama3.1:8b
ollama pull nomic-embed-text
ollama serve
```

Rodar backend normalmente.

## Endpoints

- `GET /ai/status`
- `POST /ai/chat/{user_id}`
- `POST /ai/reindex/{user_id}`
- `POST /ai/index-node/{node_id}`
- `POST /ai/freud/analyze/{user_id}`

## Limitações

- MVP local;
- busca vetorial simples em SQLite;
- não otimizado para grande escala;
- futuro: pgvector.
