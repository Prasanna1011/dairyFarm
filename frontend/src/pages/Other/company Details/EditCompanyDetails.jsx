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
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_BASE_URL,
  API_COMPANY_DETAILS_VIEW_BY_ID_AND_UPDATE,
  API_DELIVERY_BOYS_POST_GET,
  API_USER_POST_GET,
} from "customhooks/All_Api/Apis";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Path } from "leaflet";
// import productPlacehonder from "../../assets/images/brands/product-placeholder.png";
import productPlacehonder from "../../../assets/images/brands/product-placeholder.png";

const EditCompanyDetails = () => {
  const [headPerson, setHeadPerson] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [logImg, setlogImg] = useState(null);
  const [companyDetails, setCompanyDetails] = useState([]);

  const { id } = useParams();
  console.log("isdddddddd", id);
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  const navigate = useNavigate();

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      company_name: companyDetails.company_name || "",
      GSTIN: companyDetails.GSTIN || "",
      contact_no: companyDetails.contact_no || "",
      company_email: companyDetails.company_email || "",
      customer_care_email: companyDetails.customer_care_email || "",
      company_address: companyDetails.company_address || "",
      logo: "",
    },
    validationSchema: Yup.object({
      logo: Yup.string(),
      company_name: Yup.string().required("Please Enter Your Company Name"),
      GSTIN: Yup.string().required("Please Enter  GST number"),
      contact_no: Yup.string()
        .required("Please Enter Your Contact Number")
        .matches(/^\d+$/, "Contact Number must contain only numbers")
        .min(10, "Contact Number must be at least 10 characters")
        .max(10, "Contact Number must not exceed 10 characters"),
      company_email: Yup.string().required("Please Enter Your company email"),
      customer_care_email: Yup.string().required(
        "Please Enter Your customer email"
      ),
      company_address: Yup.string().required("Please Enter Your Company Name"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        // Create a new FormData object
        const formData = new FormData();

        // Append the files to the FormData with their respective field names
        formData.append("logo", logImg);

        // Append other data from the values object to the FormData
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            formData.append(key, values[key]);
          }
        }

        const { data } = await axios.post(
          `${API_COMPANY_DETAILS_VIEW_BY_ID_AND_UPDATE}${id}/`,
          formData,
          config
        );
        console.log("postttt datttaaa", data);
        navigate("/company-details");
        toast.success(` Company details Updated successfully`, {
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

  const companyDetailsDataByID = async () => {
    try {
      const { data } = await axios.get(
        `${API_COMPANY_DETAILS_VIEW_BY_ID_AND_UPDATE}${id}/`,
        config
      );

      // Assuming your fetched data contains the image URLs/paths, update the state accordingly
      setCompanyDetails(data.data);
      // console.log("data.data", data.data);
      // console.log("companyDetails", companyDetails); // This might not show the updated state
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    companyDetailsDataByID();
  }, []);

  useEffect(() => {
    console.log("companyDetails", companyDetails); // Log the updated state here
  }, [companyDetails]);

  // ... rest of the component code

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Company Details</h3>
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
              <Col xl="4">
                <Card>
                  <CardBody>
                    <Row>
                      <Col>
                        <div style={{ height: "250px" }}>
                          {profileImage ? (
                            <img
                              src={productPlacehonder}
                              alt="Profile"
                              className="rounded-circle avatar-xl"
                            />
                          ) : (
                            <img
                              src={`${API_BASE_URL}${companyDetails?.logo}`}
                              alt="placeholder img"
                              className="rounded-circle  avatar-xl "
                            />
                          )}
                        </div>
                        <FormGroup>
                          <Input
                            type="file"
                            name="logo"
                            className="form-control mb-3 mt-3"
                            id="logo"
                            onChange={(e) => {
                              validation.handleChange(e);
                              setlogImg(e.target.files[0]); // Update the selected logo image
                            }}
                            onBlur={validation.handleBlur}
                            value={validation.values.logo || ""}
                            invalid={
                              validation.touched.logo && validation.errors.logo
                                ? true
                                : false
                            }
                          />
                          {validation.touched.logo && validation.errors.logo ? (
                            <FormFeedback type="invalid">
                              {validation.errors.logo}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col xl="8">
                <Card>
                  <CardBody>
                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">
                            Company name
                          </Label>
                          <Input
                            name="company_name"
                            placeholder="Company name"
                            type="text"
                            className="form-control"
                            id="validationCustom01"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.company_name || ""}
                            invalid={
                              validation.touched.company_name &&
                              validation.errors.company_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.company_name &&
                          validation.errors.company_name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.company_name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">GSTIN</Label>
                          <Input
                            name="GSTIN"
                            placeholder="Last name"
                            type="text"
                            className="form-control"
                            id="validationCustom02"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.GSTIN || ""}
                            invalid={
                              validation.touched.GSTIN &&
                              validation.errors.GSTIN
                                ? true
                                : false
                            }
                          />
                          {validation.touched.GSTIN &&
                          validation.errors.GSTIN ? (
                            <FormFeedback type="invalid">
                              {validation.errors.GSTIN}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
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
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="company_email">Company Email</Label>
                          <Input
                            name="company_email"
                            placeholder="company_email"
                            type="text"
                            className="form-control"
                            id="company_email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.company_email || ""}
                            invalid={
                              validation.touched.company_email &&
                              validation.errors.company_email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.company_email &&
                          validation.errors.company_email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.company_email}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="customer_care_email">
                            Customer care email
                          </Label>
                          <Input
                            name="customer_care_email"
                            placeholder="customer_care_email"
                            type="text"
                            className="form-control"
                            id="customer_care_email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.customer_care_email || ""}
                            invalid={
                              validation.touched.customer_care_email &&
                              validation.errors.customer_care_email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.customer_care_email &&
                          validation.errors.customer_care_email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.customer_care_email}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Row>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="company_address">
                              Company Address
                            </Label>
                            <Input
                              name="company_address"
                              placeholder="Please Enter Company Address"
                              type="textarea"
                              className="form-control"
                              id="company_address"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.company_address || ""}
                              invalid={
                                validation.touched.company_address &&
                                validation.errors.company_address
                                  ? true
                                  : false
                              }
                            ></Input>
                            {validation.touched.company_address &&
                            validation.errors.company_address ? (
                              <FormFeedback type="invalid">
                                {validation.errors.company_address}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
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

export default EditCompanyDetails;
