import React, { useState, useEffect } from "react";

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
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_FARM_GET_POST,
  API_FARM_UPDATE,
  API_FARM_VIEW_BY_ID,
  API_USER_POST_GET,
} from "customhooks/All_Api/Apis";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditFarm = () => {
  const [farmData, setFarmData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      name: farmData.name || "",
      address: farmData.address || "",
      city: farmData.city || "",
      farm_manager_id: farmData.farm_manager_id || "",
      is_active: farmData.is_active || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Farm Name"),
      address: Yup.string().required("Please Enter Farm Address"),
      city: Yup.string().required("Please Enter Farm City"),
      farm_manager_id: Yup.string(),
      is_active: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        console.log(values);

        const { data } = await axios.post(
          `${API_FARM_UPDATE}${id}/`,
          values,
          config
        );
        console.log("values",values);
        navigate("/farm-home");
        toast.success(`Farm Edit successfully`, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        toast.error(`Something Went Wrong`, {
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

  const getFarmData = async () => {
    const { data } = await axios.get(`${API_FARM_VIEW_BY_ID}${id}/`, config);
    setFarmData(data.data);
  };

  const getUsersData = async () => {
    try {
      const { data } = await axios.get(API_USER_POST_GET, config);
      setUsersData(data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const filteredFarmManagersData = usersData?.filter(
    (user) =>
      user?.department_type_name === "Farm"
  );
  
  console.log("filteredFarmManagersData",filteredFarmManagersData);
  useEffect(() => {
    getFarmData();
    getUsersData();
  }, []);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3> Edit Farm </h3>
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
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="name">Farm Name</Label>
                          <Input
                            name="name"
                            placeholder="Farm Name"
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
                          <Label htmlFor="address">Farm Adddress</Label>
                          <Input
                            name="address"
                            placeholder="Enter Farm Adddress"
                            type="text"
                            className="form-control"
                            id="address"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.address || ""}
                            invalid={
                              validation.touched.address &&
                              validation.errors.address
                                ? true
                                : false
                            }
                          />
                          {validation.touched.address &&
                          validation.errors.address ? (
                            <FormFeedback type="invalid">
                              {validation.errors.address}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="city">Farm City</Label>
                          <Input
                            name="city"
                            placeholder="Enter Farm City"
                            type="text"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.city || ""}
                            invalid={
                              validation.touched.city && validation.errors.city
                                ? true
                                : false
                            }
                          />
                          {validation.touched.city && validation.errors.city ? (
                            <FormFeedback type="invalid">
                              {validation.errors.city}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="farm_manager_id">
                            Farm Manager
                          </Label>
                          <Input
                            name="farm_manager_id"
                            placeholder="enter farm manager "
                            type="select"
                            className="form-control"
                            id="farm_manager_id"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.farm_manager_id || ""}
                            invalid={
                              validation.touched.farm_manager_id &&
                              validation.errors.farm_manager_id
                                ? true
                                : false
                            }
                          >
                            <option value="" disabled>
                              Select Farm Manager
                            </option>
                            {filteredFarmManagersData?.map((item) => (
                              <option
                                value={item.milkmor_user_id}
                                key={item.milkmor_user_id}
                              >
                                {item.first_name} {item.last_name}
                              </option>
                            ))}
                          </Input>
                          {validation.touched.farm_manager_id &&
                          validation.errors.farm_manager_id ? (
                            <FormFeedback type="invalid">
                              {validation.errors.farm_manager_id}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row className=" d-flex  align-items-center">
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="is_active">Farm Status</Label>
                          <Input
                            name="is_active"
                            type="checkbox"
                            className="form-control ms-2"
                            id="is_active"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            checked={validation.values.is_active}
                            invalid={
                              validation.touched.is_active &&
                              validation.errors.is_active
                            }
                            onClick={() => {
                              validation.setFieldValue(
                                "is_active",
                                !validation.values.is_active
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
                    <Link to={"/farm-home"}>
                      <Button className="mt-3 ms-3" color="danger ">
                        Cancel
                      </Button>
                    </Link>
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

export default EditFarm;
