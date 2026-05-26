# Documentação de IHC (Interação Humano-Computador)

O projeto **Tio Patinhas** foi redesenhado levando em conta princípios rígidos de IHC, com o objetivo principal de **reduzir a carga cognitiva** do usuário ao lidar com informações financeiras.

## 1. Minimalismo e Carga Cognitiva

Finanças pessoais é um tema naturalmente estressante e complexo. Para mitigar isso, o sistema aplica o princípio do "Menos é Mais":

- **Ausência de Menus Complexos**: O fluxo principal (Landing -> Cadastro -> Dashboard) é direcional. O usuário nunca se sente perdido sobre "o que fazer a seguir".
- **Design System Escuro (Dark Mode)**: Cores de fundo escuras (`#0a0a12`, `#12121c`) reduzem o brilho na tela e ajudam a manter o foco no conteúdo contrastante.
- **Divisão por Cartões (Cards)**: A informação não é apresentada em blocos textuais densos, mas quebrada em cartões visuais que delimitam pedaços específicos de informação (Chunking cognitivo).

## 2. Feedback Visual e Cores Semânticas

A interface utiliza cores não apenas para estética, mas para comunicar significado imediato sem necessidade de leitura (Preattentive Processing):

- 🟢 **Verde (`var(--success)`)**: Renda, saldo positivo, status Saudável. Reforço positivo.
- 🟡 **Amarelo (`var(--warning)`)**: Dívidas pendentes, status Apertado, pontos de atenção. Exige cautela, mas não pânico.
- 🔴 **Vermelho (`var(--danger)`)**: Gastos superiores à renda, status Crítico. Alerta imediato.
- 🟣 **Roxo/Índigo (`var(--accent)`)**: Ações primárias (botões), agentes de IA, elementos educacionais.

## 3. Prevenção de Erros

No formulário de cadastro, os campos numéricos são tratados de forma permissiva no código (convertendo strings vazias para `0`), evitando travamentos e mensagens de erro desnecessárias caso o usuário deixe um campo opcional (como dívidas) em branco. O botão de submissão exibe feedback de "carregamento" (loading state) para evitar duplos cliques.

## 4. Metáforas Visuais (Agentes)

Para tornar os cálculos e diagnósticos menos intimidadores, o sistema usa a metáfora de **Agentes Especialistas**:

- **Freud 🧠**: O psicólogo. Foca em "como você se comporta", classificando o perfil.
- **Moriarty 📈**: O matemático. Traz os cálculos frios (juros, projeções).
- **Athena 📚**: A organizadora. Transforma os dados em uma biblioteca.

Essas metáforas ajudam os usuários a construir um modelo mental adequado de onde a informação está vindo e por que ela tem um tom específico (psicológico vs. quantitativo).

## 5. Avisos Educacionais (Disclaimers)

Por motivos éticos e regulatórios (e como boa prática de IHC para alinhar expectativas), todas as telas exibem alertas amarelos (`alert-warning`) reforçando que o sistema é educacional e não representa recomendação de investimento.
