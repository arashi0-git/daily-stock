from pydantic import BaseModel, Field


class ReceiptItem(BaseModel):
    name: str = Field(..., description="Name of the item")
    quantity: int = Field(1, description="Quantity of the item")
    unit_price: int = Field(0, alias="unitPrice", description="Unit price of the item")
    is_daily_necessity: bool = Field(
        True, alias="isDailyNecessity", description="Whether the item is a daily necessity"
    )

    model_config = {"populate_by_name": True}
