import {
  API_BASE_URL,
  API_PRODUCT_VIEW_BY_ID_AND_UPDATE,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Badge,
} from "reactstrap";
import axios from "axios";

const ProductView = () => {
  const [productDataById, setProductDataById] = useState({});
  const { id } = useParams();
  const { config } = GetAuthToken();

  const getProductsById = async () => {
    try {
      const { data } = await axios.get(
        `${API_PRODUCT_VIEW_BY_ID_AND_UPDATE}${id}/`,
        config
      );
      setProductDataById(data.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    getProductsById();
  }, []);

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Product Details</h3>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <Row className="mb-3">
                  <Col md={2} className="text-center">
                    <img
                      src={`${API_BASE_URL}${productDataById.profile_picture}`}
                      alt=""
                      className="rounded-circle img-fluid avatar-lg"
                    />
                  </Col>
                  <Col md={10} className="d-flex align-items-center">
                    <h4 className="mb-0">{productDataById.product_name}</h4>
                  </Col>
                </Row>
                <hr />
                <Row className="mb-3">
                  <Col md={4}>
                    <h6 className="mb-0">Product Category:</h6>
                    <p>{productDataById.product_category}</p>
                  </Col>
                  <Col md={4}>
                    <h6 className="mb-0">Product Rate:</h6>
                    <p>{productDataById.product_rate}</p>
                  </Col>
                  <Col md={4}>
                    <h6 className="mb-0">Product Expiry:</h6>
                    <p>{productDataById.expiry_days}</p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <h6 className="mb-0">HSN Code:</h6>
                    <p>{productDataById.hsn_code}</p>
                  </Col>
                  <Col md={4}>
                    <h6 className="mb-0">Tax Rate:</h6>
                    <p>{productDataById.tax_rate}</p>
                  </Col>
                  <Col md={4}>
                    <h6 className="mb-0">Product UOM:</h6>
                    <p>{productDataById.product_uom}</p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <h6 className="mb-0">Product Type:</h6>
                    <p>{productDataById.product_type}</p>
                  </Col>
                  <Col md={4}>
                    <h6 className="mb-0">Product Classification:</h6>
                    <p>{productDataById.product_classification}</p>
                  </Col>
                  <Col md={4}>
                    <h6 className="mb-0">Tax Rate:</h6>
                    <p>{productDataById.tax_rate}</p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={12}>
                    <h6 className="mb-0">Description:</h6>
                    <p>{productDataById.description}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="text-end">
                    <Link to={`/products-edit/${productDataById.id}`}>
                      <Button color="warning">Edit</Button>
                    </Link>
                    <Link to="/products" className="ms-2">
                      <Button color="primary">Back</Button>
                    </Link>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductView;
