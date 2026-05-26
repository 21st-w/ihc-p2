# Documentação do MVP (Produto Mínimo Viável)

## Escopo do MVP

O Produto Mínimo Viável (MVP) do **Tio Patinhas** foi desenhado para provar o valor principal da aplicação (Diagnóstico Financeiro e Organização de Conhecimento) sem a complexidade técnica de ferramentas avançadas (como Open Finance, LLMs remotos caros ou sistemas complexos de RAG).

### O que está DENTRO do MVP:

1. **Entrada Manual de Dados**: O usuário preenche sua renda, gastos fixos, variáveis, assinaturas e dívidas.
2. **Diagnóstico Educacional (Agente Freud)**: Avaliação estática baseada em regras claras (Python puro) que identifica perfis (Saudável, Equilibrado, Crítico).
3. **Simulações Matemáticas (Agente Moriarty)**: Cálculo exato de reserva de emergência, impacto de dívidas e projeção simples de juros compostos.
4. **Geração de Second Brain (Agente Athena)**: Conversão automática de todo o diagnóstico em arquivos `.md` dentro do diretório `/obsidian-vault`.
5. **Interface Visual Limpa**: Frontend Next.js consumindo a API.

### O que está FORA do MVP (Visão Futura):

1. **Agente Sherlock**: Foi projetado na arquitetura inicial para RAG (Retrieval-Augmented Generation) sobre notícias do mercado. Foi removido do MVP para evitar riscos de compliance ("recomendação de investimentos") e cortar custos de APIs (OpenAI). Fica em *standby* para versões futuras.
2. **Open Finance API**: A coleta automatizada de dados bancários introduziria extrema complexidade de segurança e LGPD, inviabilizando o tempo de entrega do MVP.
3. **LLMs Generativos**: No MVP, Freud e Moriarty usam algoritmos determinísticos em Python. Isso garante respostas em milissegundos e 100% de precisão matemática. LLMs poderão ser integrados posteriormente para formatar o texto de forma mais "humana".

## Fluxo de Valor

O valor gerado para o usuário neste MVP é a clareza instantânea. Em menos de 2 minutos (tempo estimado de preenchimento do formulário), o usuário sai da "névoa mental" de não saber como estão suas contas, para possuir um **dashboard completo** e um **Vault estruturado** no Obsidian com planos de ação concretos.
