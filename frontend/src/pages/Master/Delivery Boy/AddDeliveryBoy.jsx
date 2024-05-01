import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import avatar5 from "../../../assets/images/users/avatar-5.jpg";
import deliveryboy from "../../../assets/images/brands/deliveryboy.png";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_DELIVERY_BOYS_POST_GET,
  API_HUB_ADD_GET,
  API_USER_POST_GET,
} from "customhooks/All_Api/Apis";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Path } from "leaflet";

const AddDeliveryBoy = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [drivingLicence, setDrivingLicence] = useState(null);
  const [adharCard, setAdharCard] = useState(null);
  const [headPerson, setHeadPerson] = useState([]);
  const [HUBsData, setHUBsData] = useState([]);

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  const navigate = useNavigate();
  // static blood gropu list start
  const bloodGroupOptions = [
    { id: "A+", name: "A+" },
    { id: "A-", name: "A-" },
    { id: "B+", name: "B+" },
    { id: "B-", name: "B-" },
    { id: "AB+", name: "AB+" },
    { id: "AB-", name: "AB-" },
    { id: "O+", name: "O+" },
    { id: "O-", name: "O-" },
  ];
  const jobTypes = [
    { id: "Delivery Boy", name: "Delivery Boy" },
    { id: "Delivery Assistant", name: "Delivery Assistant" },
  ];
  // static blood gropu list End
  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      first_name: "",
      last_name: "",
      contact_no: "",
      address: "",
      allocated_hub: "",
      joined_on: "",
      job_type: "",
      head_person: "",
      password: "",
      confirm_password: "",
      adharcard_no: "",
      driving_licence_no: "",
      blood_group: "",
      adhar_card_file: "",
      driving_licence_file: "",
      profile_picture: "",
      is_active: true,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please Enter Your First Name"),
      last_name: Yup.string().required("Please Enter Your Last Name"),
      contact_no: Yup.string()
        .required("Please Enter Your Contact Number")
        .matches(/^\d+$/, "Contact Number must contain only numbers")
        .min(10, "Contact Number must be at least 10 characters")
        .max(10, "Contact Number must not exceed 10 characters"),
      address: Yup.string().required("Please Enter Your address"),
      allocated_hub: Yup.string(),
      joined_on: Yup.date().required("Joined On is required"),
      job_type: Yup.string().required("Please Select Job Type"),
      head_person: Yup.string(),
      password: Yup.string()
        .required("Please Enter your password")

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
      adharcard_no: Yup.string()
        .required("Please Enter Your Contact Number")
        .matches(/^\d+$/, "Contact Number must contain only numbers")
        .min(12, "Contact Number must be at least 12 characters")
        .max(12, "Contact Number must not exceed 12 characters"),
      driving_licence_no: Yup.string()
        .required("Please Enter Your Driving Licence No.")
        .matches(/^[A-Z]{2}\d{13}$/, "Invalid Driving Licence No."),
      blood_group: Yup.string().required("Please Select Blood Group"),
      adhar_card_file: Yup.string().required("Please Import Your Adharcard "),
      driving_licence_file: Yup.string().required(
        "Please Import Your Driving Licence"
      ),
      profile_picture: Yup.string().required("Please Select Profile img"),
      is_active: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        // Create a new FormData object
        const formData = new FormData();

        // Append the files to the FormData with their respective field names
        formData.append("adhar_card_file", adharCard);
        formData.append("driving_licence_file", drivingLicence);
        formData.append("profile_picture", profileImage);

        // Append other data from the values object to the FormData
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            formData.append(key, values[key]);
          }
        }

        const { data } = await axios.post(
          API_DELIVERY_BOYS_POST_GET,
          formData,
          config
        );
        navigate("/master-delivery-boys");
        toast.success(`Delivery Boy added successfully`, {
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

  // get head Person Name Start
  const getUsersData = async () => {
    const { data } = await axios.get(API_USER_POST_GET, config);
    setHeadPerson(data.data);
  };
  // get head Person Name End

  // get HUB data Start
  const getHubsData = async () => {
    const { data } = await axios.get(API_HUB_ADD_GET, config);
    setHUBsData(data.data);
  };
  // get HUB data End

  useEffect(() => {
    getUsersData();
    getHubsData();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Delivery Boys</h3>
                  <Link to="/master-add-delivery-boys">
                    <Button color="primary" className="px-4">
                      Add
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Form
            className="needs-validation"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
            encType="multipart/form-data"
          >
            <Row>
              <Col xl="3">
                <Card>
                  <CardBody>
                    <Row>
                      <Col>
                        <div>
                          {profileImage ? (
                            <img
                              src={URL.createObjectURL(profileImage)}
                              alt="Profile"
                              className="rounded-circle avatar-xl"
                            />
                          ) : (
                            <img
                              src={deliveryboy}
                              alt=""
                              className="rounded-circle  avatar-xl "
                            />
                          )}
                        </div>
                        <FormGroup>
                          <Input
                            type="file"
                            name="profile_picture"
                            className="form-control mb-3 mt-3"
                            id="profile_picture"
                            onChange={(e) => {
                              validation.handleChange(e); // Handle Formik's change event
                              setProfileImage(e.target.files[0]); // Update the selected profile image
                            }}
                            onBlur={validation.handleBlur}
                            value={validation.values.profile_picture || ""}
                            invalid={
                              validation.touched.profile_picture &&
                              validation.errors.profile_picture
                                ? true
                                : false
                            }
                          />
                          {validation.touched.profile_picture &&
                          validation.errors.profile_picture ? (
                            <FormFeedback type="invalid">
                              {validation.errors.profile_picture}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col xl="9">
                <Card>
                  <CardBody>
                    <Row>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">First name</Label>
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
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">Last name</Label>
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
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom03">contact No.</Label>
                          <Input
                            name="contact_no"
                            placeholder="contact Number"
                            type="text"
                            className="form-control"
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
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            name="address"
                            placeholder="address"
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
                          <Label htmlFor="allocated_hub">Allocated HUB</Label>
                          <Input
                            name="allocated_hub"
                            placeholder="allocated_hub"
                            type="select"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.allocated_hub || ""}
                            invalid={
                              validation.touched.allocated_hub &&
                              validation.errors.allocated_hub
                                ? true
                                : false
                            }
                          >
                       

                            <option value="">Select HUB</option>
                            {HUBsData.map(
                              (item) =>
                                item.is_active && (
                                  <option key={item.id} value={item.id}>
                                    <b>{item.name}</b>
                                  </option>
                                )
                            )}
                          </Input>
                          {validation.touched.allocated_hub &&
                          validation.errors.allocated_hub ? (
                            <FormFeedback type="invalid">
                              {validation.errors.allocated_hub}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <label htmlFor="joined_on" className="form-label">
                            Joined On
                          </label>
                          <Flatpickr
                            id="joined_on"
                            name="joined_on"
                            placeholder="dd-mm-yyyy"
                            className={`form-control ${
                              validation.touched.joined_on &&
                              validation.errors.joined_on
                                ? "is-invalid"
                                : ""
                            }`}
                            value={validation.values.joined_on}
                            onChange={(date) => {
                              const formattedDate = format(
                                date[0],
                                "yyyy-MM-dd"
                              ); // Format the date
                              validation.setFieldValue(
                                "joined_on",
                                formattedDate
                              );
                            }}
                            options={{
                              dateFormat: "Y-m-d",
                            }}
                          />
                          {validation.touched.joined_on &&
                            validation.errors.joined_on && (
                              <div className="invalid-feedback">
                                {validation.errors.joined_on}
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="job_type">Job Type </Label>
                          <Input
                            name="job_type"
                            placeholder="job_type Code"
                            type="select"
                            className="form-control"
                            id="job_type"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.job_type || ""}
                            invalid={
                              validation.touched.job_type &&
                              validation.errors.job_type
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Job Type </option>
                            {jobTypes.map((item) => (
                              <option key={item.id} value={item.id}>
                                <b>{item.name}</b>
                              </option>
                            ))}
                          </Input>
                          {validation.touched.job_type &&
                          validation.errors.job_type ? (
                            <FormFeedback type="invalid">
                              {validation.errors.job_type}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="head_person">Head Person </Label>
                          <Input
                            name="head_person"
                            placeholder="head_person "
                            type="select"
                            className="form-control"
                            id="head_person"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.head_person || ""}
                            invalid={
                              validation.touched.head_person &&
                              validation.errors.head_person
                                ? true
                                : false
                            }
                          >
                            <option value="" disabled>
                              Select Head Person
                            </option>
                            {headPerson.map(
                              (item) =>
                                item.is_active && (
                                  <option
                                    key={item.milkmor_user_id}
                                    value={item.milkmor_user_id}
                                  >
                                    <b>
                                      {item.first_name} {item.last_name}
                                    </b>
                                  </option>
                                )
                            )}

                            {/* <option value="" disabled>
                              Select HUB
                            </option>
                            {HUBsData.map(
                              (item) =>
                                item.is_active && (
                                  <option key={item.id} value={item.id}>
                                    <b>{item.name}</b>
                                  </option>
                                )
                            )} */}
                          </Input>

                          {validation.touched.head_person &&
                          validation.errors.head_person ? (
                            <FormFeedback type="invalid">
                              {validation.errors.head_person}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            name="password"
                            placeholder="password Code"
                            type="text"
                            className="form-control"
                            id="validationCustom05"
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
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="confirm_password">
                            Confirm Password
                          </Label>
                          <Input
                            name="confirm_password"
                            placeholder="confirm Password "
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
                      </Col>
                    </Row>
                    <Row>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="adharcard_no">Adharcard No.</Label>
                          <Input
                            name="adharcard_no"
                            placeholder="Adharcard No"
                            type="text"
                            className="form-control"
                            id="adharcard_no"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.adharcard_no || ""}
                            invalid={
                              validation.touched.adharcard_no &&
                              validation.errors.adharcard_no
                                ? true
                                : false
                            }
                          />
                          {validation.touched.adharcard_no &&
                          validation.errors.adharcard_no ? (
                            <FormFeedback type="invalid">
                              {validation.errors.adharcard_no}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="driving_licence_no">
                            Driving Licence No.
                          </Label>
                          <Input
                            name="driving_licence_no"
                            placeholder="Driving Licence No"
                            type="text"
                            className="form-control"
                            id="driving_licence_no"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.driving_licence_no || ""}
                            invalid={
                              validation.touched.driving_licence_no &&
                              validation.errors.driving_licence_no
                                ? true
                                : false
                            }
                          />
                          {validation.touched.driving_licence_no &&
                          validation.errors.driving_licence_no ? (
                            <FormFeedback type="invalid">
                              {validation.errors.driving_licence_no}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="blood_group">Blood Group</Label>
                          <Input
                            name="blood_group"
                            placeholder="blood_group Code"
                            type="select"
                            className="form-control"
                            id="blood_group"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.blood_group || ""}
                            invalid={
                              validation.touched.blood_group &&
                              validation.errors.blood_group
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Blood Group</option>
                            {bloodGroupOptions.map((item, index) => (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </Input>
                          {validation.touched.blood_group &&
                          validation.errors.blood_group ? (
                            <FormFeedback type="invalid">
                              {validation.errors.blood_group}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup check className="mt-2">
                          <Label check>
                            <Input
                              type="checkbox"
                              name="is_active"
                              checked={validation.values.is_active}
                              onChange={validation.handleChange}
                              className="form-control mx-2 "
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
                    <Row>
                      <Col lg={6} className="mt-3">
                        <FormGroup className="mb-3">
                          <Label htmlFor="driving_licence_file">
                            Driving Licence
                          </Label>
                          <Input
                            type="file"
                            name="driving_licence_file"
                            className="form-control"
                            id="driving_licence_file"
                            onChange={(e) => {
                              validation.handleChange(e); // Handle Formik's change event
                              setDrivingLicence(e.target.files[0]); // Update the selected profile image
                            }}
                            onBlur={validation.handleBlur}
                            value={validation.values.driving_licence_file || ""}
                            invalid={
                              validation.touched.driving_licence_file &&
                              validation.errors.driving_licence_file
                                ? true
                                : false
                            }
                          />
                          {validation.touched.driving_licence_file &&
                          validation.errors.driving_licence_file ? (
                            <FormFeedback type="invalid">
                              {validation.errors.driving_licence_file}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                        <div>
                          {drivingLicence ? (
                            <>
                              <h5 className="d-flex justify-content-center">
                                Driving Licence
                              </h5>
                              <img
                                style={{
                                  width: "100%",
                                  height: "200px",
                                  objectFit: "contain",
                                }}
                                src={URL.createObjectURL(drivingLicence)}
                                alt="Profile"
                              />
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </Col>

                      <Col lg={6} className="mt-3">
                        <FormGroup className="mb-3">
                          <Label htmlFor="adhar_card_file">Adhar Card</Label>
                          <Input
                            type="file"
                            name="adhar_card_file"
                            className="form-control"
                            id="adhar_card_file"
                            onChange={(e) => {
                              validation.handleChange(e); // Handle Formik's change event
                              setAdharCard(e.target.files[0]); // Update the selected profile image
                            }}
                            onBlur={validation.handleBlur}
                            value={validation.values.adhar_card_file || ""}
                            invalid={
                              validation.touched.adhar_card_file &&
                              validation.errors.adhar_card_file
                                ? true
                                : false
                            }
                          />
                          {validation.touched.adhar_card_file &&
                          validation.errors.adhar_card_file ? (
                            <FormFeedback type="invalid">
                              {validation.errors.adhar_card_file}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                        <div>
                          {adharCard ? (
                            <>
                              <h5 className="d-flex justify-content-center">
                                Adharcard
                              </h5>
                              <img
                                style={{
                                  width: "100%",
                                  height: "200px",
                                  objectFit: "contain",
                                }}
                                src={URL.createObjectURL(adharCard)}
                                alt="Profile"
                              />
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Button
                      className="float-end mt-4"
                      color="primary"
                      type="submit"
                    >
                      Submit form
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default AddDeliveryBoy;
