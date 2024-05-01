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

import productPlacehonder from "../../assets/images/brands/product-placeholder.png";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import {
  API_BASE_URL,
  API_DELIVERY_BOYS_POST_GET,
  API_HSN_CODE_GET_POST,
  API_PRODUCT_CATEGORY_GET_POST,
  API_PRODUCT_POST_GET,
  API_PRODUCT_VIEW_BY_ID_AND_UPDATE,
  API_TAX_RATE_GET_POST,
  API_UOM_GET_POST,
  API_USER_POST_GET,
} from "customhooks/All_Api/Apis";
import axios from "axios";
import { toast } from "react-toastify";
import { format } from "date-fns";

const EditProducts = () => {
  const [productImg, setproductImg] = useState(null);

  const [HSNData, setHSNData] = useState([]);
  const [productCategoryData, setProductCategoryData] = useState([]);
  const [uomData, setUomData] = useState([]);
  const [taxratedata, setTaxratedata] = useState([]);
  const [productDataById, setProductDataById] = useState([]);

  const { id } = useParams();

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  const navigate = useNavigate();

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      profile_picture: "",
      product_name: productDataById.product_name || "",
      product_category: productDataById.product_category_id || "",
      product_uom: productDataById.product_uom_id || "",
      product_rate: productDataById.product_rate || "",
      expiry_days: productDataById.expiry_days || "",
      hsn_code: productDataById.hsn_code_id || "",
      tax_rate: productDataById.tax_rate_id || "",
      description: productDataById.description || "",
      is_returnable: productDataById.is_returnable || false,
      product_type: productDataById.product_type || "",
      product_classification: productDataById.product_classification || "",
    },
    validationSchema: Yup.object({
      profile_picture: Yup.string(),
      product_name: Yup.string().required("Please Enter Product Name"),
      product_category: Yup.string().required("Please Select Product Category"),
      product_uom: Yup.string().required("Please Select Product UOM"),
      product_rate: Yup.string().required("Please Enter Product rate"),
      expiry_days: Yup.string().required("Please Enter Expiry Days"),
      hsn_code: Yup.string().required("Please Select HSN-Code"),
      tax_rate: Yup.string().required("Please Select Tax Rate"),
      description: Yup.string().required("Please Enter Product Description "),
      is_returnable: Yup.string(),
      product_type: Yup.string(),
      product_classification: Yup.string(),
    }),
    onSubmit: async (values) => {
      console.log(values);
      try {
        // Create a new FormData object
        const formData = new FormData();

        // Append the files to the FormData with their respective field names

        formData.append("profile_picture", productImg);

        // Append other data from the values object to the FormData
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            formData.append(key, values[key]);
          }
        }

        const { data } = await axios.post(
          `${API_PRODUCT_VIEW_BY_ID_AND_UPDATE}${id}/`,
          formData,
          config
        );
        navigate("/products");
        toast.success(`Product Updated successfully`, {
          position: "top-center",
          autoClose: 4000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        toast.error(`Something Went Wrong`, {
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

  // get Product  data by Id Start
  const getProductDataById = async () => {
  try {
    const { data } = await axios.get(
      `${API_PRODUCT_VIEW_BY_ID_AND_UPDATE}${id}/`,
      config
    );
    setProductDataById(data.data);
  } catch (error) {
    console.log("error",error);
  }
  };
  //  get Product  data by Id End
  // get HSN CODE data Start
  const getHSNCodeData = async () => {
try {
  const { data } = await axios.get(API_HSN_CODE_GET_POST, config);
  setHSNData(data.data);
} catch (error) {
  console.log("error",error);
}
  };
  // get HSN CODE data End

  // get Product Category  data Start
  const getProductCategoryData = async () => {
  try {
    const { data } = await axios.get(API_PRODUCT_CATEGORY_GET_POST, config);
    setProductCategoryData(data.data);
  } catch (error) {
    console.log("error",error);
  }
  };
  // get  Product Category  data End

  // get UOM data Start
  const geUomData = async () => {
  try {
    const { data } = await axios.get(API_UOM_GET_POST, config);
    setUomData(data.data);
  } catch (error) {
    console.log("error",error);
  }
  };
  // get  UOM   data End

  // get Tax Rate data Start
  const geTaxRateData = async () => {
try {
  const { data } = await axios.get(API_TAX_RATE_GET_POST, config);
  setTaxratedata(data.data);
} catch (error) {
  console.log("error",error);
}
  };
  // get Tax Rate data End

  useEffect(() => {
    getProductDataById();
    getHSNCodeData();
    getProductCategoryData();
    geUomData();
    geTaxRateData();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Edit Product</h3>
           
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
                          {productImg ? (
                            <img
                            src={productPlacehonder}
                              alt="Profile"
                              className="rounded-circle avatar-xl"
                            />
                          ) : (
                            <img
                            src={`${API_BASE_URL}${productDataById?.profile_picture}`}
                             
                              alt="placeholder img"
                              className="rounded-circle img-fluid avatar-xl "
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
                              setproductImg(e.target.files[0]); // Update the selected profile image
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
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">
                            Product name *
                          </Label>
                          <Input
                            name="product_name"
                            placeholder="Product Name"
                            type="text"
                            className="form-control"
                            id="validationCustom01"
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
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="product_category">
                            Product Category *
                          </Label>
                          <Input
                            name="product_category"
                            placeholder="Product Category "
                            type="select"
                            className="form-control"
                            id="product_category"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.product_category || ""}
                            invalid={
                              validation.touched.product_category &&
                              validation.errors.product_category
                                ? true
                                : false
                            }
                          >
                            <option value="">Product Category</option>
                            {productCategoryData.map((item) => (
                              <option key={item.id} value={item.id}>
                                <b>{item.product_category_name}</b>
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
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="product_uom">Product UOM * </Label>
                          <Input
                            name="product_uom"
                            placeholder="product_uom "
                            type="select"
                            className="form-control"
                            id="product_uom"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.product_uom || ""}
                            invalid={
                              validation.touched.product_uom &&
                              validation.errors.product_uom
                                ? true
                                : false
                            }
                          >
                            <option value="">Select UOM</option>
                            {uomData.map((item) => (
                              <option key={item.id} value={item.id}>
                                <b>
                                  {item.quantity} {item.unit_name}
                                </b>
                              </option>
                            ))}
                          </Input>

                          {validation.touched.product_uom &&
                          validation.errors.product_uom ? (
                            <FormFeedback type="invalid">
                              {validation.errors.product_uom}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="product_rate">
                            Product Rate (INR) *
                          </Label>
                          <Input
                            name="product_rate"
                            placeholder="Enter Product Rate"
                            type="number"
                            className="form-control"
                            id="product_rate"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.product_rate || ""}
                            invalid={
                              validation.touched.product_rate &&
                              validation.errors.product_rate
                                ? true
                                : false
                            }
                          />
                          {validation.touched.product_rate &&
                          validation.errors.product_rate ? (
                            <FormFeedback type="invalid">
                              {validation.errors.product_rate}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="expiry_days">Expiry Days</Label>
                          <Input
                            name="expiry_days"
                            placeholder="Enter Expiry Days"
                            type="number"
                            className="form-control"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.expiry_days || ""}
                            invalid={
                              validation.touched.expiry_days &&
                              validation.errors.expiry_days
                                ? true
                                : false
                            }
                          />
                          {validation.touched.expiry_days &&
                          validation.errors.expiry_days ? (
                            <FormFeedback type="invalid">
                              {validation.errors.expiry_days}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <Col md="12">
                          <Label>Product Type:</Label>
                        </Col>
                        <Col md="12">
                          <FormGroup check className="mt-2 mb-4">
                            <Label check>
                              <Input
                                type="radio"
                                name="product_type"
                                value="Scheduled"
                                checked={
                                  validation.values.product_type === "Scheduled"
                                }
                                onChange={validation.handleChange}
                              />
                              <span className="ms-1">Scheduled</span>
                            </Label>
                            <Label check>
                              <Input
                                type="radio"
                                name="product_type"
                                value="Non-Scheduled"
                                className="ms-3"
                                checked={
                                  validation.values.product_type ===
                                  "Non-Scheduled"
                                }
                                onChange={validation.handleChange}
                              />
                              <span className="ms-1">Non-Scheduled</span>
                            </Label>
                            {validation.touched.product_type &&
                              validation.errors.product_type && (
                                <FormFeedback className="d-block">
                                  {validation.errors.product_type}
                                </FormFeedback>
                              )}
                          </FormGroup>
                        </Col>
                      </Col>

                      {/*  */}
                      <Col md="6">
                        <Col md="12">
                          <Label>Product Classification:</Label>
                        </Col>
                        <Col md="12">
                          <FormGroup check className="mt-2 mb-4">
                            <Label check>
                              <Input
                                type="radio"
                                name="product_classification "
                                value="Saleable"
                                checked={
                                  validation.values.product_classification ===
                                  "Saleable"
                                }
                                onChange={validation.handleChange}
                              />
                              <span className="ms-1">Saleable</span>
                            </Label>
                            <Label check>
                              <Input
                                type="radio"
                                name="product_classification "
                                value="Non-Saleable"
                                className="ms-3"
                                onChange={validation.handleChange}
                                checked={
                                  validation.values.product_classification ===
                                  "Non-Saleable"
                                }
                              />
                              <span className="ms-1">Non-Saleable</span>
                            </Label>
                            {validation.touched.product_classification &&
                              validation.errors.product_classification && (
                                <FormFeedback className="d-block">
                                  {validation.errors.product_classification}
                                </FormFeedback>
                              )}
                          </FormGroup>
                        </Col>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="hsn_code">HSN Code * </Label>
                          <Input
                            name="hsn_code"
                            placeholder="hsn_code "
                            type="select"
                            className="form-control"
                            id="hsn_code"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.hsn_code || ""}
                            invalid={
                              validation.touched.hsn_code &&
                              validation.errors.hsn_code
                                ? true
                                : false
                            }
                          >
                            <option value="">Select HSN Code </option>
                            {HSNData.map((item) => (
                              <option key={item.id} value={item.id}>
                                <b>{item.code}</b>
                              </option>
                            ))}
                          </Input>

                          {validation.touched.hsn_code &&
                          validation.errors.hsn_code ? (
                            <FormFeedback type="invalid">
                              {validation.errors.hsn_code}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="tax_rate">Tax Rate * </Label>
                          <Input
                            name="tax_rate"
                            placeholder="tax_rate "
                            type="select"
                            className="form-control"
                            id="tax_rate"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.tax_rate || ""}
                            invalid={
                              validation.touched.tax_rate &&
                              validation.errors.tax_rate
                                ? true
                                : false
                            }
                          >
                            <option value="">Select Tax rate</option>
                            {taxratedata.map((item) => (
                              <option key={item.id} value={item.id}>
                                <b>{item.tax_name}</b>
                              </option>
                            ))}
                          </Input>

                          {validation.touched.tax_rate &&
                          validation.errors.tax_rate ? (
                            <FormFeedback type="invalid">
                              {validation.errors.tax_rate}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="description">
                            Product Description
                          </Label>
                          <Input
                            name="description"
                            placeholder="Please Enter Product Description"
                            type="textarea"
                            className="form-control"
                            id="job_type"
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

                    <Row>
                      <Col md="12">
                        <FormGroup check className="mt-2">
                          <Label check>
                            <Input
                              type="checkbox"
                              name="is_returnable"
                              checked={validation.values.is_returnable}
                              onChange={validation.handleChange}
                              className="form-control mx-2 "
                              onClick={() =>
                                validation.setFieldValue(
                                  "is_returnable",
                                  !validation.values.is_returnable
                                )
                              }
                            />
                            {validation.values.is_returnable
                              ? " Returnable"
                              : "Non-Rreturnable"}
                          </Label>
                          {validation.touched.is_returnable &&
                            validation.errors.is_returnable && (
                              <FormFeedback className="d-block">
                                {validation.errors.is_returnable}
                              </FormFeedback>
                            )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Button className="mt-5" color="primary " type="submit">
                      Submit form
                    </Button>
                    <Link to={"/products"}>
                      <Button className="mt-5" color="danger ms-3 px-4">
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

export default EditProducts;
