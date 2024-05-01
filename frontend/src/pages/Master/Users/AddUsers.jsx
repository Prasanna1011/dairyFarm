import React, { useState, useEffect } from "react";
import Select from "react-select";
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
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  API_CWH_GET_POST,
  API_DEPARTMENT_TYPE_GET_POST,
  API_DESIGNATION_POST_GET,
  API_FARM_GET_POST,
  API_HUB_ADD_GET,
  API_ROLE_AND_PERMISSION_GET_POST,
  API_USER_POST_GET,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { toast } from "react-toastify";

const AddUsers = () => {
  const [departmentType, setdepartmentType] = useState([]);
  const [farmData, setFarmData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [cwhData, setCWHData] = useState([]);
  const [designationData, setDesignationData] = useState([]);
  const [selectedDepartmentType, setSelectedDepartmentType] = useState("");
  const [hubListData, setHubListData] = useState([]);

  const navigate = useNavigate();

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  const optionGroup = roleData.map((item) => ({
    options: [{ label: item.name, value: item.id.toString() }],
  }));

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      first_name: "",
      last_name: "",
      address: "",
      email: "",
      mobile_no: "",
      department_id: "",
      department_name: "",
      designation_id: "",
      password: "",
      confirm_password: "",
      role: [],
      is_active: true,
    },

    validationSchema: Yup.object({
      first_name: Yup.string().required("Please Enter Your First Name"),
      last_name: Yup.string().required("Please Enter Your Last Name"),
      address: Yup.string().required("Please Enter Your Home Address"),
      mobile_no: Yup.string()
        .required("Please Enter Your Contact Number")
        .matches(/^\d+$/, "Contact Number must contain only numbers")
        .min(10, "Contact Number must be at least 10 characters")
        .max(10, "Contact Number must not exceed 10 characters"),
      email: Yup.string()
        .required("Please Enter email")
        .email("Invalid email format"),
      department_id: Yup.string().required("Please Enter Department Type"),
      department_name: Yup.string().required("Please Enter Department Name"),
      designation_id: Yup.string().required("Please Enter designation"),
      password: Yup.string()
        .required("Please confirm your password")

        .min(6, "Password must be min 6 characters long")
        .max(16, "Password must be max 16 characters long")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .matches(/[^\w]/, "Password requires a symbol"),
      confirm_password: Yup.string()
        .required("Please confirm your password")
        .min(6, "Password must be min 6 characters long")
        .max(16, "Password must be max 16 characters long")
        .matches(/[0-9]/, "Password requires a number")
        .matches(/[a-z]/, "Password requires a lowercase letter")
        .matches(/[A-Z]/, "Password requires an uppercase letter")
        .matches(/[^\w]/, "Password requires a symbol")
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please Confirm Password"),
      role: Yup.array()
        .min(1, "Select at least one option")
        .required("Select at least one option"),
      is_active: Yup.boolean(),
    }),
    onSubmit: async (values) => {

      try {
        const {
          address,
          confirm_password,
          department_id,
          department_name,
          designation_id,
          email,
          first_name,
          last_name,
          mobile_no,
          password,
          is_active,
          role,
        } = values;
        const postData = {
          address,
          confirm_password,
          department_id,
          department_name,
          designation_id,
          email,
          first_name,
          last_name,
          mobile_no,
          password,
          is_active,
          role: role.map((option) => option.value), // Extracting the "value" property from each option in the role array
        };
        const { data } = await axios.post(API_USER_POST_GET, postData, config);
        toast.success(data.message, {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/master-users");
      } catch (error) {
        toast.error(error.message, {
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


  // function for get Department type data start
  const getdepartment_typeData = async () => {
    const { data } = await axios.get(API_DEPARTMENT_TYPE_GET_POST, config);
    setdepartmentType(data.data);
  };
  // function for get Department type data starEnd

  // get farm data for dropdown start
  const getFarmData = async () => {
    const { data } = await axios.get(API_FARM_GET_POST, config);
    setFarmData(data.data);

  };
  //   Fetch Data For Hub  Start
  const FetchHubListData = async () => {
    try {
      const { data } = await axios.get(API_HUB_ADD_GET, config);
      setHubListData(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  // get Role data for dropdown start
  const getRoleData = async () => {
    const { data } = await axios.get(API_ROLE_AND_PERMISSION_GET_POST, config);
    setRoleData(data.data);

  };
  // get Role data for dropdown End

  // get Cwh data for dropdown Start
  const getCwhData = async () => {
    const { data } = await axios.get(API_CWH_GET_POST, config);
    setCWHData(data.data);
  };
  // get Cwh data for dropdown End

  // get Role data for dropdown start

  const getDesignationData = async () => {
    const { data } = await axios.get(API_DESIGNATION_POST_GET, config);
    setDesignationData(data.data);
  };

  // get Role data for dropdown End

  useEffect(() => {
    getdepartment_typeData();
    getFarmData();
    getRoleData();
    getDesignationData();
    getCwhData();
    FetchHubListData();
  }, []);
  useEffect(() => {
  }, [designationData]);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Add Users</h3>
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
                        <Label htmlFor="first_name">First name</Label>
                        <Input
                          name="first_name"
                          placeholder="First name"
                          type="text"
                          className="form-control"
                          id="validationCustom01"
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
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="last_name">Last name</Label>
                        <Input
                          name="last_name"
                          placeholder="Last name"
                          type="text"
                          className="form-control"
                          id="validationCustom02"
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
                    <Col md="12">
                      <FormGroup className="mb-3">
                        <Label htmlFor="address">Home Address</Label>
                        <Input
                          name="address"
                          placeholder=" Enter Your Home Address"
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
                        <Label htmlFor="mobile_no">Contact No.</Label>
                        <Input
                          name="mobile_no"
                          placeholder="Enter contact No."
                          type="text"
                          className="form-control"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.mobile_no || ""}
                          invalid={
                            validation.touched.mobile_no &&
                              validation.errors.mobile_no
                              ? true
                              : false
                          }
                        />
                        {validation.touched.mobile_no &&
                          validation.errors.mobile_no ? (
                          <FormFeedback type="invalid">
                            {validation.errors.mobile_no}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="email">email</Label>
                        <Input
                          name="email"
                          placeholder="enter email id"
                          type="text"
                          className="form-control"
                          id="validationCustom05"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="4">
                      <FormGroup className="mb-3">
                        <Label htmlFor="department_id">Department Type</Label>
                        <Input
                          name="department_id"
                          placeholder="Select Department Type"
                          type="select"
                          className="form-control"
                          id="role"
                          onChange={(e) => {
                            validation.handleChange(e); // Formik handler
                            setSelectedDepartmentType(e.target.value); // Update selected department type
                          }}
                          onBlur={validation.handleBlur}
                          value={validation.values.department_id || ""}
                          invalid={
                            validation.touched.department_id &&
                            validation.errors.department_id
                          }
                        >
                          {/* Placeholder option */}
                          <option value="">Choose Role</option>
                          {/* Add a return statement in the mapping function */}
                          {departmentType.map((item) => (
                            <option key={item.id} value={item.id}>
                              <b>{item.type}</b>
                            </option>
                          ))}
                        </Input>
                        {validation.touched.department_id &&
                          validation.errors.department_id ? (
                          <FormFeedback type="invalid">
                            {validation.errors.department_id}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      {selectedDepartmentType === "1" ? (
                        <FormGroup className="mb-3">
                          <Label htmlFor="department_name">
                            Department Name
                          </Label>
                          <Input
                            name="department_name"
                            placeholder="Select Department Name"
                            type="select"
                            className="form-control"
                            id="role"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.department_name || ""}
                            invalid={
                              validation.touched.department_name &&
                              validation.errors.department_name
                            }
                          >
                            <option value="">Choose Department Name</option>
                            {farmData.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </Input>
                          {validation.touched.department_name &&
                            validation.errors.department_name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.department_name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      ) : selectedDepartmentType === "2" ? (
                        <FormGroup className="mb-3">
                          <Label htmlFor="department_name">
                            Department Name
                          </Label>
                          <Input
                            name="department_name"
                            placeholder="Select Department Name"
                            type="select"
                            className="form-control"
                            id="role"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.department_name || ""}
                            invalid={
                              validation.touched.department_name &&
                              validation.errors.department_name
                            }
                          >
                            <option value="">Choose Department Name</option>
                            {cwhData.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </Input>
                          {validation.touched.department_name &&
                            validation.errors.department_name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.department_name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      ) : selectedDepartmentType === "3" ? (
                        <FormGroup className="mb-3">
                          <Label htmlFor="department_name">
                            Department Name
                          </Label>
                          <Input
                            name="department_name"
                            placeholder="Select Department Name"
                            type="select"
                            className="form-control"
                            id="role"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.department_name || ""}
                            invalid={
                              validation.touched.department_name &&
                              validation.errors.department_name
                            }
                          >
                            <option value="">Choose Department Name</option>
                            {hubListData
                              .filter((item) => item.is_active === true)
                              .map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                          </Input>
                          {validation.touched.department_name &&
                            validation.errors.department_name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.department_name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      ) : selectedDepartmentType === "" ? (
                        <FormGroup className="mb-3">
                          <Label htmlFor="department_name">
                            Department Name
                          </Label>
                          <Input
                            name="department_name"
                            placeholder="Select Department Name"
                            type="select"
                            className="form-control"
                            id="role"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.department_name || ""}
                            invalid={
                              validation.touched.department_name &&
                              validation.errors.department_name
                            }
                          >
                            <option value="">Choose Department Name</option>
                          </Input>
                          {validation.touched.department_name &&
                            validation.errors.department_name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.department_name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      ) : null}
                    </Col>

                    <Col md="4">
                      <FormGroup className="mb-3">
                        <Label htmlFor="designation_id">designation</Label>
                        <Input
                          name="designation_id"
                          placeholder="Select designation Type"
                          type="select"
                          className="form-control"
                          id="role"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.designation_id || ""}
                          invalid={
                            validation.touched.designation_id &&
                            validation.errors.designation_id
                          }
                        >
                          {/* Placeholder option */}
                          <option value="">Choose Designation</option>

                          {/* Map through designationData and filter based on selectedDepartmentType */}
                          {designationData?.filter(item => item.department_type_id == selectedDepartmentType).map((item) => (
                            <option key={item?.id} value={item?.id}>
                              <b>{item?.designation}</b>
                            </option>
                          ))}
                        </Input>

                        {validation.touched.designation_id &&
                          validation.errors.designation_id ? (
                          <FormFeedback type="invalid">
                            {validation.errors.designation_id}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
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
                    </Col>
                    <Col md="4">
                      <FormGroup className="mb-3">
                        <Label htmlFor="confirm_password">
                          Confirm Password
                        </Label>
                        <Input
                          name="confirm_password"
                          placeholder="Confirm Password"
                          type="text"
                          className="form-control"
                          id="validationCustom05"
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
                    </Col>
                    <Col lg="4">
                      <div className="mb-3">
                        <label className="control-label">Role</label>
                        <Select
                          value={validation.values.role}
                          isMulti={true}
                          onBlur={validation.handleBlur}
                          onChange={(selectedOptions) =>
                            validation.setFieldValue("role", selectedOptions)
                          }
                          invalid={
                            validation.touched.role && validation.errors.role
                              ? true
                              : false
                          }
                          options={optionGroup}
                          className="select2-selection"
                          name="role"
                        />
                        {validation.touched.role && validation.errors.role ? (
                          <FormFeedback type="invalid">
                            {validation.errors.role}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                    <Col md="12">
                      <FormGroup check className="mt-2">
                        <Label check>
                          <Input
                            type="checkbox"
                            name="is_active"
                            checked={validation.values.is_active}
                            onChange={validation.handleChange}
                            onClick={() =>
                              validation.setFieldValue(
                                "is_active",
                                !validation.values.is_active
                              )
                            }
                          />
                          Active
                        </Label>
                        {validation.touched.is_active &&
                          validation.errors.is_active && (
                            <FormFeedback className="d-block">
                              {validation.errors.is_active}
                            </FormFeedback>
                          )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button className="mt-3" color="primary " type="submit">
                    Submit form
                  </Button>
                  <Link to={"/master-users"}>
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

export default AddUsers;
