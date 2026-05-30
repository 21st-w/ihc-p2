# Relatório -- Avaliação II -- IHC 2026.1

**Instituto Federal de Educação, Ciência e Tecnologia do Maranhão**
Diretoria de Ensino Superior -- DESU
Departamento de Computação -- DCOMP
Curso de Sistemas de Informação

**Disciplina:** Interação Humano-Computador
**Professora:** Eveline Sá
**Data de Entrega:** 02/06/2026

**Sistema:** Tio Patinhas -- Gerenciador Financeiro Pessoal

---

## Sumário

1. [A. Design Thinking](#a-design-thinking)
   - 1.1 Mapa de Empatia
   - 1.2 User Stories
2. [B. Requisitos Funcionais](#b-requisitos-funcionais)
3. [C. Prototipação](#c-prototipação)
   - 3.1 Tipo de Prototipação e Justificativa
   - 3.2 Componentes de IHC Identificados
   - 3.3 Acessibilidade
4. [Considerações Finais](#considerações-finais)

---

## A. Design Thinking

### 1.1 Mapa de Empatia

O mapa de empatia foi elaborado com base na persona de um jovem adulto universitário, entre 18 e 28 anos, que busca organizar sua vida financeira de forma prática, sem necessidade de conhecimentos avançados em finanças.

| Dimensão | Descrição |
|---|---|
| **O que pensa e sente?** | Sente ansiedade por não saber para onde o dinheiro vai no fim do mês. Pensa que deveria poupar mais, mas não consegue visualizar seus gastos de forma clara. Quer ter controle financeiro, mas acha planilhas complexas e pouco intuitivas. Tem medo de investir por falta de conhecimento. |
| **O que ouve?** | Ouve amigos comentando sobre investimentos e aplicativos de finanças. Ouve conselhos dos pais sobre a importância de economizar. Vê influenciadores nas redes sociais falando sobre educação financeira. Escuta propagandas de bancos digitais prometendo facilidade. |
| **O que vê?** | Vê colegas endividados e outros que parecem ter a vida financeira organizada. Vê aplicativos de bancos com interfaces cada vez mais modernas. Observa que o custo de vida sobe, mas a renda nem sempre acompanha. Vê muitas assinaturas de serviços digitais se acumulando. |
| **O que fala e faz?** | Diz que quer economizar, mas não anota seus gastos. Usa o cartão de crédito sem acompanhar o extrato. Assina serviços de streaming e depois esquece de cancelar. Eventualmente tenta usar uma planilha, mas desiste por ser trabalhoso. |
| **Dores** | Falta de visibilidade sobre os gastos reais do mês. Dificuldade em categorizar despesas fixas, variáveis e assinaturas. Não saber quanto pode investir com segurança. Interfaces financeiras que exigem conhecimento técnico. |
| **Ganhos** | Uma ferramenta visual e simples que mostre o panorama financeiro em tempo real. Receber dicas automáticas e personalizadas sobre como economizar. Poder simular investimentos sem precisar entender fórmulas complexas. Sentir-se no controle do próprio dinheiro. |

### 1.2 User Stories

As user stories a seguir descrevem requisitos funcionais que não são operações simples de CRUD, mas sim funcionalidades que agregam valor à experiência do usuário.

#### User Story 1 -- Assistente Financeiro via Chat

> **Como** usuário do sistema,
> **eu quero** conversar com um assistente virtual integrado ao sistema
> **para que** eu possa tirar dúvidas sobre finanças pessoais, receber orientações sobre economia e entender conceitos de investimento de maneira acessível e conversacional, sem precisar sair do aplicativo para buscar informações externas.

**Critérios de Aceitação:**
- O chatbot deve exibir sugestões de perguntas frequentes como botões clicáveis (chips).
- O usuário deve poder digitar perguntas livremente no campo de texto.
- As respostas do assistente devem ser exibidas em formato de conversa, com distinção visual entre mensagens do usuário e do bot.
- O sistema deve informar que se trata de um protótipo com respostas pré-definidas.

#### User Story 2 -- Simulação Comparativa de Investimentos

> **Como** usuário do sistema,
> **eu quero** simular o rendimento do meu dinheiro em diferentes tipos de investimento (Poupança, CDB/Tesouro e Ações)
> **para que** eu possa comparar os resultados lado a lado e tomar decisões mais informadas sobre onde aplicar meus recursos, entendendo visualmente a relação entre risco e retorno ao longo do tempo.

**Critérios de Aceitação:**
- O usuário deve poder selecionar o tipo de investimento através de um controle segmentado.
- Os campos de valor inicial, aporte mensal e período devem ser editáveis.
- O sistema deve calcular e exibir: total investido, valor final e rendimento ganho.
- Uma tabela comparativa deve mostrar os três tipos de investimento simultaneamente.
- Um gráfico de barras deve ilustrar a evolução do patrimônio ao longo do período.
- O nível de risco deve ser indicado visualmente com cores e rótulos.

---

## B. Requisitos Funcionais

| ID | Requisito Funcional | Tela |
|---|---|---|
| RF01 | O sistema deve permitir o cadastro de múltiplas fontes de renda (salário, freelance, renda extra, etc.) com nome e valor. | Tela 1 |
| RF02 | O sistema deve permitir o cadastro de gastos fixos mensais (aluguel, internet, etc.) com nome e valor. | Tela 1 |
| RF03 | O sistema deve permitir o cadastro de gastos variáveis (mercado, transporte, luz, etc.) com nome e valor. | Tela 1 |
| RF04 | O sistema deve permitir o cadastro de assinaturas recorrentes (Netflix, Spotify, Selfit, etc.) com nome e valor. | Tela 1 |
| RF05 | O sistema deve permitir a remoção individual de qualquer item cadastrado (renda, gasto fixo, variável ou assinatura). | Tela 1 |
| RF06 | O sistema deve calcular automaticamente a receita total, o total de despesas e o saldo disponível, atualizando os valores em tempo real conforme os dados são alterados. | Tela 1 |
| RF07 | O sistema deve exibir o percentual de comprometimento da renda em uma barra de progresso visual. | Tela 1 |
| RF08 | O sistema deve exibir um gráfico de rosca (donut chart) mostrando a proporção entre gastos fixos, variáveis e assinaturas. | Tela 1 |
| RF09 | O sistema deve gerar dicas financeiras automáticas e contextualizadas com base nos dados inseridos pelo usuário (por exemplo: alertar quando despesas excedem a renda, sugerir cortes em assinaturas quando ultrapassam 10% da renda). | Tela 1 |
| RF10 | O sistema deve disponibilizar um assistente virtual (chatbot) com sugestões de perguntas pré-definidas clicáveis e campo para digitação livre. | Tela 2 |
| RF11 | O chatbot deve responder perguntas sobre educação financeira com textos pré-definidos, exibindo as mensagens em formato de conversa com diferenciação visual entre usuário e bot. | Tela 2 |
| RF12 | O sistema deve permitir a simulação de investimentos com escolha do tipo de aplicação (Poupança, CDB/Tesouro ou Ações), valor inicial, aporte mensal e período em meses. | Tela 3 |
| RF13 | O sistema deve calcular e exibir o total investido, o valor final estimado e o rendimento ganho, com indicação visual do nível de risco. | Tela 3 |
| RF14 | O sistema deve exibir um gráfico de barras ilustrando a evolução do patrimônio em 5 pontos ao longo do período selecionado. | Tela 3 |
| RF15 | O sistema deve apresentar uma tabela comparativa mostrando simultaneamente o valor final estimado para os três tipos de investimento, com indicação de risco. | Tela 3 |
| RF16 | O sistema deve oferecer controle de acessibilidade visual com opções de aumento e diminuição de fonte, bem como modo de alto contraste. | Global |
| RF17 | O sistema deve navegar entre as três telas (Finanças, Assistente e Simulador) por meio de abas, sem recarregar a página. | Global |

---

## C. Prototipação

### 3.1 Tipo de Prototipação e Justificativa

O protótipo desenvolvido para o sistema Tio Patinhas é classificado da seguinte forma:

| Critério | Classificação | Justificativa |
|---|---|---|
| **Fidelidade** | Hi-fi (alta fidelidade) | O protótipo foi implementado diretamente em código (HTML, CSS e JavaScript), apresentando a interface final com cores definitivas, tipografia personalizada (Fraunces e Hanken Grotesk via Google Fonts), interações reais, animações e cálculos funcionais. Trata-se de um protótipo funcional, não apenas um wireframe ou mockup estático. |
| **Dimensão** | Horizontal | O protótipo cobre a amplitude das funcionalidades do sistema, apresentando as três telas principais (Gerenciador Financeiro, Assistente Virtual e Simulador de Investimentos) com navegação completa entre elas. Embora cada tela tenha funcionalidades operacionais, não há profundidade de backend (banco de dados, autenticação, APIs externas). O foco está em demonstrar a experiência completa da interface. |
| **Estratégia** | Evolutivo e Incremental | O desenvolvimento seguiu uma abordagem incremental, onde cada tela foi construída como um módulo independente e integrado ao conjunto progressivamente. A evolução do protótipo passou pelas seguintes etapas: (1) implementação inicial com todas as funcionalidades em um único arquivo; (2) refatoração e separação em arquivos dedicados (HTML, CSS, JS); (3) melhorias visuais progressivas no design; (4) containerização com Docker para facilitar a entrega e execução. Cada iteração manteve as funcionalidades anteriores e adicionou melhorias, caracterizando uma evolução contínua do produto. |

### 3.2 Componentes de IHC Identificados na Interface

A seguir estão os componentes de IHC utilizados nas telas do sistema, organizados por categoria.

#### Tela 1 -- Gerenciador de Finanças

| Componente IHC | Elemento no Sistema | Descrição |
|---|---|---|
| **Barra de navegação por abas (Tab Bar)** | Navegação superior com as abas "Finanças", "Assistente" e "Simulador" | Permite a troca entre as três telas do sistema. Utiliza o padrão ARIA com `role="tablist"` e `role="tab"`, mantendo o estado visual da aba ativa. |
| **Cartão (Card)** | Seções "Minha renda", "Gastos fixos", "Gastos variáveis", "Assinaturas" e "Resumo do mês" | Agrupam informações relacionadas em containers visuais com bordas arredondadas, sombras e padding. Seguem o padrão de card UI amplamente utilizado em interfaces modernas. |
| **Campo de entrada (Input Field)** | Campos de nome e valor para cada categoria de gasto/renda | Permitem ao usuário inserir dados textuais e numéricos. Possuem placeholders descritivos e feedback visual ao receber foco (outline). |
| **Botão de ação (Action Button)** | Botões "+ Adicionar" em cada seção | Acionam a inserção de novos itens na lista correspondente. Seguem o padrão de botão primário com destaque visual. |
| **Lista interativa (Interactive List)** | Listas de itens em cada categoria (renda, fixos, variáveis, assinaturas) | Exibem os itens cadastrados com ícone de categoria, nome, valor formatado e botão de remoção. Possuem efeito de hover com deslocamento horizontal. |
| **Botão de exclusão (Delete Button)** | Botão "x" ao lado de cada item da lista | Permite a remoção pontual de um item. Muda de cor ao passar o mouse para indicar ação destrutiva. |
| **KPI / Indicador numérico** | Campos "Receita", "Despesas" e "Saldo disponível" | Exibem valores financeiros em destaque com tipografia diferenciada. Utilizam cores semânticas: verde para valores positivos e vermelho para negativos. |
| **Barra de progresso (Progress Bar)** | "Comprometimento da renda" | Representa visualmente o percentual da renda comprometido com despesas. Possui gradiente de cores e animação suave ao atualizar. |
| **Gráfico de rosca (Donut Chart)** | Gráfico SVG de distribuição de gastos | Visualização proporcional das três categorias de despesas (fixos, variáveis, assinaturas) com cores distintas e legenda associada. |
| **Legenda (Legend)** | Legenda ao lado do gráfico de rosca | Associa cores a categorias e exibe os valores absolutos de cada uma. |
| **Banner informativo (Info Banner)** | "Dica do Tio Patinhas" | Exibe dicas contextualizadas com base nos dados inseridos. Funciona como um componente de feedback inteligente. |

#### Tela 2 -- Assistente Virtual (Chatbot)

| Componente IHC | Elemento no Sistema | Descrição |
|---|---|---|
| **Cabeçalho de conversa (Chat Header)** | Área com avatar, nome "Assistente Patinhas" e indicador de status | Identifica o interlocutor virtual com avatar gráfico (SVG), nome e indicador de disponibilidade ("online") com animação pulsante. |
| **Corpo de conversa (Chat Body)** | Área de rolagem com mensagens do bot e do usuário | Container com scroll vertical que exibe o histórico da conversa. Utiliza `aria-live="polite"` para acessibilidade com leitores de tela. |
| **Balão de mensagem (Message Bubble)** | Mensagens do bot (alinhadas à esquerda) e do usuário (à direita) | Diferenciam visualmente o emissor através de cor de fundo, alinhamento e arredondamento de bordas. Seguem o padrão consolidado de interfaces de chat. |
| **Chips de sugestão (Suggestion Chips)** | Botões "Como economizar?", "Quanto posso investir?", "Explique a poupança" | Oferecem opções pré-definidas que o usuário pode clicar para enviar como pergunta. Reduzem a barreira de interação e orientam o usuário sobre os temas disponíveis. |
| **Campo de entrada de mensagem (Message Input)** | Campo de texto com placeholder "Escreva sua mensagem..." | Permite digitação livre de perguntas. Suporta envio por tecla Enter ou pelo botão de enviar. |
| **Botão de envio (Send Button)** | Botão com ícone de seta (avião de papel) | Envia a mensagem digitada para o chat. Utiliza ícone SVG e `aria-label` para acessibilidade. |

#### Tela 3 -- Simulador de Investimentos

| Componente IHC | Elemento no Sistema | Descrição |
|---|---|---|
| **Controle segmentado (Segmented Control)** | Seletor "Poupança / CDB-Tesouro / Ações" | Permite a escolha mutuamente exclusiva do tipo de investimento. Utiliza `aria-pressed` para indicar o estado ativo e feedback visual com sombra e cor. |
| **Campos numéricos (Number Input)** | "Valor inicial" e "Aporte mensal" | Campos do tipo `number` para entrada de valores monetários. Atualizam a simulação em tempo real conforme o usuário digita. |
| **Controle deslizante (Range Slider)** | "Período: X meses" | Permite selecionar o período de investimento entre 6 e 120 meses com incrementos de 6. O valor atual é exibido em um rótulo adjacente que se atualiza dinamicamente. |
| **Botão de ação primário (Primary CTA)** | "Simular rendimento" | Dispara o cálculo da simulação. Utiliza cor de destaque (accent) e largura total para enfatizar a ação principal da tela. |
| **Indicadores de resultado (Result KPIs)** | "Total investido", "Valor final" e "Rendimento ganho" | Exibem os resultados numéricos da simulação com formatação monetária e tipografia de destaque. |
| **Etiqueta de risco (Risk Badge)** | Badge "baixo risco", "risco médio", "risco alto" | Componente inline com fundo colorido que indica visualmente o nível de risco associado ao tipo de investimento selecionado. Verde para baixo, azul para médio e vermelho para alto. |
| **Gráfico de barras (Bar Chart)** | Gráfico de evolução patrimonial | Visualização com 5 barras representando a evolução do patrimônio em intervalos proporcionais ao período selecionado. Barras possuem gradiente de cores e animação de transição na altura. |
| **Tabela comparativa (Comparison Table)** | "Compare as opções" | Tabela HTML com cabeçalho e três linhas, mostrando simultaneamente o valor final e o risco para Poupança, CDB/Tesouro e Ações. Facilita a tomada de decisão comparativa. |

#### Componentes Globais (presentes em todas as telas)

| Componente IHC | Elemento no Sistema | Descrição |
|---|---|---|
| **Logotipo/Marca (Branding)** | Ícone SVG com cifrão e texto "Tio Patinhas -- Seu gestor financeiro" | Identidade visual do sistema com tipografia serifada (Fraunces) e ícone vetorial personalizado. |
| **Botão de acessibilidade (Accessibility Toggle)** | Botão "Acessibilidade" no cabeçalho | Abre/fecha o painel de configurações de acessibilidade. Utiliza `aria-expanded` e `aria-controls` para conformidade ARIA. |
| **Painel de acessibilidade (Accessibility Panel)** | Seção expansível com controles de fonte e contraste | Contém os controles de ajuste visual. Utiliza efeito glassmorphism (backdrop-filter) e animação de abertura suave. |
| **Controle de tamanho de fonte** | Botões "A-", "Padrão" e "A+" | Permitem aumentar, diminuir ou resetar o tamanho da fonte globalmente. Atuam sobre a propriedade `font-size` do elemento raiz (`<html>`). |
| **Toggle de alto contraste** | Botão "Ativado/Desativado" no painel de acessibilidade | Alterna entre o tema padrão e o tema de alto contraste (fundo preto, texto branco, bordas brancas). |
| **Skip link (Link de salto)** | Link oculto "Pular para o conteúdo" | Visível apenas ao receber foco via teclado (Tab). Permite que usuários de teclado ou leitores de tela pulem diretamente para o conteúdo principal. |

### 3.3 Acessibilidade

O sistema Tio Patinhas contempla **acessibilidade visual** como tipo de acessibilidade implementado. As funcionalidades de acessibilidade são:

#### 3.3.1 Controle de Tamanho de Fonte

O painel de acessibilidade oferece três botões para controle do tamanho da fonte:

- **A- (Diminuir):** Reduz o tamanho da fonte em 2px, até o mínimo de 13px.
- **Padrão:** Restaura o tamanho original de 16px.
- **A+ (Aumentar):** Aumenta o tamanho da fonte em 2px, até o máximo de 24px.

A alteração é aplicada globalmente através da propriedade `font-size` do elemento `<html>`, garantindo que todos os textos do sistema (títulos, subtítulos, rótulos, valores, mensagens do chat, etc.) sejam redimensionados proporcionalmente, pois os tamanhos internos utilizam a unidade relativa `rem`.

#### 3.3.2 Modo de Alto Contraste

O botão de alto contraste alterna toda a interface para um esquema de cores projetado para pessoas com baixa visão:

- **Fundo:** Preto (#000000)
- **Texto:** Branco (#FFFFFF)
- **Bordas e destaque:** Branco sólido
- **Superfícies:** Cinza muito escuro (#111111)

Este modo elimina gradientes, transparências e sombras coloridas, substituindo-os por bordas sólidas de alto contraste, garantindo legibilidade máxima em todas as condições de visão.

#### 3.3.3 Conformidade ARIA

Toda a interface utiliza atributos ARIA (Accessible Rich Internet Applications) para compatibilidade com tecnologias assistivas:

- `role="tablist"` e `role="tab"` na navegação por abas.
- `role="tabpanel"` em cada seção de conteúdo.
- `aria-selected` para indicar a aba ativa.
- `aria-pressed` para indicar o estado de botões de alternância.
- `aria-expanded` e `aria-controls` no botão de acessibilidade.
- `aria-label` em elementos interativos sem texto visível (botões de ícone, gráficos SVG, slider).
- `aria-live="polite"` no corpo do chat para que leitores de tela anunciem novas mensagens.
- `aria-hidden="true"` em elementos decorativos (ícones SVG, avatares).

#### 3.3.4 Skip Link

Um link oculto ("Pular para o conteúdo") é o primeiro elemento focável da página. Ao pressionar Tab, ele se torna visível e permite que usuários que navegam por teclado saltem diretamente para o conteúdo principal, evitando a necessidade de percorrer toda a navegação.

#### 3.3.5 Foco Visível

Todos os elementos interativos (botões, campos de entrada, abas, chips, slider) possuem um indicador de foco visível com `outline` de 2px na cor de destaque do sistema, com `outline-offset` de 2px para garantir visibilidade sem sobreposição ao conteúdo.

---

## Considerações Finais

O protótipo Tio Patinhas foi desenvolvido com foco na experiência do usuário, priorizando uma interface limpa, moderna e acessível para o gerenciamento financeiro pessoal. O sistema foi implementado em HTML, CSS e JavaScript puro, sem dependência de frameworks, e containerizado com Docker (Nginx Alpine) para facilitar a execução e a entrega.

A abordagem de Design Thinking permitiu compreender as necessidades reais do público-alvo, resultando em funcionalidades que vão além do simples cadastro de dados: o sistema calcula e visualiza informações financeiras em tempo real, oferece orientações contextualizadas e permite simulações comparativas de investimentos.

A implementação de acessibilidade visual (controle de fonte, alto contraste e conformidade ARIA) demonstra o compromisso com a inclusão digital, permitindo que pessoas com diferentes condições visuais possam utilizar o sistema de forma eficaz.

### Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| HTML5 | Estrutura semântica da interface |
| CSS3 | Estilização, responsividade, animações e acessibilidade visual |
| JavaScript (ES6+) | Lógica de interação, cálculos financeiros e manipulação do DOM |
| Google Fonts | Tipografia personalizada (Fraunces e Hanken Grotesk) |
| SVG | Gráficos vetoriais (logotipo, donut chart, ícones) |
| Docker (Nginx Alpine) | Containerização e deploy da aplicação |

### Estrutura de Arquivos

```
ihc-tio-patinhas/
  index.html          -- Estrutura da interface (3 telas)
  style.css           -- Folha de estilos e design system
  script.js           -- Lógica de interação e cálculos
  Dockerfile          -- Configuração do container Docker
  docker-compose.yml  -- Orquestração do container
  RELATORIO.md        -- Este documento
```
