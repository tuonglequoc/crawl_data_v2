from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Integer, Boolean, BigInteger, Text

BaseModel = declarative_base()


class DataSource(BaseModel):
    __tablename__ = "source"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(Text)
    link = Column(Text)
    product_link = Column(Text)
    javascript = Column(Boolean, default=False)
    remarks = Column(Text)


class Product(BaseModel):
    __tablename__ = "product"

    barcode = Column(Integer, primary_key=True)
    name = Column(Text)
    category = Column(Text)
    country_of_origin = Column(Text, default="Japan")
    link = Column(Text)
    thumbnail = Column(Text)
    price = Column(Integer)
    status = Column(Boolean, default=True)
    description = Column(Text)
    remarks = Column(Text)
    source_id = Column(Integer, ForeignKey("source.id"))
    source = relationship("DataSource", backref=backref("products", lazy="select"))


class HTMLDom(BaseModel):
    __tablename__ = "dom"

    id = Column(Integer, ForeignKey("source.id"), primary_key=True)
    name = Column(Text)
    category = Column(Text)
    thumbnail = Column(Text)
    price = Column(Text)
    description = Column(Text)
    remarks = Column(Text)
    source = relationship(
        "DataSource", backref=backref("dom", uselist=False, lazy="subquery")
    )


class License(BaseModel):
    __tablename__ = "license"

    id = Column(Integer, primary_key=True, autoincrement=True)
    license_key = Column(Text)
    website = Column(Text)
    remarks = Column(Text)
