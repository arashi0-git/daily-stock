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

        items = []
        for receipt in result.documents:
            if "Items" in receipt.fields:
                for idx, item in enumerate(receipt.fields["Items"].value):
                    item_dict = item.value
                    name = item_dict.get("Description")
                    quantity = item_dict.get("Quantity")
                    price = item_dict.get("TotalPrice")

                    name_val = name.value if name else f"商品-{idx + 1}"
                    quantity_val = quantity.value if quantity else 1
                    price_val = price.value if price else 0

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
