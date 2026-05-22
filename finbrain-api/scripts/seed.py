"""Seed script to create test users."""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.core.security import hash_password
from app.models.models import Base, User


def seed_database():
    """Create test users for development."""
    # Create engine
    engine = create_engine(settings.postgres_url)
    Base.metadata.create_all(engine)
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    # Test users
    test_users = [
        {
            "nome": "João Silva",
            "email": "joao@finbrain.com",
            "senha": "senha123",
        },
        {
            "nome": "Maria Santos",
            "email": "maria@finbrain.com",
            "senha": "senha123",
        },
        {
            "nome": "Carlos Oliveira",
            "email": "carlos@finbrain.com",
            "senha": "senha123",
        },
    ]
    
    for user_data in test_users:
        existing = session.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            user = User(
                nome=user_data["nome"],
                email=user_data["email"],
                senha_hash=hash_password(user_data["senha"]),
            )
            session.add(user)
            print(f"✓ Usuário criado: {user_data['email']}")
        else:
            print(f"→ Usuário já existe: {user_data['email']}")
    
    session.commit()
    session.close()
    print("\n✓ Seed concluído!")


if __name__ == "__main__":
    seed_database()
