// pages/index.js
import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "@/component/form";
const myCss = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  gridColumnGap: "20px",
};
const Home = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: 0,
    size: "",
    code: "",
    id: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/read");
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandle = async (id) => {
    try {
      const response = await axios.post("/api/delete", {
        productId: id,
      });
      if (response.data.success) {
        fetchProducts();
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateDataSet = (data) => {
    setNewProduct({
      title: data.title,
      price: data.price,
      size: data.size,
      code: data.code,
      id: data._id,
    });
  };

  return (
    <Container>
      <div>
        <Form fetchData={fetchProducts} updateData={newProduct} />
        <h1>Product List</h1>
        <div style={myCss}>
          {products.map((product) => (
            <Card key={product._id}>
              {product.image && product.image.data ? (
                <Card.Img
                  variant="top"
                  src={Buffer.from(product.image.data.data, "base64").toString(
                    "ascii"
                  )}
                />
              ) : null}
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>
                  ${product.price} <br />
                  {product.size}
                </Card.Text>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="danger"
                    onClick={() => deleteHandle(product._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => updateDataSet(product)}
                  >
                    Update
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Home;
