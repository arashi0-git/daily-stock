from typing import Annotated, Any

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.ocr_service import OCRService

router = APIRouter()


@router.post("/receipt")
async def parse_receipt(file: Annotated[UploadFile, File()]) -> list[dict[str, Any]]:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are supported.")

    try:
        content = await file.read()
        service = OCRService()
        items = service.parse_receipt(content)
        return items
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {e!s}")
