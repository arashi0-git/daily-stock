from fastapi import APIRouter

from .auth import router as auth_router
from .ocr import router as ocr_router

api_router = APIRouter()
api_router.include_router(auth_router, tags=["auth"])
api_router.include_router(ocr_router, prefix="/ocr", tags=["ocr"])
