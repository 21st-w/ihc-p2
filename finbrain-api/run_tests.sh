#!/bin/bash
# Script para executar a bateria de testes automatizados do Tio Patinhas API

echo "Iniciando bateria de testes do FinBrain API (Tio Patinhas)..."
echo "--------------------------------------------------------"

# Configura o PYTHONPATH para rodar a partir do diretorio raiz
export PYTHONPATH=$(pwd)

# Executa o Unittest na pasta tests/
python3 -m unittest discover tests -v

if [ $? -eq 0 ]; then
    echo "--------------------------------------------------------"
    echo "✅ TODOS OS TESTES PASSARAM! Sistema pronto para produção."
else
    echo "--------------------------------------------------------"
    echo "❌ FALHA EM UM OU MAIS TESTES! Revise o código."
    exit 1
fi
