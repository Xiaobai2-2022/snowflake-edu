# backend/app/models.py
from sqlalchemy import Column, String, Boolean, ForeignKey, Table, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum
from app.db.database import Base

# Roles ENUM
class RoleEnum(str, enum.Enum):
    instructor = 'instructor'
    tutor_isc = 'tutor_isc'
    tutor_isa = 'tutor_isa'
    student = 'student'
    employer = 'employer'

# User Complete Topic
class UserCompletedTopics(Base):
    __tablename__ = "user_completed_topics"

    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete="CASCADE"), primary_key=True)
    topic_id = Column(UUID(as_uuid=True), ForeignKey('topics.topic_id', ondelete="CASCADE"), primary_key=True)

# Topic Prerequisites
topic_prerequisites = Table(
    'topic_prerequisites',
    Base.metadata,
    Column('topic_id', UUID(as_uuid=True), ForeignKey('topics.topic_id', ondelete="CASCADE"), primary_key=True),
    Column('prerequisite_id', UUID(as_uuid=True), ForeignKey('topics.topic_id', ondelete="CASCADE"), primary_key=True)
)

# Users
class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_name = Column(String, nullable=False)
    is_admin = Column(Boolean, nullable=False, default=False)

    roles = relationship("UserRole", back_populates="user", cascade="all, delete-orphan")

    completed_topics = relationship(
        "Topic",
        secondary="user_completed_topics",
        backref="completed_by_users"
    )

# Topics
class Topic(Base):
    __tablename__ = "topics"

    topic_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic_name = Column(String, nullable=False)
    topic_description = Column(String, nullable=False)
    topic_url = Column(String, nullable=True)

    prerequisites = relationship(
        "Topic",
        secondary=topic_prerequisites,
        primaryjoin=topic_id == topic_prerequisites.c.topic_id,
        secondaryjoin=topic_id == topic_prerequisites.c.prerequisite_id,
        backref="is_prerequisite_for"
    )

# User Roles
class UserRole(Base):
    __tablename__ = "user_roles"

    user_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id', ondelete="CASCADE"), primary_key=True)
    topic_id = Column(UUID(as_uuid=True), ForeignKey('topics.topic_id', ondelete="CASCADE"), primary_key=True)
    role_level = Column(SQLEnum(RoleEnum, name="roles"), primary_key=True)

    user = relationship("User", back_populates="roles")
    topic = relationship("Topic")
