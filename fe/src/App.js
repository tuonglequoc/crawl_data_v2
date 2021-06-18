import React, { useState } from "react";

function App() {
  const [nguonSP, setNguonSP] = useState("");
  const [maSP, setMaSP] = useState("");
  const [linkSP, setLinkSP] = useState("");
  const [product, setProduct] = useState("")

  useEffect(() => {
    console.log(`Khi load trang thì nó gọi khúc này`);
  }, []);

  const handleNguonSP = (e) => {
    console.log(e.target.value);
    setNguonSP(e.target.value);
  };

  const handleMaSP = (e) => {
    console.log(e.target.value);
    setMaSP(e.target.value);
  };

  const handleLinkSP = (e) => {
    console.log(e.target.value);
    setLinkSP(e.target.value);
  };

  const handleSunmit = () => {
    console.log("Submit");
    fetch(`http://localhost:8000/products/crawl?source_id=${nguonSP}&url=${linkSP}`).then(response => response.json()).then(data => setProduct(data));
  };
  return (
    <div className="App">
      <div>
        <h1>Get product data</h1>
        <select name="nguon-sp" id="nguon-sp" onChange={(e) => handleNguonSP(e)}>
          <option value="1">Nguồn 1</option>
          <option value="2">Nguồn 2</option>
          <option value="3">Nguồn 3</option>
        </select>

        <input
          type="text"
          name="ma-sp"
          id="ma-sp"
          placeholder="Mã SP"
          onChange={(e) => handleMaSP(e)}
        />

        <input
          type="text"
          namke="link-sp"
          id="link-sp"
          placeholder="Link SP"
          onChange={(e) => handleLinkSP(e)}
        />

        <button onClick={handleSunmit}>Send</button>
      </div>
      <div>
        <p>Product name</p>
        <p>{product.name}</p>
      </div>
      <p>Description</p>
      <textarea
        name="description"
        id="desc"
        cols="30"
        rows="10"
        placeholder="Description"
      >{product.description}</textarea>
    </div>
  );
}

export default App;