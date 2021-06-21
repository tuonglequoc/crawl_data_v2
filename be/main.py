from typing import List, Optional

from sqlalchemy.orm.session import Session

from fastapi import FastAPI
from fastapi.params import Depends, Path, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

from starlette.responses import PlainTextResponse

import controllers as ctrl
from api_models import (
    DataSourceModel,
    DataSourceModelOut,
    HTMLDomApiModel,
    HTMLDomApiModelOut,
    CrawledProductApiModel,
    ProductApiModel,
    LicenseApiModel,
    LicenseApiModelOut,
)
from models import Product
from helpers import (
    crawl_data,
    create_session,
    get_data_from_url,
    get_data_from_url_by_chromedriver,
)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/test_crawl_data", response_class=PlainTextResponse)
async def crawl_test(
    url: str = Query(...),
    xpath: str = Query(...),
    javascript: Optional[bool] = Query(False),
):
    if javascript:
        page_content = get_data_from_url_by_chromedriver(url)
    else:
        page_content = get_data_from_url(url)
    try:
        result = crawl_data(page_content, xpath)
    except:
        raise HTTPException(status_code=400, detail="Invalid xpath")
    return result


@app.get("/sources", response_model=List[DataSourceModelOut])
def get_all_sources(
    session: Session = Depends(create_session), license: str = Query(...)
):
    if not ctrl.validate_license(session, license):
        raise HTTPException(status_code=403, detail="Invalid license")
    result = ctrl.get_all_sources(session)
    return result


@app.post("/sources", response_model=DataSourceModelOut)
def post_source(
    source: DataSourceModel,
    session: Session = Depends(create_session),
    license: str = Query(...),
):
    if not ctrl.validate_license(session, license):
        raise HTTPException(status_code=403, detail="Invalid license")
    return ctrl.post_source(session, source.dict())


@app.get("/sources/{source_id}", response_model=DataSourceModelOut)
def get_source(
    source_id: int = Query(...),
    session: Session = Depends(create_session),
    license: str = Query(...),
):
    if not ctrl.validate_license(session, license):
        raise HTTPException(status_code=403, detail="Invalid license")
    result = ctrl.get_source(session, source_id)
    return result


@app.get("/sources/{source_id}/dom", response_model=HTMLDomApiModelOut)
def get_dom(
    source_id: int = Path(...),
    session: Session = Depends(create_session),
    license: str = Query(...),
):
    if not ctrl.validate_license(session, license):
        raise HTTPException(status_code=403, detail="Invalid license")
    result = ctrl.get_dom(session, source_id)
    return result


@app.post("/sources/{source_id}/dom", response_model=HTMLDomApiModelOut)
def post_dom(
    source_id: int = Path(...),
    dom: HTMLDomApiModel = ...,
    session: Session = Depends(create_session),
    license: str = Query(...),
):
    if not ctrl.validate_license(session, license):
        raise HTTPException(status_code=403, detail="Invalid license")
    return ctrl.post_dom(session, source_id, dom.dict())


@app.get("/products/crawl", response_model=CrawledProductApiModel)
async def crawl_product_data(
    source_id: int = Query(...),
    url: Optional[str] = Query(None),
    product_id: Optional[str] = Query(None),
    session: Session = Depends(create_session),
    license: str = Query(...),
):
    if not ctrl.validate_license(session, license):
        raise HTTPException(status_code=403, detail="Invalid license")
    if not url and not product_id:
        raise HTTPException(status_code=404, detail="Invalid input")

    dom = ctrl.get_dom(session, source_id)
    if url:
        product_result = ctrl.crawl_product_data(dom, url)
    elif product_id:
        product_link = dom.source.product_link.rstrip("/")
        product_url = f"{product_link}/{product_id}"
        product_result = ctrl.crawl_product_data(dom, product_url)

    return product_result


@app.post("/products", response_model=ProductApiModel)
def post_product(
    product_data: ProductApiModel,
    session: Session = Depends(create_session),
    license: str = Query(...),
):
    if not ctrl.validate_license(session, license):
        raise HTTPException(status_code=403, detail="Invalid license")
    if ctrl.get_product(session, product_data.barcode):
        product = ctrl.update_product(session, product_data.dict())
    else:
        product = ctrl.post_product(session, product_data.dict())
    return product


@app.get("/products", response_model=List[ProductApiModel])
def get_all_products(
    source: int = Query(None),
    session: Session = Depends(create_session),
    license: str = Query(...),
):
    if not ctrl.validate_license(session, license):
        raise HTTPException(status_code=403, detail="Invalid license")
    return ctrl.get_all_products(session, source)


@app.get("/products/{product_id}", response_model=ProductApiModel)
def get_product(
    product_id: int = Path(...),
    session: Session = Depends(create_session),
    license: str = Query(...),
):
    if not ctrl.validate_license(session, license):
        raise HTTPException(status_code=403, detail="Invalid license")
    if product := ctrl.get_product(session, product_id):
        return product

    raise HTTPException(status_code=404, detail=f"Product {product_id} not found")


@app.post("/licenses", response_model=LicenseApiModelOut)
def post_license(license: LicenseApiModel, session: Session = Depends(create_session)):
    return ctrl.post_license(session, license.dict())


@app.get("/licenses", response_model=List[LicenseApiModelOut])
def get_all_licenses(session: Session = Depends(create_session)):
    return ctrl.get_all_licenses(session)
