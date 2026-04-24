# backend/app/schemas.py
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class TopicNodeResponse(BaseModel):
    topic_id: UUID
    topic_name: str
    topic_description: Optional[str] = None
    topic_url: Optional[str] = None
    prerequisites: List['TopicNodeResponse'] = []

    class Config:
        from_attributes = True

# Required for self-referencing Pydantic models
TopicNodeResponse.model_rebuild()