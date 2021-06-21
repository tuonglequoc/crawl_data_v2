import React, { useState, useEffect } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const BASE_URL = "http://27.75.135.225:8000"
  const LICENSE = "abcd"

  const productDefault = {
    barcode: "",
    code_type: true,
    name: "",
    category: "",
    country_of_origin: "",
    link: "",
    thumbnail: "",
    price: "",
    status: false,
    description: "",
    remarks: "",
  }

  const [sourceId, setSourceId] = useState("");
  const [productLink, setProductLink] = useState("");
  const [product, setProduct] = useState(productDefault)
  const [sources, setSources] = useState([])


  useEffect(() => {
    document.title = "Crawl Product Data"
    fetch(`${BASE_URL}/sources?license=${LICENSE}`)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        if (data.length > 0) {
          setSources(data)
          setSourceId("1")
        }
      })
      .catch(err => alert(err))
  }, []);

  const clearAll = () => {
    setProduct(productDefault)
  }

  const handleSourceIdChange = (e) => {
    setSourceId(e.target.value);
  };

  const handleProductLinkChange = (e) => {
    setProductLink(e.target.value);
  };

  const handleProductChangeStr = (e) => {
    let key = e.target.name
    let value = e.target.value
    let clone = { ...product }
    clone[key] = value
    setProduct(clone);
  };

  const handleProductChangeInt = (e) => {
    let key = e.target.name
    let value = e.target.value
    let clone = { ...product }
    clone[key] = parseInt(value)
    setProduct(clone);
  };

  const handleProductChangeBool = (e) => {
    let key = e.target.name
    let value = e.target.checked
    let clone = { ...product }
    clone[key] = value
    setProduct(clone);
  };

  const handleProductChangeBoolInverse = (e) => {
    let key = e.target.name
    let value = e.target.checked
    let clone = { ...product }
    clone[key] = !value
    setProduct(clone);
  };

  const handleGetProductData = () => {
    clearAll()
    fetch(`${BASE_URL}/products/crawl?source_id=${sourceId}&url=${productLink}&license=${LICENSE}`)
      .then(response => response.json())
      .then(data => setProduct({ ...product, ...data }));
  };

  const handlePostProductData = () => {
    console.log(product)
    product["source_id"] = sourceId
    fetch(`${BASE_URL}/products?license=${LICENSE}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product)
    })
      .then(response => {
        if (response.ok)
          alert("Saved data")
      }).catch(err => alert(err))
  }

  return (
    <div id="product" className="section">
      <div className="section-center">
        <div className="_container">
          <div className="row">
            <div className="product-form">
              <h1 className="text-center">Tự động lấy thông tin sản phẩm</h1>
              <div id="getproduct" className="form">
                <div className="form-group">
                  <div className="form-checkbox">
                    <label htmlFor="jancode">
                      Loại mã sản phẩm
                    </label>
                    <label htmlFor="jancode">
                      <input type="radio" id="jancode" checked={product.code_type} onChange={(e) => handleProductChangeBool(e)} name="code_type" />
                      <span></span>Jancode(Barcode)
                    </label>
                    <label htmlFor="tracking">
                      <input type="radio" id="tracking" onChange={(e) => handleProductChangeBoolInverse(e)} name="code_type" />
                      <span></span>TrackingID
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Nguồn sản phẩm</span>
                      <select className="form-control" onChange={(e) => handleSourceIdChange(e)}>
                        {sources.map((source) => <option key={source.id} value={source.id}>{source.name}</option>)}
                      </select>
                      <span className="select-arrow"></span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Mã sản phẩm(Jancode, TrackingID)</span>
                      <input className="form-control" type="text" placeholder="Mã sản phẩm" name="barcode" value={product.barcode || ""} onChange={(e) => handleProductChangeInt(e)} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Đường link sản phẩm</span>
                      <input className="form-control" type="text" placeholder="Đường link sản phẩm" onChange={(e) => handleProductLinkChange(e)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-btn">
                      <button className="submit-btn" onClick={handleGetProductData}>Lấy thông tin</button>
                    </div>
                  </div>
                </div>
              </div>
              <div id="productdetail" className="form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Tên sản phẩm</span>
                      <input className="form-control" type="text" placeholder="Tên sản phẩm" value={product.name} name="name" onChange={handleProductChangeStr} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Danh mục sản phẩm</span>
                      <input className="form-control" type="text" placeholder="Danh mục sản phẩm" value={product.category} name="category" onChange={(e) => handleProductChangeStr(e)} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Đường link sản phẩm</span>
                      <input className="form-control" type="text" placeholder="Đường link sản phẩm" value={product.link} name="link" onChange={(e) => handleProductChangeStr(e)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Giá sản phẩm</span>
                      <input className="form-control" type="number" placeholder="Giá sản phẩm" value={product.price} name="price" onChange={(e) => handleProductChangeInt(e)} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Quốc gia</span>
                      <input className="form-control" type="text" placeholder="Quốc gia" value={product.country_of_origin} name="country_of_origin" onChange={(e) => handleProductChangeStr(e)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Mô tả</span>
                      <textarea className="textarea_control form-control " type="text" placeholder="Mô tả" value={product.description} name="description" onChange={(e) => handleProductChangeStr(e)} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Đường link ảnh sản phẩm</span>
                      {product.thumbnail ? (<img src={product.thumbnail} alt="" width="300" height="300" />) : null}
                      {/* <img src={product.thumbnail} alt="" width="300" height="300" /> */}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Ghi chú</span>
                      <input className="form-control" type="text" placeholder="Ghi chú" value={product.remarks} name="remarks" onChange={(e) => handleProductChangeStr(e)} />
                    </div>
                    <div className="form-group">
                      <div className="form-checkbox">
                        <label htmlFor="jancode">
                          Dữ liệu đã hoàn chỉnh
                        </label>
                        <label htmlFor="completed">
                          <input type="radio" id="completed" checked={product.status} name="status" onChange={(e) => handleProductChangeBool(e)} />
                          <span></span>Đã hoàn chỉnh
                        </label>
                        <label htmlFor="incompleted">
                          <input type="radio" id="incompleted" onChange={(e) => handleProductChangeBoolInverse(e)} name="status" />
                          <span></span>Chưa hoàn chỉnh
                        </label>
                      </div>
                    </div>
                    <div className="form-btn">
                      <button className="submit-btn" onClick={handlePostProductData}>Nhập dữ liệu</button>
                    </div>
                    <div className="form-btn">
                      <button className="submit-btn" onClick={clearAll}>Clear all</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;