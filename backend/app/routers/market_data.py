"""Endpoints de dados de mercado para simulacoes educacionais."""

from fastapi import APIRouter

from app.services import market_data_service


router = APIRouter(prefix="/market", tags=["Dados de Mercado Educacionais"])


@router.get("/selic")
def selic():
    return market_data_service.get_selic()


@router.get("/ipca")
def ipca():
    return market_data_service.get_ipca()


@router.get("/poupanca")
def poupanca():
    return market_data_service.get_poupanca()


@router.get("/cdi")
def cdi():
    return market_data_service.get_cdi()


@router.get("/quote/{ticker}")
def quote(ticker: str):
    return market_data_service.get_quote(ticker)


@router.get("/fund/{cnpj:path}/quota")
def fund_quota(cnpj: str):
    return market_data_service.get_fund_quota(cnpj)


@router.get("/snapshot")
def snapshot():
    return market_data_service.get_market_snapshot()
