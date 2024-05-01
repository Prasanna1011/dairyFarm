import React, { useState } from "react";

import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  CardTitle,
  CardSubtitle,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  API_CITY_GE,
  API_CITY_GET_POST,
  API_CUSTOMER_GROUP_GET_POST,
  API_CWH_GET_POST,
  API_DEPARTMENT_TYPE_GET_POST,
  API_FARM_GET_POST,
  API_OFFERS_POST_GET,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";

const CreateOffers = () => {
  const [customerGroup, setCustomerGroup] = useState([]);
  const [farmData, setFarmData] = useState([]);
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  const navigate = useNavigate();

  const orderType = [
    { id: "Cart Order", name: "Cart Order" },
    { id: "Subscription Order", name: "Subscription Order" },
    { id: "Trial Orders", name: "Trial Orders" },
  ];

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      customer_group: "",
      order_type: "",
      validity_from: "",
      validity_to: "",
      coupon_code: "",
      usage_limit: "",
      min_order_amount: "",
      discount_rate: "",
    },
    validationSchema: Yup.object({
      customer_group: Yup.string().required("Please select customer group"),
      order_type: Yup.string().required("Please  select order type"),
      validity_from: Yup.date().required("Validity from is required"),
      validity_to: Yup.date().required("Validity to  is required"),
      coupon_code: Yup.string().required("Please Enter coupon code "),
      usage_limit: Yup.string().required("Please  Enter usage limit"),
      min_order_amount: Yup.string().required(
        "Please  Enter minimum order amount"
      ),
      discount_rate: Yup.string().required("Please  Enter Discount Rate"),
    }),
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        const { data } = await axios.post(API_OFFERS_POST_GET, values, config);
        toast.success(`Offer  added successfully`, {
          position: "top-center",
          autoClose: 4000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/offers");
      } catch (error) {
        console.log(error);
        toast.error(error, {
          position: "top-center",
          autoClose: 4000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });

  // function for get Department type data start
  const getCustomerGroup = async () => {
    const { data } = await axios.get(API_CUSTOMER_GROUP_GET_POST, config);
    console.log(data.data);
    setCustomerGroup(data.data);
  };
  // function for get Department type data starEnd

  // function for get City  for dropdown data End

  // get farm data for dropdown start
  const getFarmData = async () => {
    const { data } = await axios.get(API_FARM_GET_POST, config);
    setFarmData(data.data);
    // console.log(data);
    console.log(farmData);
  };
  // get farm data for dropdown End

  useEffect(() => {
    getCustomerGroup();
    getFarmData();
  }, []);
  return (
    <>
      <div className="page-content">
        <Container
          className="d-flex flex-column justify-content-center"
          fluid={true}
        >
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Create Offers</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Col xl="12">
            <Card>
              <CardBody>
                <Form
                  className="needs-validation"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                  }}
                >
                  <Row>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="customer_group">Customer Group</Label>
                        <Input
                          name="customer_group"
                          placeholder="Select Customer Group"
                          type="select"
                          className="form-control"
                          id="roles"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.customer_group || ""}
                          invalid={
                            validation.touched.customer_group &&
                            validation.errors.customer_group
                          }
                        >
                          {/* Placeholder option */}
                          <option value="">Choose Customer Group</option>

                          {/* Add a return statement in the mapping function */}
                          {customerGroup.map((item) => (
                            <option key={item.id} value={item.id}>
                              <b>{item.customer_group_name}</b>
                            </option>
                          ))}
                        </Input>
                        {validation.touched.customer_group &&
                        validation.errors.customer_group ? (
                          <FormFeedback type="invalid">
                            {validation.errors.customer_group}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="order_type">Select Order Type</Label>
                        <Input
                          name="order_type"
                          placeholder="Select Order Type"
                          type="select"
                          className="form-control"
                          id="order_type"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.order_type || ""}
                          invalid={
                            validation.touched.order_type &&
                            validation.errors.order_type
                          }
                        >
                          {/* Placeholder option */}
                          <option value="">Order Type</option>

                          {/* Add a return statement in the mapping function */}
                          {orderType.map((item) => (
                            <option key={item.id} value={item.id}>
                              <b>{item.name}</b>
                            </option>
                          ))}
                        </Input>
                        {validation.touched.order_type &&
                        validation.errors.order_type ? (
                          <FormFeedback type="invalid">
                            {validation.errors.order_type}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className=" d-flex  align-items-center">
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="min_order_amount">
                          Min. Order Amount
                        </Label>
                        <Input
                          name="min_order_amount"
                          placeholder="Minimum order amount"
                          type="number"
                          className="form-control"
                          id="min_order_amount"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.min_order_amount || ""}
                          invalid={
                            validation.touched.min_order_amount &&
                            validation.errors.min_order_amount
                              ? true
                              : false
                          }
                        />
                        {validation.touched.min_order_amount &&
                        validation.errors.min_order_amount ? (
                          <FormFeedback type="invalid">
                            {validation.errors.min_order_amount}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="discount_rate">
                          Discount Rate in %{" "}
                        </Label>
                        <Input
                          name="discount_rate"
                          placeholder="Discount rate"
                          type="number"
                          className="form-control"
                          id="discount_rate"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.discount_rate || ""}
                          invalid={
                            validation.touched.discount_rate &&
                            validation.errors.discount_rate
                              ? true
                              : false
                          }
                        />
                        {validation.touched.discount_rate &&
                        validation.errors.discount_rate ? (
                          <FormFeedback type="invalid">
                            {validation.errors.discount_rate}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label htmlFor="validity_from" className="form-label">
                          Validity To
                        </label>
                        <Flatpickr
                          id="validity_from"
                          name="validity_from"
                          placeholder="dd-mm-yyyy"
                          className={`form-control ${
                            validation.touched.validity_from &&
                            validation.errors.validity_from
                              ? "is-invalid"
                              : ""
                          }`}
                          value={validation.values.validity_from}
                          onChange={(date) => {
                            const formattedDate = format(date[0], "yyyy-MM-dd"); // Format the date
                            validation.setFieldValue(
                              "validity_from",
                              formattedDate
                            );
                          }}
                          options={{
                            dateFormat: "Y-m-d",
                          }}
                        />
                        {validation.touched.validity_from &&
                          validation.errors.validity_from && (
                            <div className="invalid-feedback">
                              {validation.errors.validity_from}
                            </div>
                          )}
                      </div>
                    </Col>

                    <Col md="6">
                      <div className="mb-3">
                        <label htmlFor="validity_to" className="form-label">
                          Validity To
                        </label>
                        <Flatpickr
                          id="validity_to"
                          name="validity_to"
                          placeholder="dd-mm-yyyy"
                          className={`form-control ${
                            validation.touched.validity_to &&
                            validation.errors.validity_to
                              ? "is-invalid"
                              : ""
                          }`}
                          value={validation.values.validity_to}
                          onChange={(date) => {
                            const formattedDate = format(date[0], "yyyy-MM-dd"); // Format the date
                            validation.setFieldValue(
                              "validity_to",
                              formattedDate
                            );
                          }}
                          options={{
                            dateFormat: "Y-m-d",
                          }}
                        />
                        {validation.touched.validity_to &&
                          validation.errors.validity_to && (
                            <div className="invalid-feedback">
                              {validation.errors.validity_to}
                            </div>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <Row className=" d-flex  align-items-center">
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="coupon_code">Coupan Code</Label>
                        <Input
                          name="coupon_code"
                          placeholder="Coupan Code"
                          type="text"
                          className="form-control"
                          id="coupon_code"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.coupon_code || ""}
                          invalid={
                            validation.touched.coupon_code &&
                            validation.errors.coupon_code
                              ? true
                              : false
                          }
                        />
                        {validation.touched.coupon_code &&
                        validation.errors.coupon_code ? (
                          <FormFeedback type="invalid">
                            {validation.errors.coupon_code}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="usage_limit">Usage Limit</Label>
                        <Input
                          name="usage_limit"
                          placeholder="Usage Limit"
                          type="number"
                          className="form-control"
                          id="usage_limit"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.usage_limit || ""}
                          invalid={
                            validation.touched.usage_limit &&
                            validation.errors.usage_limit
                              ? true
                              : false
                          }
                        />
                        {validation.touched.usage_limit &&
                        validation.errors.usage_limit ? (
                          <FormFeedback type="invalid">
                            {validation.errors.usage_limit}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button className="mt-3" color="primary " type="submit">
                    Submit form
                  </Button>
                  <Link to={"/cwh-home"}>
                    <Button className="mt-3" color="danger ms-3 px-4">
                      Cancel
                    </Button>
                  </Link>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Container>
      </div>
    </>
  );
};

export default CreateOffers;
