from sqlalchemy import String, Text, Integer, Boolean
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.notebook.model import note_book_source
from backend.common.model import Base, id_key


class NoteSource(Base):
    __tablename__ = "noteSource"
    id: Mapped[id_key] = mapped_column(init=False)
    uuid: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    title: Mapped[str] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String(32))
    url: Mapped[str] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(Boolean)

    notebooks: Mapped[list['Notebook']] = relationship(
        secondary=note_book_source, back_populates='source', init=False
    )
