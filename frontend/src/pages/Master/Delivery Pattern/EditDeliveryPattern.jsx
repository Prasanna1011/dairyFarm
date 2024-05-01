import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import WarningCard from "components/warningCard/WarningCard";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_DELIVERY_PATTERN_GET_BY_ID,
  API_DELIVERY_PATTERN_UPDATE,
} from "customhooks/All_Api/Apis";

const EditDeliveryPattern = () => {
  const [deliveryPatternData, setDeliveryPatternData] = useState({
    delivery_pattern: "",
  });
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const { config } = GetAuthToken();

  const getUomData = async (id) => {
    try {
      const { data } = await axios.get(`${API_DELIVERY_PATTERN_GET_BY_ID}${id}`, config);
      setDeliveryPatternData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdatedeliveryPatternData = async (e) => {
    e.preventDefault();

    // Validate form fields
    const validationErrors = {};
    if (!deliveryPatternData.delivery_pattern.trim()) {
      validationErrors.delivery_pattern = "Delivery Pattern is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(`${API_DELIVERY_PATTERN_UPDATE}${id}/`, deliveryPatternData, config);
      toast.success(`Delivery Pattern updated successfully`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      navigate(`/master-delivery-pattern`);
    } catch (error) {
      console.error(error);
    
      toast.error(error.response.data.message,"Something Went Wrong", {  
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    getUomData(id);
  }, [id]);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Edit Delivery Pattern</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <div className="col-md-12">
              <div className="container">
                <div className="row">
                  <div className="col-sm-6 offset-sm-3">
                    <div className="card" style={{ height: "250px" }}>
                      <div className="card-body ">
                        <div className="mt-4">
                          <label htmlFor="city" className="form-label">
                            Delivery Pattern *
                          </label>
                          <input
                            autoComplete="off"
                            type="text"
                            className="form-control"
                            id="unit_name"
                            placeholder="Enter Delivery Pattern"
                            value={deliveryPatternData?.delivery_pattern}
                            onChange={(e) => {
                              setDeliveryPatternData({
                                ...deliveryPatternData,
                                delivery_pattern: e.target.value,
                              });
                              setErrors({ ...errors, delivery_pattern: "" });
                            }}
                          />
                          {errors.delivery_pattern && (
                            <span className="text-danger">{errors.delivery_pattern}</span>
                          )}
                        </div>

                        <div className="text-center  mt-3 ">
                          <button
                            type="button"
                            onClick={handleUpdatedeliveryPatternData}
                            className="btn btn-primary px-4 mt-3"
                          >
                            Update
                          </button>
                          <Link to={`/master-delivery-pattern`}>
                            <Button className="px-4 mt-3 ms-2" color="danger">
                              Cancel
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default EditDeliveryPattern;
