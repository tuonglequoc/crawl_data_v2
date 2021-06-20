from typing import Any

from sqlalchemy.sql.expression import asc
from helpers import crawl_data, get_data_from_url, get_data_from_url_by_chromedriver
from api_models import HTMLDomApiModel, ProductApiModel
from sqlalchemy.future import select
from sqlalchemy.future.engine import create_engine
from sqlalchemy.orm.session import Session, sessionmaker

from config import config
from models import Product, DataSource, HTMLDom


def get_dom(session: Session, dom_id: int):
    stmt = select(HTMLDom).where(HTMLDom.id == dom_id)
    result = session.execute(stmt)
    return result.scalar_one()


def get_all_sources(session: Session):
    stmt = select(DataSource).order_by(asc(DataSource.id))
    result = session.execute(stmt)
    return result.scalars().all()


def get_source(session: Session, source_id: int):
    stmt = select(DataSource).where(DataSource.id == source_id)
    result = session.execute(stmt)
    return result.scalar_one()


def crawl_product_data(dom: Any, url: str) -> ProductApiModel:
    if dom.source.javascript:
        product_page_content = get_data_from_url_by_chromedriver(url)
    else:
        product_page_content = get_data_from_url(url)

    # Convert thumnail data
    thumbnail = crawl_data(product_page_content, dom.thumbnail)
    if not thumbnail.startswith("http"):
        thumbnail = dom.source.link.rstrip("/") + thumbnail

    # Convert price data to integer
    price = crawl_data(product_page_content, dom.price)
    price = int("".join(char for char in price if char.isdigit()))

    product = ProductApiModel(
        barcode=crawl_data(product_page_content, dom.barcode),
        name=crawl_data(product_page_content, dom.name),
        category=crawl_data(product_page_content, dom.category),
        country_of_origin="Japan",
        link=url,
        thumbnail=thumbnail,
        price=price,
        status=True,
        description=crawl_data(product_page_content, dom.description),
        remarks="Auto crawler",
    )
    return product
