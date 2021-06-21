from pydantic import BaseModel, validator
from pydantic.types import StrictStr


class DataSourceModel(BaseModel):
    name: StrictStr = None
    link: StrictStr = None
    product_link: StrictStr = None
    javascript: bool = None
    remarks: StrictStr = None


class DataSourceModelOut(BaseModel):
    id: int = ...
    name: StrictStr = None
    link: StrictStr = None
    product_link: StrictStr = None
    javascript: bool = None
    remarks: StrictStr = None

    class Config:
        orm_mode = True


class HTMLDomApiModel(BaseModel):
    name: StrictStr = None
    category: StrictStr = None
    thumbnail: StrictStr = None
    price: StrictStr = None
    description: StrictStr = None
    remarks: StrictStr = None


class HTMLDomApiModelOut(BaseModel):
    id: int = ...
    name: StrictStr = None
    category: StrictStr = None
    thumbnail: StrictStr = None
    price: StrictStr = None
    description: StrictStr = None
    remarks: StrictStr = None

    class Config:
        orm_mode = True


class CrawledProductApiModel(BaseModel):
    name: StrictStr = None
    category: StrictStr = None
    country_of_origin: StrictStr = "Japan"
    link: StrictStr = None
    thumbnail: StrictStr = None
    price: int = None
    status: bool = True
    description: StrictStr = None
    remarks: StrictStr = None


class ProductApiModel(BaseModel):
    barcode: int = ...
    code_type: bool = None
    name: StrictStr = None
    category: StrictStr = None
    country_of_origin: StrictStr = "Japan"
    link: StrictStr = None
    thumbnail: StrictStr = None
    price: int = None
    status: bool = True
    description: StrictStr = None
    remarks: StrictStr = None
    source_id: int = ...

    class Config:
        orm_mode = True


class LicenseApiModel(BaseModel):
    license_key: StrictStr = ...
    website: StrictStr = None
    remarks: StrictStr = None


class LicenseApiModelOut(BaseModel):
    id: int
    license_key: StrictStr
    website: StrictStr
    remarks: StrictStr

    class Config:
        orm_mode = True
