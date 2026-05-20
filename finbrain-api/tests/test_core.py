import unittest
from decimal import Decimal
from app.guardrails.athena import validar
from app.memory.manager import _anonymize
from app.skills.calculos import simular_carteira_acoes

class TestCoreSystems(unittest.TestCase):

    def test_athena_guardrail_blocks_tickers(self):
        """Testa se Athena bloqueia menção a tickers na conversa normal."""
        resultado = validar("Eu recomendo a ação PETR4 para você.")
        # Athena doesn't raise exception, she replaces the blocked word
        self.assertIn("[bloqueado por compliance]", resultado.texto_final)
        self.assertFalse(resultado.ok)

    def test_athena_guardrail_allows_tickers_in_simulation(self):
        """Testa se Athena libera tickers quando estamos no modo simulacao_acoes."""
        resultado = validar("Na simulação a ação PETR4 rendeu bem.", allow_tickers=True)
        self.assertIn("PETR4", resultado.texto_final)
        self.assertTrue(resultado.ok)

    def test_memory_anonymizer(self):
        """Testa se a rede Zettelkasten higieniza os dados sensíveis antes de publicar."""
        raw_insight = "O usuário Felipe com CPF 123.456.789-00 investiu R$ 15.000,50 hoje."
        safe_insight = _anonymize(raw_insight)
        
        self.assertNotIn("123.456.789-00", safe_insight)
        self.assertIn("[CPF REMOVIDO]", safe_insight)
        self.assertNotIn("15.000,50", safe_insight)
        self.assertIn("[VALOR_REMOVIDO]", safe_insight)

    def test_calculo_simulacao_carteira(self):
        """Testa se o cálculo matemático da skill determinística está correto."""
        tickers = [{"ticker": "WEGE3", "peso": 0.5}, {"ticker": "ITUB4", "peso": 0.5}]
        
        resultado = simular_carteira_acoes(
            valor_inicial=Decimal("1000.0"),
            aporte_mensal=Decimal("0.0"),
            meses=12,
            tickers_pesos=tickers
        )
        
        self.assertTrue(resultado["valor_final"] > 1000.0)
        self.assertEqual(resultado["total_investido"], Decimal("1000.0"))
        self.assertEqual(len(resultado["evolucao"]), 13)

if __name__ == '__main__':
    unittest.main()
