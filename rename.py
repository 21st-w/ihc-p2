import os

files_to_check = [
    "README.md",
    "finbrain-api/app/api/agentes.py",
    "finbrain-api/app/api/transacoes.py",
    "finbrain-api/app/api/financeiro.py",
    "finbrain-api/app/api/auth.py",
    "finbrain-api/app/schemas/schemas.py",
    "finbrain-api/app/skills/calculos.py",
    "finbrain-api/app/main.py",
    "finbrain-api/app/core/security.py",
    "finbrain-api/app/core/database.py",
    "finbrain-api/app/core/config.py",
    "finbrain-api/app/guardrails/athena.py",
    "finbrain-api/app/agents/yuyu.py",
    "finbrain-api/app/agents/sherlock.py",
    "finbrain-api/app/agents/benjamin.py",
    "finbrain-web/components/sidebar.tsx",
    "finbrain-web/lib/mock.ts",
    "finbrain-web/app/(app)/chat/page.tsx",
    "finbrain-web/app/layout.tsx",
    "finbrain-web/app/globals.css",
    "finbrain-web/app/(auth)/signup/page.tsx"
]

for file in files_to_check:
    if os.path.exists(file):
        with open(file, 'r') as f:
            content = f.read()
        
        # We also want to replace "finbrain" in imports/urls if needed, but let's stick to "FinBrain" -> "Tio Patinhas"
        content = content.replace("FinBrain", "Tio Patinhas")
        
        if "app/core/config.py" in file:
            content = content.replace("postgresql://finbrain:finbrain", "postgresql+psycopg://finbrain:finbrain")
            
        with open(file, 'w') as f:
            f.write(content)
print("Renamed and config fixed.")
