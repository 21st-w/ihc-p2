# Documentação do Obsidian Vault (Second Brain)

O **Tio Patinhas** adota o conceito de *Second Brain* (Segundo Cérebro) popularizado por Tiago Forte. A ideia é externalizar todo o conhecimento e planejamento financeiro para fora da mente do usuário, armazenando em uma estrutura conectada.

O software escolhido para visualizar isso é o **Obsidian**, um editor de Markdown local e poderoso.

## Como o sistema se integra ao Obsidian

O backend possui o serviço `obsidian_service.py`, cuja responsabilidade (operada logicamente pela "agente" **Athena**) é criar arquivos de texto plano (`.md`) diretamente na máquina local do usuário, dentro da pasta raiz do projeto.

### Diretório Base
O diretório utilizado é o `/obsidian-vault/`.

## Estrutura do Vault

Quando a API é iniciada (ou um usuário realiza o fluxo), a seguinte estrutura é garantida:

```text
obsidian-vault/
├── README.md
├── conhecimento-publico/
│   ├── juros-compostos.md
│   ├── organizacao-financeira.md
│   └── reserva-de-emergencia.md
├── agentes/
│   ├── freud.md
│   ├── moriarty.md
│   └── athena.md
└── usuarios/
    └── user_001/
        ├── diagnostico-inicial.md
        ├── perfil-financeiro.md
        ├── plano-educacional.md
        └── simulacao-reserva.md
```

## Vantagens da Abordagem

1. **Privacidade Total**: Diferente de plataformas SaaS de finanças que guardam e vendem seus dados, o cofre do Obsidian é **100% offline** e pertence ao usuário em arquivos de texto.
2. **Longevidade**: Arquivos Markdown (`.md`) nunca se tornarão obsoletos.
3. **Conexões (Backlinks)**: Dentro do Obsidian, os arquivos utilizam "Tags" e o usuário pode facilmente conectar seu "plano educacional" a uma nota de "juros compostos".

## Visualização no Frontend

Como o MVP também conta com uma interface web para usuários que ainda não utilizam o aplicativo desktop do Obsidian, a rota `/second-brain` no frontend (Next.js) possui um renderizador integrado (`react-markdown`) que simula a experiência de leitura de um arquivo `.md`.
