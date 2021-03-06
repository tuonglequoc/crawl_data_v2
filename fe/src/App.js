import React, { useState, useEffect } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const BASE_URL = "http://localhost:8000"
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
    fetch(`${BASE_URL}/products/crawl?url=${productLink}&license=${LICENSE}`)
      .then(response => {
        if (!response.ok) {
          throw Error(`${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => setProduct({ ...product, ...data }))
      .catch(err => alert(err));
  };

  const handleGetProductDataFromDb = () => {
    clearAll()
    fetch(`${BASE_URL}/products/${product.barcode}?license=${LICENSE}`)
      .then(response => {
        if (!response.ok) {
          throw Error(`${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => setProduct(data))
      .catch(err => alert(err));
  }

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
        if (!response.ok) {
          throw Error(`${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(alert("Data is stored to database!"))
      .catch(err => alert(err))
  }

  return (
    <div id="product" className="section">
      <div className="section-center">
        <div className="_container">
          <div className="row">
            <div className="product-form">
              <h1 className="text-center">T??? ?????ng l???y th??ng tin s???n ph???m</h1>
              <div id="getproduct" className="form">
                <div className="form-group">
                  <div className="form-checkbox">
                    <label htmlFor="jancode">
                      Lo???i m?? s???n ph???m
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
                      <span className="form-label">???????ng link s???n ph???m</span>
                      <input className="form-control" type="text" placeholder="???????ng link s???n ph???m" onChange={(e) => handleProductLinkChange(e)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-btn">
                      <button className="submit-btn" onClick={handleGetProductData}>L???y th??ng tin</button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">M?? s???n ph???m(Jancode, TrackingID)</span>
                      <input className="form-control" type="text" placeholder="M?? s???n ph???m" name="barcode" value={product.barcode || ""} onChange={(e) => handleProductChangeInt(e)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-btn">
                      <button className="submit-btn" onClick={handleGetProductDataFromDb}>L???y th??ng tin</button>
                    </div>
                  </div>
                </div>
              </div>
              <div id="productdetail" className="form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">T??n s???n ph???m</span>
                      <input className="form-control" type="text" placeholder="T??n s???n ph???m" value={product.name} name="name" onChange={handleProductChangeStr} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Danh m???c s???n ph???m</span>
                      <input className="form-control" type="text" placeholder="Danh m???c s???n ph???m" value={product.category} name="category" onChange={(e) => handleProductChangeStr(e)} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">???????ng link s???n ph???m</span>
                      <input className="form-control" type="text" placeholder="???????ng link s???n ph???m" value={product.link} name="link" onChange={(e) => handleProductChangeStr(e)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Gi?? s???n ph???m</span>
                      <input className="form-control" type="number" placeholder="Gi?? s???n ph???m" value={product.price} name="price" onChange={(e) => handleProductChangeInt(e)} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Qu???c gia</span>
                      <input className="form-control" type="text" placeholder="Qu???c gia" value={product.country_of_origin} name="country_of_origin" onChange={(e) => handleProductChangeStr(e)} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">M?? t???</span>
                      <textarea className="textarea_control form-control " type="text" placeholder="M?? t???" value={product.description} name="description" onChange={(e) => handleProductChangeStr(e)} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">???????ng link ???nh s???n ph???m</span>
                      {product.thumbnail ? (<img src={product.thumbnail} alt="" width="300" height="300" />) : null}
                      {/* <img src={product.thumbnail} alt="" width="300" height="300" /> */}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Ghi ch??</span>
                      <input className="form-control" type="text" placeholder="Ghi ch??" value={product.remarks} name="remarks" onChange={(e) => handleProductChangeStr(e)} />
                    </div>
                    <div className="form-group">
                      <div className="form-checkbox">
                        <label htmlFor="jancode">
                          D??? li???u ???? ho??n ch???nh
                        </label>
                        <label htmlFor="completed">
                          <input type="radio" id="completed" checked={product.status} name="status" onChange={(e) => handleProductChangeBool(e)} />
                          <span></span>???? ho??n ch???nh
                        </label>
                        <label htmlFor="incompleted">
                          <input type="radio" id="incompleted" onChange={(e) => handleProductChangeBoolInverse(e)} name="status" />
                          <span></span>Ch??a ho??n ch???nh
                        </label>
                      </div>
                    </div>
                    <div className="form-btn">
                      <button className="submit-btn" onClick={handlePostProductData}>Nh???p d??? li???u</button>
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