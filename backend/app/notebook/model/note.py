from sqlalchemy import String, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.notebook.model import note_book_note
from backend.common.model import Base, id_key


class Note(Base):
    __tablename__ = "note"
    id: Mapped[id_key] = mapped_column(init=False)
    uuid: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    title: Mapped[str] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String(32))
    active: Mapped[bool] = mapped_column(Boolean)

    notebooks: Mapped[list['Notebook']] = relationship(
        secondary=note_book_note, back_populates='notes', init=False
    )
