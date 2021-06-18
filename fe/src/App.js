import React, { useState, useEffect } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const baseUrl = "http://localhost:8000"
  const productDefault = {
    barcode: "",
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
  const [productId, setProductId] = useState("");
  const [productLink, setProductLink] = useState("");
  const [product, setProduct] = useState(productDefault)
  const [sources, setSources] = useState([])

  useEffect(() => {
    document.title = "Crawl Product Data"
    fetch(`${baseUrl}/sources`).then(response => response.json()).then(data => setSources(data));
    setSourceId("1")
  }, []);

  const handleSourceIdChange = (e) => {
    setSourceId(e.target.value);
  };

  const handleProductIdChange = (e) => {
    setProductId(e.target.value);
  };

  const handleProductLinkChange = (e) => {
    setProductLink(e.target.value);
  };

  const handleSunmit = () => {
    setProduct(productDefault)
    fetch(`http://localhost:8000/products/crawl?source_id=${sourceId}&url=${productLink}&product_id=${productId}`)
      .then(response => response.json())
      .then(data => setProduct(data));
  };
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
                      <input type="radio" id="jancode" checked name="bar-code-type" />
                      <span></span>Jancode(Barcode)
                    </label>
                    <label htmlFor="tracking">
                      <input type="radio" id="tracking" name="bar-code-type" />
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
                      <input className="form-control" type="text" placeholder="Mã sản phẩm" onChange={(e) => handleProductIdChange(e)} />
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
                      <button className="submit-btn" onClick={handleSunmit}>Lấy thông tin</button>
                    </div>
                  </div>
                </div>
              </div>
              <div id="productdetail" className="form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Tên sản phẩm</span>
                      <input className="form-control" type="text" placeholder="Tên sản phẩm" value={product.name} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Danh mục sản phẩm</span>
                      <input className="form-control" type="text" placeholder="Danh mục sản phẩm" value={product.category} readOnly />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Đường link sản phẩm</span>
                      <input className="form-control" type="text" placeholder="Đường link sản phẩm" value={product.link} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Giá sản phẩm</span>
                      <input className="form-control" type="text" placeholder="Giá sản phẩm" value={product.price} readOnly />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Quốc gia</span>
                      <input className="form-control" type="text" placeholder="Quốc gia" value={product.country_of_origin} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Mô tả</span>
                      <textarea className="textarea_control form-control " type="text" placeholder="Mô tả" value={product.description} readOnly />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Đường link ảnh sản phẩm</span>
                      <img src={product.thumbnail} alt="" width="300" height="300" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Ghi chú</span>
                      <input className="form-control" type="text" placeholder="Ghi chú" value={product.remarks} readOnly />
                    </div>
                    <div className="form-group">
                      <div className="form-checkbox">
                        <label htmlFor="jancode">
                          Dữ liệu đã hoàn chỉnh
                        </label>
                        <label htmlFor="completed">
                          <input type="checkbox" id="completed" checked={product.status} name="completed" readOnly />
                          <span></span>Đã hoàn chỉnh
                        </label>
                        {/* <label htmlFor="incompleted">
                          <input type="radio" id="incompleted" name="completed" />
                          <span></span>Chưa hoàn chỉnh
                        </label> */}
                      </div>
                    </div>
                    <div className="form-btn">
                      <button className="submit-btn">Nhập dữ liệu</button>
                    </div>
                    <div className="form-btn">
                      <button className="submit-btn">Clear all</button>
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