from typing import Generic, TypeVar
from app.config.database import db

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, model: type[T]):
        self._model = model

    def get_by_id(self, id) -> T | None:
        return db.session.get(self._model, id)

    def save(self, entity: T) -> T:
        db.session.add(entity)
        db.session.flush()
        return entity

    def delete(self, entity: T) -> None:
        db.session.delete(entity)
        db.session.flush()

    def commit(self) -> None:
        db.session.commit()

    def rollback(self) -> None:
        db.session.rollback()
