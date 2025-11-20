from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.receipt import ReceiptItem
from app.services.ocr_service import OCRService

router = APIRouter()


@router.post("/receipt", response_model=list[ReceiptItem])
async def parse_receipt(file: Annotated[UploadFile, File()]) -> list[ReceiptItem]:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are supported.")

    # File size limit (example: 10MB)
    MAX_FILE_SIZE = 10 * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

    try:
        service = OCRService()
        items = service.parse_receipt(content)
        return items
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {e!s}")
