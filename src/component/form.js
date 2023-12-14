import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const Form = ({ fetchData, updateData }) => {
  const [newProduct, setNewProduct] = useState({
    title: updateData.title ? updateData.title : "",
    price: updateData.price ? updateData.price : 0,
    size: updateData.size ? updateData.size : "",
    code: updateData.code ? updateData.code : "",
    id:  updateData.id ? updateData.id : "",
  });
  const [file, setFile] = useState(null);
  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setNewProduct({
        title: updateData.title ? updateData.title : "",
        price: updateData.price ? updateData.price : 0,
        size: updateData.size ? updateData.size : "",
        code: updateData.code ? updateData.code : "",
        id:  updateData.id ? updateData.id : "",
    })
  }, [updateData]);
  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("price", newProduct.price);
      formData.append("code", newProduct.code);
      formData.append("size", newProduct.size);
      formData.append("image", file);
      let response;
      if (newProduct.id) {
        formData.append("pId", newProduct.id);
        response = await axios.post(`/api/update`, formData);
      } else {
        response = await axios.post("/api/create", formData);
      }

      if (response.data.success) {
        setNewProduct({ title: "", price: 0, size: "", code: "", id: "" });
        fetchData();
      } else {
        toast.error("Something went wrong")
        console.error("Failed to add product");
      }
    } catch (error) {
      toast.error("Something went wrong")
      console.error("Error adding product:", error);
    }
  };
  return (
    <>
      <h2>Add a Product</h2>
      <Row className="mb-3">
        <Col>
          <label>Title:</label>
          <br />
          <input
            type="text"
            name="title"
            value={newProduct.title}
            onChange={handleInputChange}
          />
        </Col>
        <Col>
          <label>Price:</label>
          <br />
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
          />
        </Col>
        <Col>
          <label>Code:</label>
          <br />
          <input
            type="text"
            name="code"
            value={newProduct.code}
            onChange={handleInputChange}
          />
        </Col>
        <Col>
          <label>Size:</label>
          <br />
          <input
            type="text"
            name="size"
            value={newProduct.size}
            onChange={handleInputChange}
          />
        </Col>
        <Col>
          <label>Image:</label>
          <br />
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
        </Col>
      </Row>
      <Button onClick={handleAddProduct} variant="primary" className="mb-5">
        Submit
      </Button>
    </>
  );
};

export default Form;
