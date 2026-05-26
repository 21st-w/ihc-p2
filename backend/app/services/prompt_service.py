"""Carregamento simples de prompts Markdown dos agentes."""

from pathlib import Path


PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


def load_prompt(name: str) -> str:
    path = PROMPTS_DIR / f"{name}.md"
    if not path.exists():
        raise FileNotFoundError(f"Prompt não encontrado: {name}")
    return path.read_text(encoding="utf-8")


def render_prompt(template: str, variables: dict) -> str:
    result = template
    for key, value in variables.items():
        result = result.replace("{{" + key + "}}", str(value))
    return result
