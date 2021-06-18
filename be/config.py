from pydantic import BaseSettings
from pydantic.networks import AnyUrl


class Config(BaseSettings):
    DATABASE_URI: str = (
        "mysql+pymysql://user:password@localhost/product_crawler?charset=utf8mb4"
    )


config = Config()
