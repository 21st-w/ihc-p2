# Tio Patinhas — Assistente Financeiro Educacional com IA e Second Brain

## Visão Geral

O **Tio Patinhas** é um sistema educacional de organização financeira pessoal baseado em **Inteligência Artificial**, **Second Brain**, **agentes especializados** e **memória financeira personalizada**.

A proposta do projeto é ajudar o usuário a entender melhor sua vida financeira, organizar seus gastos, acompanhar assinaturas, visualizar dívidas, simular cenários e receber explicações personalizadas sobre sua situação financeira.

O sistema não tem como objetivo recomendar compra ou venda de ativos financeiros. O foco é **educacional**, **analítico**, **organizacional** e **comportamental**.

A ideia central é transformar os dados financeiros do usuário em conhecimento estruturado, permitindo que agentes de IA analisem, organizem e expliquem essas informações de forma simples, acessível e útil.

---

## Problema

Muitas pessoas possuem renda, cartões, Pix, bancos digitais, assinaturas, dívidas e objetivos financeiros, mas não têm clareza sobre sua real situação financeira.

Mesmo com aplicativos bancários e planilhas, muitos usuários ainda não conseguem responder perguntas simples como:

- Para onde meu dinheiro está indo?
- Quanto realmente sobra no fim do mês?
- Quais gastos estão pesando mais?
- Minhas assinaturas fazem sentido?
- Minhas dívidas estão comprometendo minha renda?
- Quanto tempo eu levaria para montar uma reserva de emergência?
- Qual é meu perfil financeiro?
- Que tipo de estratégia educacional combina com minha realidade?

O problema principal não é apenas a falta de dados. O problema é a falta de **interpretação**, **organização**, **clareza** e **orientação educacional**.

---

## Objetivo do Projeto

O objetivo do **Tio Patinhas** é criar um sistema financeiro educacional com IA capaz de:

- organizar dados financeiros pessoais;
- analisar o perfil financeiro do usuário;
- gerar diagnósticos simples e compreensíveis;
- realizar simulações financeiras educacionais;
- estruturar conhecimento em formato de Second Brain;
- criar memória personalizada por usuário;
- auxiliar o usuário na tomada de consciência financeira;
- oferecer uma interface clara, acessível e orientada por princípios de IHC.

O sistema busca responder a uma necessidade central:

> Ajudar o usuário a entender sua vida financeira de forma simples, visual e personalizada, sem depender de planilhas complexas ou recomendações financeiras arriscadas.

---

## Proposta de Valor

O **Tio Patinhas** funciona como um laboratório financeiro pessoal.

Ele permite que o usuário registre sua realidade financeira e receba análises educacionais feitas por agentes especializados.

A proposta de valor é:

> Transformar dados financeiros pessoais em conhecimento organizado, explicações claras e simulações úteis para o usuário entender melhor sua própria vida financeira.

Diferente de um aplicativo comum de controle de gastos, o Tio Patinhas não se limita a mostrar números. Ele busca interpretar os dados, criar memória sobre o usuário e organizar esse conhecimento ao longo do tempo.

---

## Público-Alvo

O público-alvo do projeto são pessoas que possuem renda recorrente, gastos variados e interesse em melhorar sua organização financeira, mas que não conseguem manter controle por planilhas ou aplicativos tradicionais.

Persona principal:

- Profissional entre 20 e 40 anos;
- Possui renda mensal, gastos fixos e variáveis;
- Usa banco digital, cartão de crédito e Pix;
- Tem dificuldade em entender quanto realmente sobra;
- Já tentou usar planilhas, mas desistiu;
- Quer melhorar sua organização financeira;
- Tem interesse em investimentos, mas precisa primeiro entender sua própria base financeira;
- Prefere explicações simples, visuais e personalizadas.

---

## Conceito Central: Second Brain Financeiro

A base conceitual do Tio Patinhas é o **Second Brain financeiro**.

O sistema não trata os dados do usuário apenas como registros isolados. Ele transforma esses dados em conhecimento estruturado.

Cada usuário possui uma memória financeira organizada, contendo informações como:

- renda;
- gastos fixos;
- gastos variáveis;
- assinaturas;
- dívidas;
- objetivos;
- perfil financeiro;
- diagnósticos anteriores;
- simulações realizadas;
- resumos mensais;
- observações comportamentais;
- recomendações educacionais.

Essa memória pode ser representada por nodos, pastas, registros no banco de dados ou uma estrutura inspirada no Obsidian.

No MVP, a estrutura do Second Brain pode ser simulada no banco de dados ou em arquivos Markdown. Em versões futuras, poderá haver integração real com Obsidian, RAG, embeddings e pgvector.

---

## Arquitetura Conceitual dos Agentes

O Tio Patinhas é baseado em uma arquitetura multiagente. Cada agente possui uma responsabilidade específica dentro do sistema.

Na visão completa do projeto, existem quatro agentes principais:

- Freud;
- Moriarty;
- Athena;
- Sherlock.

No MVP, o Sherlock ficará em standby para reduzir complexidade técnica e evitar dependência de mercado em tempo real.

---

## Agente Freud

O **Freud** é o agente responsável por analisar o perfil financeiro e comportamental do usuário.

Ele observa os dados cadastrados pelo usuário e gera interpretações sobre sua realidade financeira.

Responsabilidades principais:

- analisar renda, gastos, dívidas e objetivos;
- identificar padrões de comportamento financeiro;
- classificar o perfil financeiro do usuário;
- gerar diagnósticos em linguagem natural;
- criar contexto personalizado para os outros agentes;
- acompanhar a evolução financeira do usuário;
- gerar nodos específicos sobre o perfil do cliente.

Exemplo de atuação:

> “Seu maior peso financeiro está nos gastos fixos e nas assinaturas. Antes de pensar em investir, o ideal é entender sua sobra mensal real e reduzir despesas recorrentes de baixo valor percebido.”

---

## Agente Moriarty

O **Moriarty** é o agente matemático e quantitativo do sistema.

Ele é responsável por cálculos, simulações, projeções e análises financeiras baseadas em números.

Responsabilidades principais:

- calcular saldo mensal estimado;
- calcular comprometimento da renda;
- simular reserva de emergência;
- projetar juros compostos;
- analisar impacto de dívidas;
- simular redução de gastos;
- gerar cenários educacionais;
- apoiar as análises de Freud com dados quantitativos.

Exemplo de atuação:

> “Se você economizar R$ 300 por mês, levará aproximadamente 20 meses para formar uma reserva de emergência de R$ 6.000, sem considerar rentabilidade.”

---

## Agente Athena

A **Athena** é a agente responsável pela organização do conhecimento.

Ela cuida da estrutura do Second Brain, dos nodos, das skills e da separação entre conhecimento público, conhecimento dos agentes e conhecimento do usuário.

Responsabilidades principais:

- organizar nodos financeiros;
- estruturar a memória do usuário;
- separar conhecimento público e privado;
- revisar informações criadas pelos agentes;
- manter a base de conhecimento limpa;
- sugerir novas skills;
- organizar dados para uso futuro;
- evitar duplicidade e desorganização no sistema.

Exemplo de atuação:

> “Foi criado um nodo de diagnóstico mensal para o usuário, contendo resumo de renda, gastos, assinaturas, dívidas e principais pontos de atenção.”

---

## Agente Sherlock

O **Sherlock** é o agente de inteligência de mercado e contexto financeiro.

Na visão completa do projeto, ele será responsável por acompanhar informações externas sobre economia, mercado, investimentos e tendências.

Responsabilidades futuras:

- acompanhar notícias financeiras;
- buscar literatura recente sobre economia e investimentos;
- atualizar a base pública de conhecimento;
- identificar tendências relevantes;
- criar nodos de contexto econômico;
- apoiar Moriarty com informações externas;
- criar skills de análise de mercado.

### Status no MVP

No MVP, o Sherlock ficará em **standby**.

Ele não será implementado inicialmente porque adiciona complexidade, custo, dependência de fontes externas, risco regulatório e necessidade de atualização constante.

O MVP deve focar primeiro na vida financeira interna do usuário: renda, gastos, dívidas, assinaturas, perfil, simulações e Second Brain.

---

## Organização do Conhecimento

O sistema deve separar o conhecimento em diferentes camadas:

### 1. Conhecimento Público

Base acessível por todos os agentes.

Pode conter:

- conceitos de educação financeira;
- explicações sobre orçamento;
- conceitos de juros compostos;
- conceitos de reserva de emergência;
- noções de risco;
- conteúdos gerais sobre organização financeira.

### 2. Conhecimento Especializado dos Agentes

Cada agente possui sua própria base de conhecimento.

Exemplos:

- Freud: perfil financeiro e comportamento do usuário;
- Moriarty: fórmulas, cálculos e simulações;
- Athena: organização dos nodos e estrutura do Second Brain;
- Sherlock: contexto econômico e mercado.

### 3. Conhecimento do Cliente

Cada usuário possui uma área própria de memória.

Essa área deve armazenar:

- dados financeiros;
- diagnósticos;
- objetivos;
- simulações;
- histórico;
- preferências;
- perfil financeiro;
- resumos mensais.

### 4. Curadoria do Conhecimento

A Athena pode reorganizar o conhecimento quando necessário.

Ela pode:

- mover informações relevantes para a base pública;
- duplicar conhecimento essencial para outro agente;
- corrigir organização de nodos;
- sugerir novas skills;
- separar dados sensíveis do usuário;
- manter a estrutura escalável.

---

## Princípios de IHC

O Tio Patinhas tem foco forte em IHC, pois o usuário precisa entender dados financeiros sem se sentir confuso, intimidado ou sobrecarregado.

Princípios adotados:

- simplicidade visual;
- linguagem clara;
- baixa carga cognitiva;
- navegação objetiva;
- feedback imediato;
- organização por prioridade;
- acessibilidade;
- consistência entre telas;
- foco nas tarefas principais;
- uso de gráficos apenas quando ajudarem na compreensão.

O sistema deve evitar excesso de informações na tela. A interface deve priorizar clareza e tomada de consciência.

---

## Acessibilidade

O MVP deve contemplar acessibilidade desde o início.

Diretrizes iniciais:

- bom contraste entre texto e fundo;
- textos legíveis;
- botões claros;
- feedback visual para ações;
- campos de formulário bem identificados;
- linguagem simples;
- navegação previsível;
- suporte a usuários com dificuldade visual leve;
- evitar dependência exclusiva de cores para transmitir informação.

---

## Segurança e Privacidade

Como o sistema lida com dados financeiros pessoais, segurança e privacidade são elementos essenciais.

Diretrizes iniciais:

- separar dados por usuário;
- não expor informações financeiras sensíveis;
- evitar compartilhamento indevido entre clientes;
- proteger dados no banco;
- validar entradas do usuário;
- manter regras claras de acesso;
- não gerar recomendações financeiras diretas;
- deixar claro que as análises possuem finalidade educacional.

---

## Limitação Importante

O Tio Patinhas não é uma corretora, consultoria financeira, casa de análise ou recomendador de investimentos.

O sistema não deve dizer ao usuário:

- compre este ativo;
- venda este ativo;
- invista obrigatoriamente neste produto;
- esta é a melhor ação;
- esta é a melhor carteira.

O sistema deve atuar como ferramenta educacional, oferecendo:

- explicações;
- diagnósticos;
- simulações;
- cenários;
- alertas;
- organização;
- apoio à consciência financeira.

---

## Visão de Futuro

Em versões futuras, o sistema poderá evoluir para:

- integração com Open Finance;
- importação automática de transações;
- integração real com Obsidian;
- criação automática de nodos;
- agentes mais autônomos;
- Sherlock com atualização diária de contexto econômico;
- dashboards avançados;
- relatórios mensais;
- análise de assinaturas;
- alertas inteligentes;
- busca semântica com embeddings;
- RAG com pgvector;
- personalização avançada por usuário;
- sistema de skills para agentes;
- análise de documentos financeiros.

---

## Status do Projeto

Este repositório será reorganizado para separar a visão completa do produto da implementação inicial do MVP.

A branch principal mantém a visão geral do projeto.

A branch `mvp` deve conter a versão mínima funcional, com foco em simplicidade, IHC, agentes essenciais e validação acadêmica do conceito.
