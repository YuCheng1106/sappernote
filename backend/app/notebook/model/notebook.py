from sqlalchemy import String, Text, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.notebook.model.note_book_source import note_book_source
from backend.app.notebook.model.notebook_note import note_book_note
from backend.common.model import Base, id_key


class Notebook(Base):
    __tablename__ = "notebook"
    id: Mapped[id_key] = mapped_column(init=False)
    uuid: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    user_uuid: Mapped[str] = mapped_column(Text)
    title: Mapped[str] = mapped_column(Text)
    content: Mapped[str] = mapped_column(Text)
    active: Mapped[bool] = mapped_column(Boolean)

    # Define the relationship with NoteSource using the note_book_source association table
    source: Mapped[list['NoteSource']] = relationship(
        secondary=note_book_source, back_populates='notebooks', init=False
    )

    notes: Mapped[list['Note']] = relationship(
        secondary=note_book_note, back_populates='notebooks', init=False
    )
