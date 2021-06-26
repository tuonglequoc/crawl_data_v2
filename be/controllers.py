from typing import Any

from sqlalchemy.sql.expression import asc, insert, update
from helpers import crawl_data, get_data_from_url, get_data_from_url_by_chromedriver
from api_models import HTMLDomApiModel, CrawledProductApiModel
from sqlalchemy.future import select
from sqlalchemy.future.engine import create_engine
from sqlalchemy.orm.session import Session, sessionmaker

from config import config
from models import Product, DataSource, HTMLDom, License


def get_dom(session: Session, dom_id: int = None):
    stmt = select(HTMLDom)
    if dom_id:
        stmt = stmt.where(HTMLDom.id == dom_id)
    result = session.execute(stmt)
    return result.scalars().all()


def post_dom(session: Session, source_id: int, dom: dict):
    dom = HTMLDom(**dom, id=source_id)
    session.add(dom)
    session.flush()
    return dom


def get_all_sources(session: Session):
    stmt = select(DataSource).order_by(asc(DataSource.id))
    result = session.execute(stmt)
    return result.scalars().all()


def get_source(session: Session, source_id: int):
    stmt = select(DataSource).where(DataSource.id == source_id)
    result = session.execute(stmt)
    return result.scalar_one()


def post_source(session: Session, source: dict):
    source = DataSource(**source)
    session.add(source)
    session.flush()
    return source


def crawl_product_data(dom: Any, url: str) -> CrawledProductApiModel:
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

    product = CrawledProductApiModel(
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


def get_all_products(session: Session, source_id: int = None):
    stmt = select(Product)
    if source_id:
        stmt = stmt.where(Product.source_id == source_id)
    result = session.execute(stmt)
    return result.scalars().all()


def get_product(session: Session, barcode: int = ...):
    stmt = select(Product).where(Product.barcode == barcode)
    result = session.execute(stmt)
    return result.scalars().first()


def post_product(session: Session, product: dict):
    product = Product(**product)
    session.add(product)
    session.flush()
    return product


def update_product(session: Session, product: dict):
    stmt = (
        update(Product).where(Product.barcode == product["barcode"]).values(**product)
    )
    session.execute(stmt)
    return product


def get_product(session: Session, product_id: int):
    stmt = select(Product).where(Product.barcode == product_id)
    result = session.execute(stmt)
    return result.scalars().first()


def validate_license(session: Session, license: str):
    if not license:
        return None

    stmt = select(License).where(License.license_key == license)
    result = session.execute(stmt)
    return result.scalars().first()


def post_license(session: Session, license: dict):
    license = License(**license)
    session.add(license)
    session.flush()
    return license


def get_all_licenses(session: Session):
    stmt = select(License)
    result = session.execute(stmt)
    return result.scalars().all()
