"""
Tio Patinhas — Fine-tuning com Unsloth + LoRA
==============================================
Estágio 2: SFT  (Supervised Fine-Tuning)
Estágio 3: DPO  (Direct Preference Optimization — RLHF simplificado)

Requisitos:
    pip install unsloth datasets trl transformers accelerate bitsandbytes

GPU mínima: 6 GB VRAM (com quantização 4-bit)
GPU recomendada: 8–16 GB VRAM
"""

import json
import torch
from pathlib import Path
from datasets import Dataset
from unsloth import FastLanguageModel
from trl import SFTTrainer, DPOTrainer, DPOConfig
from transformers import TrainingArguments

# ── Configurações ─────────────────────────────────────────────────────────────
MODEL_ID    = "unsloth/Llama-3.2-3B-Instruct-bnb-4bit"  # mesmo base do ollama llama3.2
OUTPUT_DIR  = Path(__file__).parent / "output"
SFT_JSONL   = Path(__file__).parent / "dataset_sft.jsonl"
DPO_JSONL   = Path(__file__).parent / "dataset_dpo.jsonl"

MAX_SEQ_LEN = 2048
LORA_RANK   = 16   # quanto maior, mais parâmetros treináveis (e mais lento)
DTYPE       = None  # auto-detect
LOAD_4BIT   = True  # economiza ~60% de VRAM

SYSTEM_PROMPT = """Você é o assistente educacional do Tio Patinhas.
Responda em português brasileiro usando Markdown.
Nunca recomende ativos específicos nem sugira timing de mercado.
Toda resposta com dado financeiro termina com:
⚠️ Conteúdo educacional. Não é recomendação de investimento."""

# ── Carrega modelo base com LoRA ──────────────────────────────────────────────
def load_model():
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=MODEL_ID,
        max_seq_length=MAX_SEQ_LEN,
        dtype=DTYPE,
        load_in_4bit=LOAD_4BIT,
    )
    model = FastLanguageModel.get_peft_model(
        model,
        r=LORA_RANK,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                        "gate_proj", "up_proj", "down_proj"],
        lora_alpha=LORA_RANK * 2,
        lora_dropout=0,
        bias="none",
        use_gradient_checkpointing="unsloth",
        random_state=42,
    )
    return model, tokenizer


def format_sft(row: dict, tokenizer) -> str:
    """Formata exemplo SFT no template ChatML esperado pelo Llama 3.2."""
    messages = [
        {"role": "system",    "content": SYSTEM_PROMPT},
        {"role": "user",      "content": row["instruction"]},
        {"role": "assistant", "content": row["output"]},
    ]
    return tokenizer.apply_chat_template(messages, tokenize=False,
                                         add_generation_prompt=False)


# ── Estágio 2 — SFT ──────────────────────────────────────────────────────────
def stage2_sft(model, tokenizer):
    print("\n=== ESTÁGIO 2: Supervised Fine-Tuning ===")

    raw = [json.loads(l) for l in SFT_JSONL.read_text().splitlines() if l.strip()]
    dataset = Dataset.from_list([
        {"text": format_sft(row, tokenizer)} for row in raw
    ])

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="text",
        max_seq_length=MAX_SEQ_LEN,
        args=TrainingArguments(
            per_device_train_batch_size=2,
            gradient_accumulation_steps=4,
            num_train_epochs=3,
            learning_rate=2e-4,
            fp16=not torch.cuda.is_bf16_supported(),
            bf16=torch.cuda.is_bf16_supported(),
            logging_steps=5,
            output_dir=str(OUTPUT_DIR / "sft"),
            save_strategy="epoch",
            warmup_ratio=0.1,
            lr_scheduler_type="cosine",
            report_to="none",
        ),
    )
    trainer.train()
    model.save_pretrained(OUTPUT_DIR / "sft_lora")
    tokenizer.save_pretrained(OUTPUT_DIR / "sft_lora")
    print(f"✅ SFT salvo em {OUTPUT_DIR / 'sft_lora'}")
    return model


# ── Estágio 3 — DPO (RLHF simplificado) ─────────────────────────────────────
def stage3_dpo(model, tokenizer):
    print("\n=== ESTÁGIO 3: DPO (RLHF simplificado) ===")

    def fmt(role: str, text: str) -> list:
        return [{"role": "system",  "content": SYSTEM_PROMPT},
                {"role": role,      "content": text}]

    raw = [json.loads(l) for l in DPO_JSONL.read_text().splitlines() if l.strip()]
    dataset = Dataset.from_list([
        {
            "prompt":   tokenizer.apply_chat_template(fmt("user", r["prompt"]),
                                                      tokenize=False,
                                                      add_generation_prompt=True),
            "chosen":   r["chosen"],
            "rejected": r["rejected"],
        }
        for r in raw
    ])

    trainer = DPOTrainer(
        model=model,
        ref_model=None,          # None = usa o próprio modelo como referência
        tokenizer=tokenizer,
        train_dataset=dataset,
        args=DPOConfig(
            per_device_train_batch_size=1,
            gradient_accumulation_steps=8,
            num_train_epochs=2,
            learning_rate=5e-5,
            fp16=not torch.cuda.is_bf16_supported(),
            bf16=torch.cuda.is_bf16_supported(),
            logging_steps=5,
            output_dir=str(OUTPUT_DIR / "dpo"),
            beta=0.1,            # quanto afastar do modelo de referência
            report_to="none",
        ),
    )
    trainer.train()
    model.save_pretrained(OUTPUT_DIR / "dpo_lora")
    tokenizer.save_pretrained(OUTPUT_DIR / "dpo_lora")
    print(f"✅ DPO salvo em {OUTPUT_DIR / 'dpo_lora'}")
    return model


# ── Exporta para GGUF (formato Ollama) ───────────────────────────────────────
def export_gguf(model, tokenizer):
    print("\n=== EXPORTANDO PARA GGUF (Ollama) ===")
    model.save_pretrained_gguf(
        str(OUTPUT_DIR / "tiopatinhas-gguf"),
        tokenizer,
        quantization_method="q4_k_m",   # bom equilíbrio qualidade/tamanho
    )
    print(f"✅ GGUF salvo em {OUTPUT_DIR / 'tiopatinhas-gguf'}")
    print("\nPara criar o modelo no Ollama:")
    print(f"  ollama create tiopatinhas -f {OUTPUT_DIR}/tiopatinhas-gguf/Modelfile")


# ── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    model, tokenizer = load_model()

    # Estágio 2: SFT
    model = stage2_sft(model, tokenizer)

    # Estágio 3: DPO (sobre o modelo já ajustado pelo SFT)
    model = stage3_dpo(model, tokenizer)

    # Exporta para usar no Ollama
    export_gguf(model, tokenizer)

    print("\n🎉 Pipeline completo!")
    print("Próximo passo: ollama create tiopatinhas -f output/tiopatinhas-gguf/Modelfile")
