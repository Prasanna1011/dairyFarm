import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, API_HTML_SECTION_GET_BT_ID_AND_UPDATE } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

import * as Yup from "yup";
import { useFormik } from "formik";
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
import { toast } from "react-toastify";

const EditHtmlSection = () => {
  const [htmlSectionDataById, setHtmlSectionDataById] = useState([]);
  const [image, setImage] = useState(null);
  const { id } = useParams();
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End
  const navigate = useNavigate();

  const getHtmlSectionDataById = async () => {
    const { data } = await axios.get(
      `${API_HTML_SECTION_GET_BT_ID_AND_UPDATE}${id}/`,
      config
    );
    console.log(data.data);
    setHtmlSectionDataById(data.data);
  };

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      product_title: htmlSectionDataById.product_title || "",
      product_name: htmlSectionDataById.product_name || "",
      description: htmlSectionDataById.description || "",
      image: "",
    },
    validationSchema: Yup.object({
      product_title: Yup.string(),
      product_name: Yup.string(),

      description: Yup.string(),

      image: "",
    }),
    
    onSubmit: async (values) => {
      console.log(values);
      try {
        // Create a new FormData object
        const formData = new FormData();

        // Append the files to the FormData with their respective field names
        formData.append("image", image);

        // Append other data from the values object to the FormData
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            formData.append(key, values[key]);
          }
        }

        const { data } = await axios.post(
          `${API_HTML_SECTION_GET_BT_ID_AND_UPDATE}${id}/`,
          formData,
          config
        );
        navigate("/html-section");
        toast.success(`Updated successfully`, {
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

  console.log("htmlSectionDataById",htmlSectionDataById.image);
  useEffect(() => {
    getHtmlSectionDataById();
  }, []);
  return (
    <>
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
          {htmlSectionDataById.type === "Banner" ? (
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
                          <div >
                            {image ? (
                              <img
                                src={`${API_BASE_URL}${htmlSectionDataById?.image}`}
                                alt="Product"
                                className="img-fluid "
                              />
                            ) : (
                              <img
                                src={`${API_BASE_URL}${htmlSectionDataById?.image}`}
                                alt="Product"
                                className="img-fluid  "
                              />
                            )}
                          </div>
                          {/* <div>
                          <img  src={`${API_BASE_URL}${htmlSectionDataById?.image}`} className="img-fluid" alt="Responsive image" />
                          </div> */}
                          <FormGroup>
                            <Input
                              type="file"
                              name="logo"
                              className="form-control mb-3 mt-3"
                              id="logo"
                              onChange={(e) => {
                                validation.handleChange(e); // Handle Formik's change event
                                setImage(e.target.files[0]); // Update the selected profile image
                              }}
                              onBlur={validation.handleBlur}
                              value={validation.values.logo || ""}
                              invalid={
                                validation.touched.logo &&
                                validation.errors.logo
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.logo &&
                            validation.errors.logo ? (
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
                              name="product_title"
                              placeholder="Product Title"
                              type="text"
                              className="form-control"
                              id="validationCustom01"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.product_title || ""}
                              invalid={
                                validation.touched.product_title &&
                                validation.errors.product_title
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.product_title &&
                            validation.errors.product_title ? (
                              <FormFeedback type="invalid">
                                {validation.errors.product_title}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="validationCustom02">
                              product_name
                            </Label>
                            <Input
                              name="product_name"
                              placeholder="Product Name"
                              type="text"
                              className="form-control"
                              id="validationCustom02"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.product_name || ""}
                              invalid={
                                validation.touched.product_name &&
                                validation.errors.product_name
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.product_name &&
                            validation.errors.product_name ? (
                              <FormFeedback type="invalid">
                                {validation.errors.product_name}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>

                      <Row>
                        <Col md="12">
                          <FormGroup className="mb-3">
                            <Label htmlFor="description">Description</Label>
                            <Input
                              name="description"
                              placeholder="Please Enter Company Address"
                              type="textarea"
                              className="form-control"
                              id="description"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.description || ""}
                              invalid={
                                validation.touched.description &&
                                validation.errors.description
                                  ? true
                                  : false
                              }
                            ></Input>
                            {validation.touched.description &&
                            validation.errors.description ? (
                              <FormFeedback type="invalid">
                                {validation.errors.description}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="float-end">
                        <Button className=" mt-4" color="primary" type="submit">
                          Update
                        </Button>
                        <Link to={"/html-section"}>
                          <Button
                            className="float-end mt-4 ms-3"
                            color="danger"
                            type="submit"
                          >
                            Cancel
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Form>
          ) : htmlSectionDataById.type === "Feature" ? (
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
                            {image ? (
                              <img
                                src={URL.createObjectURL(image)}
                                alt="Profile"
                                className=" avatar-xl w-100"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <FormGroup>
                            <Input
                              type="file"
                              name="logo"
                              className="form-control mb-3 mt-3"
                              id="logo"
                              onChange={(e) => {
                                validation.handleChange(e); // Handle Formik's change event
                                setImage(e.target.files[0]); // Update the selected profile image
                              }}
                              onBlur={validation.handleBlur}
                              value={validation.values.logo || ""}
                              invalid={
                                validation.touched.logo &&
                                validation.errors.logo
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.logo &&
                            validation.errors.logo ? (
                              <FormFeedback type="invalid">
                                {validation.errors.logo}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="float-end">
                        <Button className=" mt-4" color="primary" type="submit">
                          Update
                        </Button>
                        <Link to={"/html-section"}>
                          <Button
                            className="float-end mt-4 ms-3"
                            color="danger"
                            type="submit"
                          >
                            Cancel
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Form>
          ) : htmlSectionDataById.type === "WhoWeAre" ? (
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
                            {image ? (
                              <img
                                src={URL.createObjectURL(image)}
                                alt="Profile"
                                className=" avatar-xl w-100"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <FormGroup>
                            <Input
                              type="file"
                              name="logo"
                              className="form-control mb-3 mt-3"
                              id="logo"
                              onChange={(e) => {
                                validation.handleChange(e); // Handle Formik's change event
                                setImage(e.target.files[0]); // Update the selected profile image
                              }}
                              onBlur={validation.handleBlur}
                              value={validation.values.logo || ""}
                              invalid={
                                validation.touched.logo &&
                                validation.errors.logo
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.logo &&
                            validation.errors.logo ? (
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
                            <Label htmlFor="description">
                              Who We Arec Description
                            </Label>
                            <Input
                              name="description"
                              placeholder="Please Enter Company Address"
                              type="textarea"
                              className="form-control"
                              id="description"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.description || ""}
                              invalid={
                                validation.touched.description &&
                                validation.errors.description
                                  ? true
                                  : false
                              }
                            ></Input>
                            {validation.touched.description &&
                            validation.errors.description ? (
                              <FormFeedback type="invalid">
                                {validation.errors.description}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="float-end">
                        <Button className=" mt-4" color="primary" type="submit">
                          Update
                        </Button>
                        <Link to={"/html-section"}>
                          <Button
                            className="float-end mt-4 ms-3"
                            color="danger"
                            type="submit"
                          >
                            Cancel
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Form>
          ) : htmlSectionDataById.type === "Product" ? (
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
                            {image ? (
                              <img
                                src={URL.createObjectURL(image)}
                                alt="Profile"
                                className=" avatar-xl w-100"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <FormGroup>
                            <Input
                              type="file"
                              name="logo"
                              className="form-control mb-3 mt-3"
                              id="logo"
                              onChange={(e) => {
                                validation.handleChange(e); // Handle Formik's change event
                                setImage(e.target.files[0]); // Update the selected profile image
                              }}
                              onBlur={validation.handleBlur}
                              value={validation.values.logo || ""}
                              invalid={
                                validation.touched.logo &&
                                validation.errors.logo
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.logo &&
                            validation.errors.logo ? (
                              <FormFeedback type="invalid">
                                {validation.errors.logo}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="float-end">
                        <Button className=" mt-4" color="primary" type="submit">
                          Update
                        </Button>
                        <Link to={"/html-section"}>
                          <Button
                            className="float-end mt-4 ms-3"
                            color="danger"
                            type="submit"
                          >
                            Cancel
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Form>
          ) : htmlSectionDataById.type === "Header" ? (
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
                            {image ? (
                              <img
                                src={URL.createObjectURL(image)}
                                alt="Profile"
                                className=" avatar-xl w-100"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <FormGroup>
                            <Input
                              type="file"
                              name="logo"
                              className="form-control mb-3 mt-3"
                              id="logo"
                              onChange={(e) => {
                                validation.handleChange(e); // Handle Formik's change event
                                setImage(e.target.files[0]); // Update the selected profile image
                              }}
                              onBlur={validation.handleBlur}
                              value={validation.values.logo || ""}
                              invalid={
                                validation.touched.logo &&
                                validation.errors.logo
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.logo &&
                            validation.errors.logo ? (
                              <FormFeedback type="invalid">
                                {validation.errors.logo}
                              </FormFeedback>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="float-end">
                        <Button className=" mt-4" color="primary" type="submit">
                          Update
                        </Button>
                        <Link to={"/html-section"}>
                          <Button
                            className="float-end mt-4 ms-3"
                            color="danger"
                            type="submit"
                          >
                            Cancel
                          </Button>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Form>
          ) : null}
        </Container>
      </div>
    </>
  );
};

export default EditHtmlSection;
