import React, { usecontact_no, useRef, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
  Table,
  NavItem,
  TabContent,
  TabPane,
} from "reactstrap";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { format } from "date-fns";
import axios from "axios";
import {
  API_AREA_GET_POST,
  API_CITY_GE,
  API_CITY_GET_POST,
  API_CUSTOMERS_CREATE,
  API_CUSTOMERS_REGISTER,
  API_CUSTOMERS_REGISTER_GET_POST,
  API_CUSTOMER_GROUP_GET_POST,
  API_CUSTOMER_REGISTER_POST,
  API_CUSTOMER_REGISTER_POST_GET,
  API_PINCODE_GET_POST,
  API_CUSTOMER_REGISTER,
} from "customhooks/All_Api/Apis";
import { toast } from "react-toastify";
const AddCustomers = () => {
  const [customerGroup, setCustomerGroup] = useState([]);
  const [city, setCity] = useState([]);
  const [pincodeAllData, setPincodeAllData] = useState([]);
  const [AllData, setAreaAllData] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedPincode, setSelectedPincode] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");

  const titles = [
    { value: "Mr", label: "Mr." },
    { value: "Mrs", label: "Mrs." },
    { value: "Miss", label: "Miss." },
  ];
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  const navigate = useNavigate();

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: "",
      first_name: "",
      last_name: "",
      email: "",
      contact_no: "",
      birth_date: "",
      anniversary_date: "",
      // password: "",
      // confirm_password: "",
      child: "0",
      adult: "0",
      senior_citizen: "0",
      registered_on: "",
      customer_group_id: "",
      city_id: "",
      pincode: "",
      area: "",
      house_no: "",
      society: "",
      landmark: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      first_name: Yup.string().required("Please Enter Your First Name"),
      last_name: Yup.string().required("Please Enter Your Last Name"),
      email: Yup.string().email("Invalid email address"),

      contact_no: Yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits")
        .required("Contact number is required"),
      birth_date: Yup.date()
        .max(new Date(), "Birth date cannot be a future date")
        .min(new Date("1800-01-01"), "Please enter a valid birth date"),
      // .required("Birth date is required"),
      anniversary_date: Yup.date().max(
        new Date(),
        "Anniversary date cannot be a future date"
      ),
      // password: Yup.string()
      //   .required("Please confirm your password")

      //   .min(6, "Password must be min 6 characters long")
      //   .max(16, "Password must be max 16 characters long")
      //   .matches(/[0-9]/, "Password requires a number")
      //   .matches(/[a-z]/, "Password requires a lowercase letter")
      //   .matches(/[A-Z]/, "Password requires an uppercase letter")
      //   .matches(/[^\w]/, "Password requires a symbol"),

      // confirm_password: Yup.string()
      //   .required("Please confirm your password")
      //   .min(6, "Password must be min 6 characters long")
      //   .max(16, "Password must be max 16 characters long")
      //   .matches(/[0-9]/, "Password requires a number")
      //   .matches(/[a-z]/, "Password requires a lowercase letter")
      //   .matches(/[A-Z]/, "Password requires an uppercase letter")
      //   .matches(/[^\w]/, "Password requires a symbol")
      //   .oneOf([Yup.ref("password")], "Passwords do not match")
      //   .required("Please Confirm Password"),
      child: Yup.number()
        .integer()
        .min(0, "Child must be a non-negative number")
        .required("Child is required"),
      adult: Yup.number()
        .integer()
        .min(0, "Adult must be a non-negative number")
        .required("adult is required"),
      senior_citizen: Yup.number()
        .integer()
        .min(0, "Senior Citizen must be a non-negative number")
        .required("Senior Citizen is required"),
      registered_on: Yup.date(),

      customer_group_id: Yup.string().required("Select Customer Group"),
      city_id: Yup.string().required(" City is required"),
      pincode: Yup.string().required(" Pincode is required"),
      area: Yup.string().required(" Area/Location is required"),
      house_no: Yup.string().required("Flat/House No. is required"),
      society: Yup.string().required("Building/Society is required"),
      landmark: Yup.string().required("Landmark is required"),
    }),

    onSubmit: async (values) => {
      console.table(values);
      try {
        const { data } = await axios.post(
          API_CUSTOMERS_REGISTER,
          values,
          config
        );

        toast.success(`Customer Added successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/customer-list");
      } catch (error) {
        console.error(error);

        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });
  // Customer Group Data Fetch Start

  const customerGroupData = async () => {
    const { data } = await axios.get(API_CUSTOMER_GROUP_GET_POST, config);
    setCustomerGroup(data.data);
  };
  // Customer Group Data Fetch End

  // City Start

  const cityData = async () => {
    const { data } = await axios.get(API_CITY_GE, config);
    setCity(data.data);
  };
  // City End

  // Pincode Start

  const pincodeData = async () => {
    const { data } = await axios.get(API_PINCODE_GET_POST, config);
    setPincodeAllData(data.data);
  };
  // Pincode End

  // Area Start

  const areaData = async () => {
    const { data } = await axios.get(API_AREA_GET_POST, config);
    setAreaAllData(data.data);
  };
  // Area End

  // const handleCityChange = (e) => {
  //   const selectedCityValue = e.target.value;
  //   setSelectedCity(selectedCityValue);
  //   validation.handleChange(e); // Let Formik handle the change event
  // };
  useEffect(() => {
    customerGroupData();
    cityData();
    pincodeData();
    areaData();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Create Customers</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
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
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label>Title</Label>
                          <Input
                            name="title"
                            placeholder="Enter Title"
                            type="select"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.title || ""}
                            invalid={
                              validation.touched.title &&
                              validation.errors.title
                                ? true
                                : false
                            }
                          >
                            <option value="">Select a title</option>
                            {titles.map((title) => (
                              <option key={title.value} value={title.value}>
                                {title.label}
                              </option>
                            ))}
                          </Input>
                          {validation.touched.title &&
                          validation.errors.title ? (
                            <FormFeedback type="invalid">
                              {validation.errors.title}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="first_name">First name</Label>
                          <Input
                            name="first_name"
                            placeholder="First name"
                            type="text"
                            className="form-control"
                            id="first_name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.first_name || ""}
                            invalid={
                              validation.touched.first_name &&
                              validation.errors.first_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.first_name &&
                          validation.errors.first_name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.first_name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="last_name">Last name</Label>
                          <Input
                            name="last_name"
                            placeholder="Last name"
                            type="text"
                            className="form-control"
                            id="last_name"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.last_name || ""}
                            invalid={
                              validation.touched.last_name &&
                              validation.errors.last_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.last_name &&
                          validation.errors.last_name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.last_name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            name="email"
                            placeholder="email"
                            type="text"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="contact_no">Contact</Label>
                          <Input
                            name="contact_no"
                            placeholder="Enter Contact No."
                            type="number"
                            className="form-control"
                            id="contact_no"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.contact_no || ""}
                            invalid={
                              validation.touched.contact_no &&
                              validation.errors.contact_no
                                ? true
                                : false
                            }
                          />
                          {validation.touched.contact_no &&
                          validation.errors.contact_no ? (
                            <FormFeedback type="invalid">
                              {validation.errors.contact_no}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <div className="mb-3">
                          <label htmlFor="birth_date" className="form-label">
                            Birth Date
                          </label>
                          <Flatpickr
                            id="birth_date"
                            name="birth_date"
                            placeholder="yyyy-mm-dd"
                            className={`form-control ${
                              validation.touched.birth_date &&
                              validation.errors.birth_date
                                ? "is-invalid"
                                : ""
                            }`}
                            value={validation.values.birth_date}
                            onChange={(date) => {
                              const formattedDate = format(
                                date[0],
                                "yyyy-MM-dd"
                              ); // Format the date
                              validation.setFieldValue(
                                "birth_date",
                                formattedDate
                              );
                            }}
                            options={{
                              dateFormat: "Y-m-d",
                            }}
                          />
                          {validation.touched.birth_date &&
                            validation.errors.birth_date && (
                              <div className="invalid-feedback">
                                {validation.errors.birth_date}
                              </div>
                            )}
                        </div>
                      </Col>

                      <Col md="6">
                        <div className="mb-3">
                          <label
                            htmlFor="anniversary_date"
                            className="form-label"
                          >
                            Anniversary Date
                          </label>
                          <Flatpickr
                            id="anniversary_date"
                            name="anniversary_date"
                            placeholder="yyyy-mm-dd"
                            className={`form-control ${
                              validation.touched.anniversary_date &&
                              validation.errors.anniversary_date
                                ? "is-invalid"
                                : ""
                            }`}
                            value={validation.values.anniversary_date}
                            onChange={(date) => {
                              const formattedDate = format(
                                date[0],
                                "yyyy-MM-dd"
                              ); // Format the date
                              validation.setFieldValue(
                                "anniversary_date",
                                formattedDate
                              );
                            }}
                            options={{
                              dateFormat: "Y-m-d",
                            }}
                          />
                          {validation.touched.anniversary_date &&
                            validation.errors.anniversary_date && (
                              <div className="invalid-feedback">
                                {validation.errors.anniversary_date}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {/* <Col md="6  ">
                        <FormGroup className="mb-3">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            name="password"
                            placeholder="Enter Password"
                            type="text"
                            className="form-control"
                            id="password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col> */}
                      {/* <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="confirm_password">
                            Confirm Password
                          </Label>
                          <Input
                            name="confirm_password"
                            placeholder=" Confirm Password"
                            type="text"
                            className="form-control"
                            id="confirm_password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.confirm_password || ""}
                            invalid={
                              validation.touched.confirm_password &&
                              validation.errors.confirm_password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.confirm_password &&
                          validation.errors.confirm_password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.confirm_password}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col> */}
                    </Row>
                    <Row>
                      <h6 className="py-3">Family Members :</h6>
                    </Row>
                    <Row>
                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label htmlFor="child">Child</Label>
                          <Input
                            name="child"
                            placeholder="Childs"
                            type="number"
                            className="form-control"
                            id="child"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={
                              validation.values.child === 0
                                ? "0"
                                : validation.values.child || ""
                            }
                            invalid={
                              validation.touched.child &&
                              !!validation.errors.child
                            }
                          />
                          {validation.touched.child &&
                            validation.errors.child && (
                              <FormFeedback type="invalid">
                                {validation.errors.child}
                              </FormFeedback>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label htmlFor="adult">Adult</Label>
                          <Input
                            name="adult"
                            placeholder="Adults"
                            type="number"
                            className="form-control"
                            id="adult"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={
                              validation.values.adult === 0
                                ? "0"
                                : validation.values.adult || ""
                            }
                            invalid={
                              validation.touched.adult &&
                              !!validation.errors.adult
                            }
                          />
                          {validation.touched.adult &&
                            validation.errors.adult && (
                              <FormFeedback type="invalid">
                                {validation.errors.adult}
                              </FormFeedback>
                            )}
                        </FormGroup>
                      </Col>
                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label htmlFor="senior_citizen">Senior Citizen</Label>
                          <Input
                            name="senior_citizen"
                            placeholder="Senior Citizens"
                            type="number"
                            className="form-control"
                            id="senior_citizen"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={
                              validation.values.senior_citizen === 0
                                ? "0"
                                : validation.values.senior_citizen || ""
                            }
                            invalid={
                              validation.touched.senior_citizen &&
                              !!validation.errors.senior_citizen
                            }
                          />
                          {validation.touched.senior_citizen &&
                            validation.errors.senior_citizen && (
                              <FormFeedback type="invalid">
                                {validation.errors.senior_citizen}
                              </FormFeedback>
                            )}
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <div className="mb-3">
                          <label htmlFor="registered_on" className="form-label">
                            Registered On
                          </label>
                          <Flatpickr
                            id="registered_on"
                            name="registered_on"
                            placeholder="yyyy-mm-dd"
                            className={`form-control ${
                              validation.touched.registered_on &&
                              validation.errors.registered_on
                                ? "is-invalid"
                                : ""
                            }`}
                            value={validation.values.registered_on}
                            onChange={(date) => {
                              const formattedDate = format(
                                date[0],
                                "yyyy-MM-dd"
                              ); // Format the date
                              validation.setFieldValue(
                                "registered_on",
                                formattedDate
                              );
                            }}
                            options={{
                              dateFormat: "Y-m-d",
                            }}
                          />
                          {validation.touched.registered_on &&
                            validation.errors.registered_on && (
                              <div className="invalid-feedback">
                                {validation.errors.registered_on}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {/* <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="grace_limit"> Grace Limit</Label>
                          <Input
                            name="grace_limit"
                            placeholder="Registered On "
                            type="number"
                            className="form-control"
                            id="grace_limit"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.grace_limit || ""}
                            invalid={
                              validation.touched.grace_limit &&
                              validation.errors.grace_limit
                                ? true
                                : false
                            }
                          />
                          {validation.touched.grace_limit &&
                          validation.errors.grace_limit ? (
                            <FormFeedback type="invalid">
                              {validation.errors.grace_limit}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col> */}
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="customer_group_id">
                            Customer Group
                          </Label>
                          <Input
                            name="customer_group_id"
                            placeholder="customer_group Code"
                            type="select"
                            className="form-control"
                            id="customer_group_id"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.customer_group_id || ""}
                            invalid={
                              validation.touched.customer_group_id &&
                              validation.errors.customer_group_id
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Job Type </option>
                            {customerGroup.map((item) => (
                              <option key={item.id} value={item.id}>
                                <b>{item.customer_group_name}</b>
                              </option>
                            ))}
                          </Input>
                          {validation.touched.customer_group_id &&
                          validation.errors.customer_group_id ? (
                            <FormFeedback type="invalid">
                              {validation.errors.customer_group_id}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <h6 className="py-3">Add Address :</h6>
                    </Row>

                    <Row>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="city_id">City</Label>
                          <Input
                            name="city_id"
                            placeholder="Select City"
                            type="select"
                            className="form-control"
                            id="city_id"
                            onChange={(e) => {
                              const selectedCityValue = e.target.value;
                              setSelectedCity(selectedCityValue);
                              validation.handleChange(e); // Let Formik handle the change event
                            }}
                            onBlur={validation.handleBlur}
                            value={validation.values.city_id}
                            invalid={
                              validation.touched.city_id &&
                              validation.errors.city_id
                                ? true
                                : false
                            }
                          >
                            <option value="">Select City</option>
                            {city.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.city}
                              </option>
                            ))}
                          </Input>
                          {validation.touched.city_id &&
                          validation.errors.city_id ? (
                            <FormFeedback type="invalid">
                              {validation.errors.city_id}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="pincode">Pincode</Label>
                          <Input
                            name="pincode"
                            placeholder="Select pincode"
                            type="select"
                            className="form-control"
                            id="pincode"
                            onBlur={validation.handleBlur}
                            value={validation.values.pincode || ""}
                            onChange={(e) => {
                              const selectedPincodeValue = e.target.value;
                              setSelectedPincode(selectedPincodeValue);
                              validation.handleChange(e);
                            }}
                            invalid={
                              validation.touched.pincode &&
                              validation.errors.pincode
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Pincode</option>

                            {pincodeAllData
                              .find((items) => items.id == selectedCity)
                              ?.pincodes.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.code}
                                </option>
                              ))}
                          </Input>
                          {validation.touched.pincode &&
                          validation.errors.pincode ? (
                            <FormFeedback type="invalid">
                              {validation.errors.pincode}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="area">Area</Label>
                          <Input
                            name="area"
                            placeholder="Select area"
                            type="select"
                            className="form-control"
                            id="area"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.area || ""}
                            invalid={
                              validation.touched.area && validation.errors.area
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Area </option>

                            {AllData.find(
                              (item) => item.pincode_id == selectedPincode
                            )?.areas.map((items) => (
                              <option key={items.id} value={items.id}>
                                <b>{items.area}</b>
                              </option>
                            ))}
                          </Input>
                          {validation.touched.area && validation.errors.area ? (
                            <FormFeedback type="invalid">
                              {validation.errors.area}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="house_no">Flat/House No.</Label>
                          <Input
                            name="house_no"
                            placeholder="Enter Flat or House Number"
                            type="text"
                            className="form-control"
                            id="house_no"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.house_no || ""}
                            invalid={
                              validation.touched.house_no &&
                              validation.errors.house_no
                                ? true
                                : false
                            }
                          />
                          {validation.touched.house_no &&
                          validation.errors.house_no ? (
                            <FormFeedback type="invalid">
                              {validation.errors.house_no}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="society">Building/Society </Label>
                          <Input
                            name="society"
                            placeholder="Enter Building/Society "
                            type="text"
                            className="form-control"
                            id="society"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.society || ""}
                            invalid={
                              validation.touched.society &&
                              validation.errors.society
                                ? true
                                : false
                            }
                          />
                          {validation.touched.society &&
                          validation.errors.society ? (
                            <FormFeedback type="invalid">
                              {validation.errors.society}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="landmark">Landmark </Label>
                          <Input
                            name="landmark"
                            placeholder="Enter landmark "
                            type="textarea"
                            className="form-control"
                            id="landmark"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.landmark || ""}
                            invalid={
                              validation.touched.landmark &&
                              validation.errors.landmark
                                ? true
                                : false
                            }
                          />
                          {validation.touched.landmark &&
                          validation.errors.landmark ? (
                            <FormFeedback type="invalid">
                              {validation.errors.landmark}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="float-end">
                      <Button color="primary" type="submit px-4">
                        Submit form
                      </Button>
                      <Link to={"/customer-list"}>
                        <Button
                          color="danger"
                          type="submit"
                          className="ms-2 px-4"
                        >
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default AddCustomers;
