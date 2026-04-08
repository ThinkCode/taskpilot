import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from .config import DATABASE_URL


# Neon provides postgresql://, we need postgresql+asyncpg://
db_url = DATABASE_URL
if db_url.startswith("postgresql://") and "+asyncpg" not in db_url:
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Neon requires SSL
connect_args = {}
if "neon" in db_url or os.getenv("VERCEL"):
    connect_args = {"ssl": "require"}

engine = create_async_engine(db_url, echo=False, connect_args=connect_args)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

_tables_created = False


class Base(DeclarativeBase):
    pass


async def ensure_tables():
    """Create tables if they don't exist (lazy init for serverless)."""
    global _tables_created
    if _tables_created:
        return
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    _tables_created = True


async def get_db():
    await ensure_tables()
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
