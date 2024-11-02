from sqlalchemy import String, Text, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.common.model import Base, id_key

class Embedding(Base):
    __tablename__ = 'embedding'
    id: Mapped[id_key] = mapped_column(init=False)
    notesource_id: Mapped[int] = mapped_column(Integer, ForeignKey('noteSource.id', ondelete='CASCADE'))
    uuid: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    content: Mapped[str] = mapped_column(Text)
    embedding: Mapped[str] = mapped_column(Text)

    # Relationship to NoteSource
    note_source: Mapped['NoteSource'] = relationship("NoteSource", back_populates="embeddings", init=False)
