# backend/app/api/v1/endpoints/topics.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID

from app.db.database import get_db
from app import models

from app.schemas import TopicNodeResponse

router = APIRouter()


@router.get("/{topic_id}/learning-path", response_model=TopicNodeResponse)
def get_custom_learning_path(
        topic_id: UUID,
        user_id: UUID,
        max_depth: int = Query(3, description="Maximum depth of prerequisites to fetch", ge=1, le=10),
        db: Session = Depends(get_db)
):
    """
    Fetch up to 'max_depth' prerequisites for a given topic.
    Branches are cut short if the user has already completed a prerequisite.
    """

    # 1. Fetch all topics the user has ALREADY completed.
    # We put them in a Python 'set' for O(1) lightning-fast lookups.
    completed_topics_query = db.query(models.UserCompletedTopics.topic_id).filter(
        models.UserCompletedTopics.user_id == user_id
    ).all()
    completed_ids = {row[0] for row in completed_topics_query}

    # 2. If the user already completed the target topic, return immediately.
    if topic_id in completed_ids:
        raise HTTPException(
            status_code=400,
            detail="User has already completed this topic."
        )

    # 3. Recursive function to traverse the DAG (Depth-First Search)
    def build_prereq_tree(current_topic_id: UUID, current_depth: int) -> Optional[dict]:
        # Fetch the topic from the database
        topic = db.query(models.Topic).filter(models.Topic.topic_id == current_topic_id).first()
        if not topic:
            return None

        prereqs = []

        # Only dig deeper if we haven't hit the depth limit (n)
        if current_depth < max_depth:
            for prereq in topic.prerequisites:
                # PRUNING LOGIC: If user knows this prereq, skip it entirely!
                if prereq.topic_id not in completed_ids:
                    # Recursively build the branch for this prerequisite
                    subtree = build_prereq_tree(prereq.topic_id, current_depth + 1)
                    if subtree:
                        prereqs.append(subtree)

        # Return it as a dictionary so Pydantic can format it into JSON
        return {
            "topic_id": topic.topic_id,
            "topic_name": topic.topic_name,
            "topic_description": topic.topic_description,
            "topic_url": topic.topic_url,
            "prerequisites": prereqs
        }

    # 4. Kick off the recursive tree builder starting at depth 0
    tree = build_prereq_tree(topic_id, 0)

    if not tree:
        raise HTTPException(status_code=404, detail="Topic not found.")

    return tree
