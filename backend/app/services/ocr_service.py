from typing import Any

from azure.ai.formrecognizer import DocumentAnalysisClient  # type: ignore[import-untyped]
from azure.core.credentials import AzureKeyCredential

from app.core.config import settings


class OCRService:
    def __init__(self) -> None:
        if (
            not settings.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT
            or not settings.AZURE_DOCUMENT_INTELLIGENCE_KEY
        ):
            raise ValueError("Azure Document Intelligence configuration is missing")

        self.client = DocumentAnalysisClient(
            endpoint=settings.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT,
            credential=AzureKeyCredential(settings.AZURE_DOCUMENT_INTELLIGENCE_KEY),
        )

    def parse_receipt(self, file_content: bytes) -> list[dict[str, Any]]:
        poller = self.client.begin_analyze_document("prebuilt-receipt", document=file_content)
        result = poller.result()

        items: list[dict[str, Any]] = []

        # Type guard: check if documents exist and is not None
        if not result.documents:
            return [{"name": "不明な商品", "quantity": 1, "unitPrice": 0, "isDailyNecessity": True}]

        for receipt in result.documents:
            # Type guard: check if fields exist and is not None
            if not receipt.fields or "Items" not in receipt.fields:
                continue

            items_field = receipt.fields.get("Items")
            if not items_field or not items_field.value:
                continue

            # Type guard: ensure value is a list
            items_value = items_field.value
            if not isinstance(items_value, list):
                continue

            for idx, item in enumerate(items_value):
                if not hasattr(item, "value") or not isinstance(item.value, dict):
                    continue

                item_dict: dict[str, Any] = item.value
                name = item_dict.get("Description")
                quantity = item_dict.get("Quantity")
                price = item_dict.get("TotalPrice")

                name_val = name.value if name and hasattr(name, "value") else f"商品-{idx + 1}"
                quantity_val = quantity.value if quantity and hasattr(quantity, "value") else 1
                price_val = price.value if price and hasattr(price, "value") else 0

                items.append({
                    "name": name_val,
                    "quantity": int(quantity_val) if quantity_val else 1,
                    "unitPrice": int(price_val) if price_val else 0,
                    "isDailyNecessity": True,  # Default to True as in mock
                })

        if not items:
            # Fallback if no items found
            return [{"name": "不明な商品", "quantity": 1, "unitPrice": 0, "isDailyNecessity": True}]

        return items
