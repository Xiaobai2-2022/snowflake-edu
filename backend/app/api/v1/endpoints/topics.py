import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.models import Topic

router = APIRouter()

@router.get("/{_topic_name_}")
def get_topic(_topic_name_: str, db: Session = Depends(get_db)):
    """
    Fetch a topic configuration by its topic_name from PostgreSQL
    """
    topic = db.query(Topic).filter(func.lower(Topic.topic_name) == _topic_name_.lower()).first()

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    try:
        topic_data = json.loads(topic.topic_json)
    except (json.JSONDecodeError, TypeError):
        raise HTTPException(status_code=500, detail="Corrupted JSON data in database")

    return topic_data
