import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Table,
  CardText,
  CardTitle,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  UncontrolledCollapse,
  Modal,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { API_RETURN_STOCK_CREATE_INITIAL_DATA_GET_AND_POST } from "customhooks/All_Api/Apis";
import { useEffect } from "react";
import { toast } from "react-toastify";

const CreateRetuenStock = ({getReturnStockData}) => {
  const [createReturnStock, setcreateReturnStock] = useState(false);
  const [createReturnStockInitialData, setcreateReturnStockInitialData] =
    useState([]);
  const [createReturnStockInitialDataProducts, setCreateReturnStockInitialDataProducts] =
    useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [requiredQuantity, setRequiredQuantity] = useState(null);
  const [originalrequiredQuantity, setOriginalRequiredQuantity] =
    useState(null);
  const [returnedReason, setReturnedReason] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const [productError, setProductError] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [quantityError, setQuantityError] = useState("");
  // /////////////////////////////////////////////////////////
  const handleReturnedReasonChange = (e) => {
    const reason = e.target.value;
    setReturnedReason(reason);
    setReasonError("");
  };

  // console.log("originalrequiredQuantity", originalrequiredQuantity);
  console.log("createReturnStockInitialData", createReturnStockInitialData);
  console.log("createReturnStockInitialDataProducts", createReturnStockInitialDataProducts);
  // console.log(
  //   "addedProductsaddedProductsaddedProductsaddedProducts",
  //   addedProducts
  //   );
  // console.log("addedProducts", addedProducts);
  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProductId(productId);
    // console.log("productId", productId);
    setProductError("");
  };

  useEffect(() => {
    // Find the product details for the selected product
    const selectedProduct = createReturnStockInitialData?.product_details?.find(
      (item) => item?.product_id == selectedProductId
    );

    // Set the required_quantity in the state
    setRequiredQuantity(selectedProduct?.required_quantity);
    setOriginalRequiredQuantity(selectedProduct?.required_quantity);
  }, [selectedProductId, createReturnStockInitialData]);

  const handleQuantityChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setQuantityError("");

    if (
      !isNaN(newValue) &&
      newValue >= 0 &&
      newValue <= parseInt(originalrequiredQuantity, 10)
    ) {
      setRequiredQuantity(newValue.toString());
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (selectedProductId && returnedReason && requiredQuantity) {
  //     // Create a new product object with selected values
  //     const selectedProduct =
  //       createReturnStockInitialData?.product_details?.find(
  //         (item) => item?.product_id == selectedProductId
  //       );

  //     const formData = {
  //       product_id: selectedProductId,
  //       return_reason: returnedReason,
  //       rto_quantity: requiredQuantity,
  //       product_name: selectedProduct?.product_name,
  //       batch_no: selectedProduct?.batch_no,
  //     };

  //     console.log("Form Data:", formData);

  //     // Update addedProducts state with the new product
  //     setAddedProducts([...addedProducts, formData]);

  //     // Reset the form fields after submitting the form
  //     setSelectedProductId("");
  //     setReturnedReason("");
  //     setRequiredQuantity("");
  //   } else {
  //     // Handle case where one or more fields are not selected
  //     alert("Please select all fields before submitting.");
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset previous error messages
    setProductError("");
    setReasonError("");
    setQuantityError("");

    // Validate inputs
    let isValid = true;

    if (!selectedProductId) {
      setProductError("Please select a product");
      isValid = false;
    }

    if (!returnedReason) {
      setReasonError("Please select a reason");
      isValid = false;
    }

    if (!requiredQuantity) {
      setQuantityError("Please enter the RTO Qty.");
      isValid = false;
    }

    if (isValid) {
      // Create a new product object with selected values
      const selectedProduct =
        createReturnStockInitialData?.product_details?.find(
          (item) => item?.product_id == selectedProductId
        );

      // Create form data object
      const formData = {
        product_id: selectedProductId,
        return_reason: returnedReason,
        rto_quantity: requiredQuantity,
        product_name: selectedProduct?.product_name,
        batch_no: selectedProduct?.batch_no,
      };

      // console.log("Form Data:", formData);

      // Update addedProducts state with the new product
      setAddedProducts([...addedProducts, formData]);

      // Reset the form fields after submitting the form
      setSelectedProductId("");
      setReturnedReason("");
      setRequiredQuantity("");
    } else {
      // Handle case where one or more fields are not selected
      // alert('Please fix the validation errors before submitting.');
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    // Filter out the item to remove from addedProducts
    const updatedProducts = addedProducts.filter(
      (item) => item !== itemToRemove
    );

    // Update the state with the filtered array
    setAddedProducts(updatedProducts);
  };

  ///////////////////////////////////////////////////
  // Local storage token Start
  const { config, first_name, last_name, department_type_name, designation } = GetAuthToken();

  function createReturnStockPopupToggle() {
    setcreateReturnStock(!createReturnStock);
  }

  const RETURN_REASON = [
    { id: "Expired", name: "Expired" },
    { id: "Returned", name: "Returned" },
    { id: "Damaged", name: "Damaged" },
    { id: "Others", name: "Others" },
  ];
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      return_outward_from_id:
        createReturnStockInitialData?.return_outward_from
          ?.return_outward_from_id || "",
      return_outward_from_name:
        createReturnStockInitialData?.return_outward_from
          ?.return_outward_from_name || "",
      return_outward_to_name:
        createReturnStockInitialData?.return_outward_to
          ?.return_outward_to_name || "",
      returned_by_name:
        createReturnStockInitialData?.returned_by?.returned_by_name || "",

      returned_by_id:
        createReturnStockInitialData?.returned_by?.returned_by_id || "",

      available_rto_quantity:
        createReturnStockInitialData?.available_rto_quantity || "0",
      return_outward_to_id:
        createReturnStockInitialData?.return_outward_to?.return_outward_to_id ||
        "",
    },
    validationSchema: Yup.object({
      return_outward_from_name: Yup.string().required(
        "Please Enter Your First Name"
      ),
      return_outward_to_name: Yup.string().required(
        "Please Enter Your Last Name"
      ),
      returned_by_name: Yup.string().required(
        "Please Enter Your returned_by_name"
      ),
      available_rto_quantity: Yup.number().required(
        "Please Enter Your available_rto_quantity"
      ),
      returned_by_id: Yup.string().required(
        "Please Enter Your returned_by_id"
      ),
    }),
    onSubmit: async (values) => {
      // Check if addedProducts is not empty
      if (addedProducts.length === 0) {
        toast.error("Please Select Products", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        return;
      }

      // Create the final data structure for submission
      const formData = {
        return_outward_from_id: values.return_outward_from_id,
        return_outward_from: values.return_outward_from_name,
        return_outward_to: values.return_outward_to_name,
        returned_by: values.returned_by_name,
        returned_by_id: values.returned_by_id,
        available_rto_quantity: values.available_rto_quantity,
        product: addedProducts,
      };

      // console.log("Form Data:", formData);

      try {
        const { data } = await axios.post(
          API_RETURN_STOCK_CREATE_INITIAL_DATA_GET_AND_POST,
          formData,
          config
        );
        // console.log("submitted Data", data);
        
        createReturnStockPopupToggle(false);
        toast.success(data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        getReturnStockData()
      } catch (error) {
        toast.error(error.response.data.message, "Something Went Wrong", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }


      // Handle the submission logic, for example, make an API request
    },
  });

  const getInitialDataCreateReturnOutward = async () => {
    const { data } = await axios.get(
      API_RETURN_STOCK_CREATE_INITIAL_DATA_GET_AND_POST,
      config
    );
    setcreateReturnStockInitialData(data.data);
    setCreateReturnStockInitialDataProducts(data.data.product_details)
    // console.log("createReturnStockInitialData",data.data);
  };

  useEffect(() => {
    getInitialDataCreateReturnOutward();
  }, []);

  // console.log(
  //   "createReturnStockInitialData",
  //   createReturnStockInitialData.product_details
  // );
  return (
    <>


      {department_type_name?.toLowerCase() === "hub" ? 
        <Button
          type="button"
          color="primary"
          onClick={() => {
            createReturnStockPopupToggle();
          }}
        >
          Create
        </Button>


      :"" }


      <Modal
        size="lg"
        isOpen={createReturnStock}
        toggle={() => {
          createReturnStockPopupToggle();
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Create Return Outward</h5>
          <button
            type="button"
            onClick={() => {
              setcreateReturnStock(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <Row className="w-100">
            <Col xl="12">
              <Form
                className="needs-validation"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row className="w-100">
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom01">
                        R.Outward From *
                      </Label>
                      <Input
                        name="return_outward_from_name"
                        placeholder="First name"
                        type="text"
                        className="form-control"
                        id="validationCustom01"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.return_outward_from_name || ""}
                        disabled={true}
                        invalid={
                          validation.touched.return_outward_from_name &&
                            validation.errors.return_outward_from_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.return_outward_from_name &&
                        validation.errors.return_outward_from_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.return_outward_from_name}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom02">R.Outward To *</Label>
                      <Input
                        name="return_outward_to_name"
                        placeholder="Last name"
                        type="text"
                        className="form-control"
                        id="validationCustom02"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.return_outward_to_name || ""}
                        disabled={true}
                        invalid={
                          validation.touched.return_outward_to_name &&
                            validation.errors.return_outward_to_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.return_outward_to_name &&
                        validation.errors.return_outward_to_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.return_outward_to_name}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom04">Returned by *</Label>
                      <Input
                        name="returned_by_name"
                        placeholder="returned_by_name"
                        type="text"
                        className="form-control"
                        id="validationCustom04"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.returned_by_name || ""}
                        disabled={true}
                        invalid={
                          validation.touched.returned_by_name &&
                            validation.errors.returned_by_name
                            ? true
                            : false
                        }
                      />
                      {validation.touched.returned_by_name &&
                        validation.errors.returned_by_name ? (
                        <FormFeedback type="invalid">
                          {validation.errors.returned_by_name}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup className="mb-3">
                      <Label htmlFor="validationCustom03">
                        Available RTO Qty *
                      </Label>
                      <Input
                        name="available_rto_quantity"
                        placeholder="Available Qty"
                        type="number"
                        className="form-control"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        disabled={true}
                        value={validation.values.available_rto_quantity || ""}
                        invalid={
                          validation.touched.available_rto_quantity &&
                            validation.errors.available_rto_quantity
                            ? true
                            : false
                        }
                      />
                      {validation.touched.available_rto_quantity &&
                        validation.errors.available_rto_quantity ? (
                        <FormFeedback type="invalid">
                          {validation.errors.available_rto_quantity}
                        </FormFeedback>
                      ) : null}
                    </FormGroup>
                  </Col>

                  <Col md="1">
                    <FormGroup className="mb-3">
                      <Input
                        type="hidden"
                        name="returned_by_id"
                        value={validation.values.returned_by_id || ""}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" className="pt-3 pb-1">
                    <h6>
                      <b>DISPATCH DETAILS</b>
                    </h6>
                  </Col>
                </Row>

                <Form className="needs-validation" onSubmit={handleSubmit}>
                  <Row>
                    <Col md="3">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom03">
                          Select Product
                        </Label>
                        <Input
                          name="product_id"
                          placeholder="Select Product"
                          type="select"
                          className={`form-control ${productError ? "is-invalid" : ""
                            }`}
                          onChange={handleProductChange}
                          value={selectedProductId}
                        >
                          <option value="">Select Product </option>
                          {createReturnStockInitialDataProducts?.map(
                            (item) => (
                              <option
                                value={item.product_id}
                                key={item.product_id}
                              >
                                {item?.product_name} - {item?.batch_no}
                              </option>
                            )
                          )}

                          {createReturnStockInitialData?.product_details
                            ?.filter(
                              (item) =>
                                !addedProducts.some(
                                  (added) => added.product_id == item.product_id
                                )
                            )
                            .map((item) => (
                              <option
                                value={item.product_id}
                                key={item.product_id}
                              >
                                {item?.product_name} - {item?.batch_no}
                              </option>
                            ))}
                        </Input>
                        <div className="invalid-feedback">{productError}</div>
                      </FormGroup>
                    </Col>
                    <Col md="3">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom03">Returned</Label>
                        <Input
                          name="return_reason"
                          placeholder="Add Returned"
                          type="select"
                          className={`form-control ${reasonError ? "is-invalid" : ""
                            }`}
                          onChange={handleReturnedReasonChange}
                          value={returnedReason}
                        >
                          <option value="">Select Reason</option>
                          {RETURN_REASON.map((item, index) => (
                            <option value={item.id} key={index}>
                              {item.name}
                            </option>
                          ))}
                        </Input>
                        <div className="invalid-feedback">{reasonError}</div>
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom03">RTO Qty.</Label>
                        <Input
                          name="rto_quantity"
                          placeholder="Add RTO Qty."
                          type="number"
                          className={`form-control ${quantityError ? "is-invalid" : ""
                            }`}
                          value={requiredQuantity}
                          onChange={handleQuantityChange}
                        />
                        <div className="invalid-feedback">{quantityError}</div>
                      </FormGroup>
                    </Col>
                    <Col md="3" className=" d-flex align-items-center">
                      <Button
                        color="primary"
                        className="ms-2 px-3"
                        onClick={handleSubmit}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <div className="table-responsive">
                        <Table className="table mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>Product & Batch</th>
                              <th>Reason</th>
                              <th>RTO Qty.</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {addedProducts?.map((item) => (
                              <>
                                <tr>
                                  <td>
                                    {item?.product_name}-{item?.batch_no}
                                  </td>
                                  <td>{item?.return_reason}</td>
                                  <td>{item?.rto_quantity}</td>
                                  <td>
                                    <Button
                                      color="light"
                                      onClick={() => handleRemoveItem(item)}
                                    >
                                      <span className="fas fa-trash-alt text-danger"></span>
                                    </Button>
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Col>
                  </Row>
                </Form>

                <Button color="primary" type="submit" className="mt-3">
                  Submit form
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default CreateRetuenStock;
