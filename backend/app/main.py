from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router

# Assuming you create a centralized router in app/api/v1/api.py
# and a config file in app/core/config.py
# from app.api.v1.api import api_router
# from app.core.config import settings

app = FastAPI(
    title="Snowflake-Educational API",
    description="A Granular Knowledge DAG Educational Platform.",
    version="1.0.0",
    # openapi_url=f"{settings.API_V1_STR}/openapi.json" # Uncomment once config is set up
)

# Set all CORS enabled origins
# This allows your frontend (e.g., React/Vue) to communicate with the FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace "*" with your frontend's exact URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the main API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Health Check"])
async def root():
    """
    Root endpoint to verify the API is running.
    """
    return {
        "message": "Welcome to the Snowflake-Edu API",
        "status": "online",
        "docs_url": "/docs"
    }

# @app.get("/hello/{name}", tags=["Testing"])
# async def say_hello(name: str):
#     """
#     A quick test endpoint to see how path parameters work.
#     """
#     return {"message": f"Hello {name}, your API is working!"}
