from typing import List, Optional

from sqlalchemy.orm.session import Session
from api_models import DataSourceModel, HTMLDomApiModel, ProductApiModel
from fastapi import FastAPI
from fastapi.params import Depends, Query
from fastapi.middleware.cors import CORSMiddleware

from starlette.responses import PlainTextResponse

from helpers import (
    crawl_data,
    create_session,
    get_data_from_url,
    get_data_from_url_by_chromedriver,
)
import controllers as ctrl


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
    result = crawl_data(page_content, xpath)
    return result


@app.get("/sources", response_model=List[DataSourceModel])
def get_all_sources(session: Session = Depends(create_session)):
    result = ctrl.get_all_sources(session)
    return result


@app.get("/sources/{source_id}", response_model=DataSourceModel)
def get_all_sources(
    source_id: int = Query(...), session: Session = Depends(create_session)
):
    result = ctrl.get_source(session, source_id)
    return result


@app.get("/sources/{source_id}/dom", response_model=HTMLDomApiModel)
def get_dom(source_id: int = Query(...), session: Session = Depends(create_session)):
    result = ctrl.get_dom(session, source_id)
    return result


@app.get("/products/crawl")
async def crawl_product_data(
    source_id: int = Query(...),
    url: str = Query(...),
    session: Session = Depends(create_session),
):
    # source = ctrl.get_source(source_id)
    dom = ctrl.get_dom(session, source_id)
    product_result = ctrl.crawl_product_data(dom, url)
    return product_result
