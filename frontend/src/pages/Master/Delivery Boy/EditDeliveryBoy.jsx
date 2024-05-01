import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import deliveryboy from "../../../assets/images/brands/deliveryboy.png";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_BASE_URL,
  API_DELIVERY_BOYS_GET_BY_ID_AND_UPDATE,
  API_DELIVERY_BOYS_POST_GET,
  API_HUB_ADD_GET,
  API_USER_POST_GET,
} from "customhooks/All_Api/Apis";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Path } from "leaflet";

const EditDeliveryBoy = () => {
  const [headPerson, setHeadPerson] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  //
  const [deliveryBoyProfileImage, setdeliveryBoyProfileImage] = useState([]);
  const [deliveryBoydrivingLicence, setDeliveryBoydrivingLicence] = useState(
    []
  );
  const [deliveryBoyadharCard, setDeliveryBoyadharCard] = useState([]);
  //
  const [drivingLicence, setDrivingLicence] = useState();
  const [adharCard, setAdharCard] = useState(null);
  const [dataById, setDataById] = useState([]);
  const [HUBsData, setHUBsData] = useState([]);
  //
  const [
    deliveryBoyProfileImageWithoutBaseUrl,
    setdeliveryBoyProfileImageWithoutBaseUrl,
  ] = useState([]);
  const [
    deliveryBoyadharCardWithoutBaseUrl,
    setDeliveryBoyadharCardWithoutBaseUrl,
  ] = useState([]);
  const [
    deliveryBoydrivingLicenceWithoutBaseUrl,
    setDeliveryBoydrivingLicenceWithoutBaseUrl,
  ] = useState([]);

  const { id } = useParams();
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


    // get HUB data Start
    const getHubsData = async () => {
      const { data } = await axios.get(API_HUB_ADD_GET, config);
      setHUBsData(data.data);
    };
    // get HUB data End

    
  // Form validation
  const initialFormData = new FormData();
  initialFormData.append("adhar_card_file", dataById.adhar_card_file || "");
  initialFormData.append(
    "driving_licence_file",
    dataById.driving_licence_file || ""
  );
  initialFormData.append("profile_picture", dataById.profile_picture || "");

  //  settting initial values
  const initialValues = {
    first_name: dataById.first_name,
    last_name: dataById.last_name,
    contact_no: dataById.contact_no,
    address: dataById.address,
    allocated_hub: dataById.allocated_hub || "",
    joined_on: dataById.joined_on,
    job_type: dataById.job_type,
    head_person: dataById.head_person || "",
    adharcard_no: dataById.adharcard_no,
    driving_licence_no: dataById.driving_licence_no,
    blood_group: dataById.blood_group,
    adhar_card_file: "", // Initialize image fields with null
    driving_licence_file: "", // Initialize image fields with null
    profile_picture: "", // Initialize image fields with null
    is_active: dataById.is_active,
  };
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: initialValues,
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

      adharcard_no: Yup.string()
        .required("Please Enter Your Contact Number")
        .matches(/^\d+$/, "Contact Number must contain only numbers")
        .min(12, "Contact Number must be at least 12 characters")
        .max(12, "Contact Number must not exceed 12 characters"),
      driving_licence_no: Yup.string()
        .required("Please Enter Your Driving Licence No.")
        .matches(/^[A-Z]{2}\d{13}$/, "Invalid Driving Licence No."),
      blood_group: Yup.string().required("Please Select Blood Group"),
      adhar_card_file: Yup.string(),
      driving_licence_file: Yup.string(),
      profile_picture: Yup.string(),
      is_active: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        // Create a new FormData object
        const formData = new FormData();

        // Append the files to the FormData with their respective field names
        formData.append("adhar_card_file", deliveryBoyadharCardWithoutBaseUrl);
        formData.append(
          "driving_licence_file",
          deliveryBoydrivingLicenceWithoutBaseUrl
        );
        formData.append(
          "profile_picture",
          deliveryBoyProfileImageWithoutBaseUrl
        );

        // Append other data from the values object to the FormData
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            formData.append(key, values[key]);
          }
        }

        const { data } = await axios.post(
          `${API_DELIVERY_BOYS_GET_BY_ID_AND_UPDATE}${id}/`,
          formData,
          config
        );
        navigate("/master-delivery-boys");
        toast.success(`Delivery Boy Updated successfully`, {
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
  // console.log(headPerson);
  // get head Person Name End

  const getDeliveryBoyDataById = async () => {
    try {
      const { data } = await axios.get(
        `${API_DELIVERY_BOYS_GET_BY_ID_AND_UPDATE}${id}/`,
        config
      );

      // Assuming your fetched data contains the image URLs/paths, update the state accordingly
      setDataById(data.data);
      setdeliveryBoyProfileImage(`${API_BASE_URL}${data.data.profile_picture}`);
      setdeliveryBoyProfileImageWithoutBaseUrl(data.data.profile_picture);
      setDeliveryBoyadharCard(`${API_BASE_URL}${data.data.adhar_card_file}`);
      setDeliveryBoydrivingLicence(
        `${API_BASE_URL}${data.data.driving_licence_file}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsersData();
    getDeliveryBoyDataById();
    getHubsData()
  }, []);

  useEffect(() => {
    console.log("deliveryBoyProfileImage", deliveryBoyProfileImage);
  }, [deliveryBoyProfileImage]);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Edit Delivery Boys</h3>
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
                              src={URL.createObjectURL(
                                deliveryBoyProfileImageWithoutBaseUrl
                              )}
                              alt="Profile"
                              className="rounded-circle avatar-xl"
                            />
                          ) : (
                            <img
                              src={deliveryBoyProfileImage}
                              alt="Delivery Boy Profile"
                              className="rounded-circle avatar-xl"
                            />
                          )}
                        </div>
                        <FormGroup>
                          <Input
                            type="file"
                            name="profile_picture"
                            id="profile_picture"
                            onChange={(e) => {
                              validation.setFieldValue(
                                "profile_picture",
                                e.target.files[0]
                              ); // Update Formik's field value
                              setProfileImage(e.target.files[0]); // Update the selected profile image
                              setdeliveryBoyProfileImageWithoutBaseUrl(
                                e.target.files[0]
                              );
                            }}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.profile_picture &&
                              validation.errors.profile_picture
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
                          <Label htmlFor="validationCustom03">contact_no</Label>
                          <Input
                            name="contact_no"
                            placeholder="contact_no"
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
                            disabled = {true}
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
                            <option value="">Select Head Person</option>
                            {headPerson.map((item) => (
                              <option key={item?.milkmor_user_id} value={item?.milkmor_user_id}>
                                <b>
                                  {item?.first_name} {item?.last_name}
                                </b>
                              </option>
                            ))}
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
                            placeholder="driving_licence_no Code"
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
                            id="driving_licence_file"
                            onChange={(e) => {
                              validation.setFieldValue(
                                "adhar_card_file",
                                e.target.files[0]
                              ); // Update Formik's field value
                              setDrivingLicence(e.target.files[0]); // Update the adhar_card_file image
                              setDeliveryBoydrivingLicenceWithoutBaseUrl(
                                e.target.files[0]
                              );
                            }}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.driving_licence_file &&
                              validation.errors.driving_licence_file
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
                            <img
                              src={URL.createObjectURL(
                                deliveryBoydrivingLicenceWithoutBaseUrl
                              )}
                              alt="Profile"
                              className="rounded-circle avatar-xl"
                            />
                          ) : (
                            <img
                              src={deliveryBoydrivingLicence}
                              alt="Delivery Boy Driving Licence"
                              className="rounded-circle avatar-xl"
                            />
                          )}
                        </div>
                      </Col>

                      <Col lg={6} className="mt-3">
                        <FormGroup className="mb-3">
                          <Label htmlFor="adhar_card_file">Adhar Card</Label>
                          <Input
                            type="file"
                            name="adhar_card_file"
                            id="adhar_card_file"
                            onChange={(e) => {
                              validation.setFieldValue(
                                "adhar_card_file",
                                e.target.files[0]
                              ); // Update Formik's field value
                              setAdharCard(e.target.files[0]); // Update the adhar_card_file image
                              setDeliveryBoyadharCardWithoutBaseUrl(
                                e.target.files[0]
                              );
                            }}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.adhar_card_file &&
                              validation.errors.adhar_card_file
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
                            <img
                              src={URL.createObjectURL(
                                deliveryBoyadharCardWithoutBaseUrl
                              )}
                              alt="Adhar Card"
                              className="rounded-circle avatar-xl"
                            />
                          ) : (
                            <img
                              src={deliveryBoyadharCard}
                              alt="Delivery Boy Driving Licence"
                              className="rounded-circle avatar-xl"
                            />
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Button className="mt-4" color="primary" type="submit">
                      Submit form
                    </Button>
                    <Link to={"/master-delivery-boys"}>
                      <Button className="mt-4 ms-4 px-4" color="danger" type="">
                        Cancel
                      </Button>
                    </Link>
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

export default EditDeliveryBoy;
