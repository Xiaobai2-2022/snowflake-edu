# backend/app/api/v1/api.py
from fastapi import APIRouter

# Import your individual endpoint routers
from app.api.v1.endpoints import topics
# from app.api.v1.endpoints import users, roles  # You will create these later

# This is your central router for all v1 endpoints
api_router = APIRouter()

# Attach the feature routers to the central hub
api_router.include_router(topics.router, prefix="/topics", tags=["Topics (DAG)"])
# api_router.include_router(users.router, prefix="/users", tags=["Users"])
# api_router.include_router(roles.router, prefix="/roles", tags=["RBAC"])