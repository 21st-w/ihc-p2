.PHONY: up down migrate test dev lint format seed

up:
	docker compose up -d

down:
	docker compose down

migrate:
	alembic upgrade head

test:
	pytest -v --cov=app --cov-report=term-missing

dev:
	uvicorn app.main:app --reload --port 8000

lint:
	ruff check app/ tests/
	mypy app/ --strict

format:
	ruff format app/ tests/
	ruff check --fix app/ tests/

seed:
	python -m scripts.seed_dev
