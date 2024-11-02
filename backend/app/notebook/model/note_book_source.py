#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from sqlalchemy import INT, Column, ForeignKey, Integer, Table

from backend.common.model import MappedBase

note_book_source = Table(
    'note_book_source',
    MappedBase.metadata,
    Column('id', INT, primary_key=True, unique=True, index=True, autoincrement=True, comment='主键ID'),
    Column('notebook_id', Integer, ForeignKey('notebook.id', ondelete='CASCADE'), primary_key=True, comment='笔记ID'),
    Column('notesource_id', Integer, ForeignKey('noteSource.id', ondelete='CASCADE'), primary_key=True, comment='来源ID'),
)
