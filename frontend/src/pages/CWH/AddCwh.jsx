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

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  API_CITY_GE,
  API_CITY_GET_POST,
  API_CWH_GET_POST,
  API_DEPARTMENT_TYPE_GET_POST,
  API_FARM_GET_POST,
  API_USER_POST_GET,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { useEffect } from "react";
import { toast } from "react-toastify";

const AddCwh = () => {
  const [departmentType, setDepartmentType] = useState([]);
  const [farmData, setFarmData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [weareHousemanager, setWeareHousemanager] = useState([]);
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();
const navigate=useNavigate()
  // Local storage token End
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      name: "",
      city: "",
      farm: "",
      warehouse_manager: "",
      is_active: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Your First Name"),
      city: Yup.string().required("Please Enter Your Last Name"),
      farm: Yup.string().required("Please Enter Your Home Address"),
      warehouse_manager: Yup.mixed(),
      is_active: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      // console.log("values", values);
      try {
        const { data } = await axios.post(API_CWH_GET_POST, values, config);
        toast.success(`CWH added successfully`, {
          position: "top-center",
          autoClose: 4000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/cwh-home")
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });

  // function for get Department type data start
  const getDepartmentTypeData = async () => {
    const { data } = await axios.get(API_DEPARTMENT_TYPE_GET_POST, config);
    console.log(data.data);
    setDepartmentType(data.data);
  };
  // function for get Department type data starEnd

  // function for get City data  for dropdown start
  const getCityData = async () => {
    const { data } = await axios.get(API_CITY_GE , config);
    console.log(data.data);
    setCityData(data.data);
  };
  // function for get City  for dropdown data End

  // get farm data for dropdown start
  const getFarmData = async () => {
    const { data } = await axios.get(API_FARM_GET_POST, config);
    setFarmData(data.data);
    // console.log(data);
    console.log(farmData);
  };
  // get farm data for dropdown End

  // get farm data for WearehouseManager Start
  const getUsersforWearehouseManager = async () => {
    const { data } = await axios.get(API_USER_POST_GET, config);
    setWeareHousemanager(data.data);
    // console.log(data);
    console.log("weareHousemanager", weareHousemanager);
  };


  const filteredWarehouseManagersData = weareHousemanager?.filter(
    (user) =>
      user.department_type_name === "CWH" 
  );
  // console.log("filteredWarehouseManagersData",filteredWarehouseManagersData);
  // get farm data for WearehouseManager End

  useEffect(() => {
    getDepartmentTypeData();
    getFarmData();
    getCityData();
    getUsersforWearehouseManager();
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
                  <h3>Create Warehouse</h3>
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
                        <Label htmlFor="name">Central wearhouse name</Label>
                        <Input
                          name="name"
                          placeholder="Enter Central wearhouse name"
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.name || ""}
                          invalid={
                            validation.touched.name && validation.errors.name
                              ? true
                              : false
                          }
                        />
                        {validation.touched.name && validation.errors.name ? (
                          <FormFeedback type="invalid">
                            {validation.errors.name}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="city">City</Label>
                        <Input
                          name="city"
                          placeholder="Select Department Name"
                          type="select"
                          className="form-control"
                          id="roles"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.city || ""}
                          invalid={
                            validation.touched.city && validation.errors.city
                          }
                        >
                          {/* Placeholder option */}
                          <option value="" disabled>Choose City</option>

                          {/* Add a return statement in the mapping function */}
                          {cityData.map((item) => (
                            <option key={item.id} value={item.id}>
                              <b>{item.city}</b>
                            </option>
                          ))}
                        </Input>
                        {validation.touched.departmentType &&
                        validation.errors.departmentType ? (
                          <FormFeedback type="invalid">
                            {validation.errors.departmentType}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="farm">Parent Farm</Label>
                        <Input
                          name="farm"
                          placeholder="Select Department Name"
                          type="select"
                          className="form-control"
                          id="farm"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.farm || ""}
                          invalid={
                            validation.touched.farm && validation.errors.farm
                          }
                        >
                          {/* Placeholder option */}
                          <option value="" disabled>Choose Farm</option>

                          {/* Add a return statement in the mapping function */}
                          {farmData.map((item) => (
                            <option key={item.id} value={item.id}>
                              <b>{item.name}</b>
                            </option>
                          ))}
                        </Input>
                        {validation.touched.farm && validation.errors.farm ? (
                          <FormFeedback type="invalid">
                            {validation.errors.farm}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="warehouse_manager">
                          Wearehouse Manager
                        </Label>
                        <Input
                          name="warehouse_manager"
                          placeholder="Select Department Name"
                          type="select"
                          className="form-control"
                          id="warehouse_manager"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.warehouse_manager || ""}
                          invalid={
                            validation.touched.warehouse_manager &&
                            validation.errors.warehouse_manager
                          }
                        >
                          {/* Placeholder option */}
                          <option value="">Choose Manager</option>

                          {/* Add a return statement in the mapping function */}
                          {filteredWarehouseManagersData?.map((item) => (
                            <option
                              key={item.milkmor_user_id}
                              value={item.milkmor_user_id}
                            >
                              <b>
                                {item.first_name} {item.last_name}
                              </b>
                            </option>
                          ))}
                        </Input>
                        {validation.touched.warehouse_manager &&
                        validation.errors.warehouse_manager ? (
                          <FormFeedback type="invalid">
                            {validation.errors.warehouse_manager}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className=" d-flex  align-items-center">
                    <Col md="4">
                      <FormGroup className="mb-3">
                        <Label htmlFor="is_active">CWH Status</Label>
                        <Input
                          name="is_active"
                          type="checkbox"
                          className="form-control ms-2"
                          id="is_active"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          checked={validation.values.is_active} // Bind the checked state to the formik value
                          invalid={
                            validation.touched.is_active &&
                            validation.errors.is_active
                          }
                          onClick={() => {
                            validation.setFieldValue(
                              "is_active",
                              !validation.values.is_active // Toggle the value of is_active
                            );
                          }}
                        />
                        {validation.touched.is_active &&
                        validation.errors.is_active ? (
                          <FormFeedback type="invalid">
                            {validation.errors.is_active}
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

export default AddCwh;
