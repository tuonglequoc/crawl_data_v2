import json
from typing import Any

import requests

from bs4.element import NavigableString
from bs4 import BeautifulSoup as bs

from lxml import html, etree
from lxml.etree import _ElementUnicodeResult, ElementBase

from requests_html import HTMLSession, AsyncHTMLSession
from selenium import webdriver
from selenium.webdriver import ChromeOptions as Options
from sqlalchemy.future.engine import create_engine
from sqlalchemy.orm.session import sessionmaker

from config import config

options = Options()
options.headless = True


engine = create_engine(config.DATABASE_URI)
session_local = sessionmaker(engine)


def create_session():
    with session_local.begin() as session:
        yield session


def get_data_from_url(url: str, params: dict = None):
    """Fetch data from an enpoint url"""
    params = params or {}
    res = requests.get(url, params=params)
    if res.status_code == 200:
        return res.content
    else:
        raise Exception(f"Request failed. Status: {res.status_code}: {res.text}")


def get_data_from_url_by_chromedriver(url: str):
    driver = webdriver.Chrome("chromedriver", options=options)
    driver.get(url)
    content = driver.page_source
    driver.close()
    return content


def get_bs_data(html_text: str):
    return bs(html_text, "html.parser")


def get_data_from_element(html_element: Any):
    if type(html_element) in (str, _ElementUnicodeResult):
        return str(html_element)
    result_data = []
    if type(html_element) is list:
        for element in html_element:
            result_data.append(get_data_from_element(element))
    else:
        if content := html_element.text:
            result_data.append(content)
        if children := html_element.getchildren():
            for element in children:
                result_data.append(get_data_from_element(element))
    filtered_result = filter(lambda line: line.strip(), result_data)
    return "\n".join(filtered_result)


def crawl_data(content: str, xpath: str):
    if not xpath:
        return None
    html = etree.HTML(content)
    data = html.xpath(xpath)
    rs = get_data_from_element(data)
    return rs
