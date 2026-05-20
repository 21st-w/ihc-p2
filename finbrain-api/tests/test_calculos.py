"""Tests for app/skills/calculos.py."""
from decimal import Decimal
import pytest
from app.skills.calculos import (
    juros_compostos, reserva_emergencia, score_saude,
    diagnostico_gastos, equivalencia_taxa, comparar_rentabilidade,
)


class TestJurosCompostos:
    def test_basic(self):
        r = juros_compostos(Decimal("1000"), Decimal("500"), Decimal("0.01"), 12)
        assert r["valor_final"] > Decimal("7000")
        assert r["total_investido"] == Decimal("7000")
        assert r["total_juros"] > 0
        assert len(r["evolucao"]) == 13

    def test_zero_rate(self):
        r = juros_compostos(Decimal("1000"), Decimal("100"), Decimal("0"), 10)
        assert r["valor_final"] == Decimal("2000")
        assert r["total_juros"] == Decimal("0")

    def test_zero_months(self):
        r = juros_compostos(Decimal("1000"), Decimal("500"), Decimal("0.01"), 0)
        assert r["valor_final"] == Decimal("1000")

    def test_negative_months_raises(self):
        with pytest.raises(ValueError):
            juros_compostos(Decimal("1000"), Decimal("0"), Decimal("0.01"), -1)

    def test_negative_rate_raises(self):
        with pytest.raises(ValueError):
            juros_compostos(Decimal("1000"), Decimal("0"), Decimal("-0.01"), 12)


class TestReservaEmergencia:
    def test_basic(self):
        r = reserva_emergencia(Decimal("3000"), 6, Decimal("500"))
        assert r["valor_alvo"] == Decimal("18000")
        assert r["meses_para_atingir"] == 36

    def test_no_aporte(self):
        r = reserva_emergencia(Decimal("3000"), 6)
        assert r["meses_para_atingir"] is None

    def test_invalid_gastos(self):
        with pytest.raises(ValueError):
            reserva_emergencia(Decimal("0"))


class TestScoreSaude:
    def test_perfect(self):
        r = score_saude(Decimal("0.25"), Decimal("0"), Decimal("6"))
        assert r["score"] == 100
        assert r["nivel"] == "Excelente"

    def test_zero(self):
        r = score_saude(Decimal("0"), Decimal("1"), Decimal("0"))
        assert r["score"] == 0
        assert r["nivel"] == "Crítico"

    def test_mid(self):
        r = score_saude(Decimal("0.10"), Decimal("0.50"), Decimal("3"))
        assert 30 <= r["score"] <= 70


class TestDiagnosticoGastos:
    def test_basic(self):
        txs = [
            {"valor": "5000", "tipo": "credito", "categoria": "salario"},
            {"valor": "1500", "tipo": "debito", "categoria": "moradia"},
            {"valor": "300", "tipo": "debito", "categoria": "lazer"},
        ]
        r = diagnostico_gastos(txs)
        assert r["total_creditos"] == Decimal("5000")
        assert r["total_debitos"] == Decimal("1800")
        assert r["fixos"] == Decimal("1500")

    def test_subscription_detection(self):
        txs = [
            {"valor": "30", "tipo": "debito", "categoria": "assinatura", "descricao": "Netflix"},
            {"valor": "30", "tipo": "debito", "categoria": "assinatura", "descricao": "Netflix"},
        ]
        r = diagnostico_gastos(txs)
        assert len(r["assinaturas_detectadas"]) == 1


class TestEquivalenciaTaxa:
    def test_mensal_to_anual(self):
        r = equivalencia_taxa(Decimal("0.01"), "mensal", "anual")
        assert Decimal("0.12") < r <= Decimal("0.13")

    def test_same(self):
        assert equivalencia_taxa(Decimal("0.05"), "anual", "anual") == Decimal("0.05")

    def test_invalid(self):
        with pytest.raises(ValueError):
            equivalencia_taxa(Decimal("0.01"), "diaria", "anual")


class TestCompararRentabilidade:
    def test_basic(self):
        r = comparar_rentabilidade(Decimal("1000"), Decimal("500"), 12)
        assert r["poupanca"]["isento_ir"] is True
        assert r["cdb_100_cdi"]["valor_final_liquido"] > r["poupanca"]["valor_final"]

    def test_invalid_meses(self):
        with pytest.raises(ValueError):
            comparar_rentabilidade(Decimal("1000"), Decimal("0"), 0)
