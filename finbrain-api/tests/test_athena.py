"""Tests for app/guardrails/athena.py."""
from app.guardrails.athena import validar


class TestAthenaGuardrails:
    def test_clean_text_passes(self):
        r = validar("O CDI é a taxa de referência do mercado interbancário.")
        assert r.ok is True
        assert len(r.bloqueios) == 0
        assert "⚠️" in r.texto_final

    def test_blocks_compre(self):
        r = validar("Compre ações da Petrobras agora!")
        assert r.ok is False
        assert any("Frase bloqueada" in b for b in r.bloqueios)
        assert "[bloqueado por compliance]" in r.texto_final

    def test_blocks_ticker(self):
        r = validar("PETR4 está barata, aproveite.")
        assert r.ok is False
        assert any("Ticker bloqueado" in b for b in r.bloqueios)

    def test_blocks_vai_subir(self):
        r = validar("O dólar vai subir muito essa semana.")
        assert r.ok is False

    def test_blocks_rentabilidade_garantida(self):
        r = validar("Oferecemos rentabilidade garantida de 2% ao mês.")
        assert r.ok is False

    def test_blocks_invista_em(self):
        r = validar("Invista em fundos imobiliários agora.")
        assert r.ok is False

    def test_disclaimer_always_present(self):
        r = validar("A poupança rende 0.5% ao mês quando a Selic está acima de 8.5%.")
        assert "Simulação educacional" in r.texto_final

    def test_no_duplicate_disclaimer(self):
        text = "Algo.\n\n⚠️ Simulação educacional. Não é recomendação de investimento. Performance passada não garante resultados futuros."
        r = validar(text)
        assert r.texto_final.count("⚠️") == 1

    def test_multiple_tickers(self):
        r = validar("Compare VALE3, PETR4 e ITUB4.")
        assert r.ok is False
        assert len([b for b in r.bloqueios if "Ticker" in b]) == 3

    def test_blocks_venda(self):
        r = validar("Venda suas posições agora.")
        assert r.ok is False

    def test_educational_content_passes(self):
        r = validar("Juros compostos são calculados sobre o montante acumulado, incluindo juros anteriores.")
        assert r.ok is True
