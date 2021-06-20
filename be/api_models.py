from pydantic import BaseModel, validator
from pydantic.types import StrictStr


class DataSourceModel(BaseModel):
    id: int = ...
    name: StrictStr = None
    link: StrictStr = None
    product_link: StrictStr = None
    javascript: bool = None
    remarks: StrictStr = None

    class Config:
        orm_mode = True


class HTMLDomApiModel(BaseModel):
    id: int = ...
    barcode: StrictStr = None
    name: StrictStr = None
    category: StrictStr = None
    thumbnail: StrictStr = None
    price: StrictStr = None
    description: StrictStr = None
    remarks: StrictStr = None

    class Config:
        orm_mode = True


class ProductApiModel(BaseModel):
    barcode: StrictStr = None
    name: StrictStr = None
    category: StrictStr = None
    country_of_origin: StrictStr = "Japan"
    link: StrictStr = None
    thumbnail: StrictStr = None
    price: int = None
    status: bool = True
    description: StrictStr = None
    remarks: StrictStr = None
