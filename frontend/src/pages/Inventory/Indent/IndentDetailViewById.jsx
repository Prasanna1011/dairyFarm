import React, { useState, useRef, useEffect } from "react";
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
  Table,
  Modal,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { TablePagination } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  API_BASE_URL,
  API_COMPANY_DETAILS_POST_GET,
  API_INDENT_CREATE_INWARD,
  API_INDENT_DISPATCH_DETAILS_GET_POST,
  API_INDENT_GET_BY_ID,
  API_INDENT_STATUS_APPROVE_ORREJECT,
  API_INDENT_STATUS_APPROVE_OR_REJECT,
  API_INDENT_TO_CREATE_OUTWARD,
  GET_OUTWARD_DATA,
} from "customhooks/All_Api/Apis";
import axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { toast } from "react-toastify";

const IndentDetailViewById = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [indentDataById, setIndentDataById] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [createOutwardPerdefinedData, setCreateOutwardPerdefinedData] =
    useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [printIndentInvoiceModal, setprintIndentInvoiceModal] = useState(false);
  const [createOutwardModal, setcreateOutwardModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [productWiseBatchData, setProductWiseBatchData] = useState([]);
  const [selectedProductWithBatchAndQty, setSelectedProductWithBatchAndQty] =
    useState([]);
  const [selectedBatchQty, setSelectedBatchQty] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedRequiredQty, setSelectedRequiredQty] = useState("");

  const [productError, setProductError] = useState("");
  const [batchError, setBatchError] = useState("");
  const [qtyError, setQtyError] = useState("");
  const [outwardQty, setOutwardQty] = useState("");
  const [reqQty, setReqQty] = useState("");

  //
  const [usedBatches, setUsedBatches] = useState([]);
  const [usedProducts, setUsedProducts] = useState([]);
  const [indentItems, setIndentItems] = useState([]);
  const [inwardCreateInitalData, setInwardCreateInitalData] = useState([]);
  const [totalProductQty, setTotalProductQty] = useState({});

  const [remainingQty, setRemainingQty] = useState(0);
  // console.log("selectedProductWithBatchAndQty", selectedProductWithBatchAndQty);
  const [createInwardModal, setcreateInwardModal] = useState(false);
  function createInwardToggle() {
    setcreateInwardModal(!createInwardModal);
  }

  useEffect(() => {
    const selectedBatchData = productWiseBatchData.find(
      (item) => item.batch_name === selectedBatch
    );

    // Update the quantity and expiry date when the batch changes
    if (selectedBatchData) {
      setSelectedBatchQty(selectedBatchData.total_quantity.toString());
      setExpiryDate(selectedBatchData.expairy_date);
    } else {
      // If the selected batch is not found, reset the quantity and expiry date
      setSelectedBatchQty("");
      setExpiryDate("");
    }
  }, [selectedBatch, productWiseBatchData]);

  ////////////////////////////////////////////////////////////////////

  function createOutwardTogle() {
    setcreateOutwardModal(!createOutwardModal);
  }

  const { config, first_name, last_name, department_type_name, designation } =
    GetAuthToken();

  function printIndentInvoiceToggle() {
    setprintIndentInvoiceModal(!printIndentInvoiceModal);
  }

  const navigate = useNavigate();
  const actions = [
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];
  const { id } = useParams();

  const getIndentDataById = async () => {
    const { data } = await axios.get(`${API_INDENT_GET_BY_ID}${id}/`, config);
    setIndentDataById(data.data);
  };

  const createOutwardGet = async () => {
    try {
      const { data } = await axios.get(`${GET_OUTWARD_DATA}${id}/`, config);
      setCreateOutwardPerdefinedData(data.data);
      setIndentItems(data.data.indent_no.indent_items);
      // console.log("createOutwardPerdefinedData", data.data);
    } catch (error) {
      console.error("Error fetching outward data:", error.message);
    }
  };

  // console.log("indentItems", indentItems);

  const getCompanyDetails = async () => {
    try {
      const { data } = await axios.get(API_COMPANY_DETAILS_POST_GET, config);

      setCompanyDetails(data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const handleIndentStatus = async () => {
    try {
      const { data } = await axios.post(
        `${API_INDENT_STATUS_APPROVE_OR_REJECT}${id}/`,
        { status: selectedAction },
        config
      );
      // console.log("API response:", data);

      toast.success(data.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      navigate("/indent");
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      console.error("Error updating indent status:", error.message);
    }
  };

  useEffect(() => {
    getIndentDataById();
    getCompanyDetails();
  }, []);

  // Pagenation Start

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      outward_by:
        createOutwardPerdefinedData?.outward_by?.outward_by_name || "",
      indent_no: createOutwardPerdefinedData?.indent_no?.indent_no || "",
      outward_from:
        createOutwardPerdefinedData?.outward_from?.outward_from_id || "",
      outward_from_name:
        createOutwardPerdefinedData?.outward_from?.outward_from_name || "",
      outward_to: createOutwardPerdefinedData?.outward_to?.outward_to_id || "",
      outward_to_name:
        createOutwardPerdefinedData?.outward_to?.outward_to_name || "",
      driver_name: "",
      vehicle_name: "",
      vehicle_no: "",
      comments: "",
      product: [],
    },
    validationSchema: Yup.object({
      indent_no: Yup.string().required("Indent No is required"),
      outward_by: Yup.string().required("Outward By is required"),
      outward_from: Yup.string().required("Outward From is required"),
      outward_from_name: Yup.string().required("Outward From Name is required"),
      outward_to: Yup.string().required("Outward To is required"),
      outward_to_name: Yup.string().required("Outward To Name is required"),
      driver_name: Yup.string().required("Driver Name is required"),
      vehicle_name: Yup.string().required("Vehicle Name is required"),
      vehicle_no: Yup.string().required("Vehicle No is required"),
      comments: Yup.string().required("Comments are required"),
      product: Yup.array()
        .of(
          Yup.object().shape({
            product_id: Yup.number().required("Product ID is required"),
            batch_no: Yup.string().required("Batch No is required"),
            expired_on: Yup.date().required("Expired On is required"),
            required_qty: Yup.number().required(
              "Required Quantity is required"
            ),
            outward_quantity: Yup.number().required(
              "Outward Quantity is required"
            ),
          })
        )
        .required("Product is required"),
    }),
    onSubmit: async (values) => {
      try {
        // Ensure that the product field is an array before mapping
        const products = selectedProductWithBatchAndQty?.map((item) => ({
          product_id: item.product,
          batch_no: item.batch,
          expired_on: item.expiryDate,
          required_qty: item.requiredQty,
          // outward_quantity:+item.qty
          outward_quantity: Number(item.qty),
        }));

        // Create the final payload
        const payload = {
          indent_no: values.indent_no,
          outward_by: values.outward_by,
          outward_from: values.outward_from,
          outward_from_name: values.outward_from_name,
          outward_to: values.outward_to,
          outward_to_name: values.outward_to_name,
          driver_name: values.driver_name,
          vehicle_name: values.vehicle_name,
          vehicle_no: values.vehicle_no,
          comments: values.comments,
          product: products,
        };

        // Now you can send the payload to your backend API
        console.log("Final Payload:", payload);

        // Send the API request with the payload
        const { data } = await axios.post(
          `${API_INDENT_TO_CREATE_OUTWARD}${id}/`,
          payload,
          config
        );
        navigate("/indent");
        toast.success(data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.error("Error in form submission:", error);
        // Handle the error as needed, e.g., display an error message to the user
      }
    },
  });

  useEffect(() => {
    const getIndentDispatchDetails = async () => {
      try {
        const { data } = await axios.post(
          API_INDENT_DISPATCH_DETAILS_GET_POST,
          {
            product: selectedProduct,
          },
          config
        );
        setProductWiseBatchData(data.data);
        console.log("productWiseBatchData", data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (selectedProduct) {
      getIndentDispatchDetails();
    }
  }, [selectedProduct]);

  const handleAddButtonClick = () => {
    setProductError("");
    setBatchError("");
    setQtyError("");

    // Validate required fields
    let isValid = true;

    if (!selectedProduct) {
      setProductError("Product is required");
      isValid = false;
    }

    if (!selectedBatch) {
      setBatchError("Batch is required");
      isValid = false;
    }
    if (!reqQty) {
      setReqQty("Required Qty not be null");
      isValid = false;
    }
    if (!outwardQty) {
      setOutwardQty("Outward Qty is Required");
      isValid = false;
    }

    if (!selectedBatchQty) {
      setQtyError("Qty Outward is required");
      isValid = false;
    } else if (isNaN(selectedBatchQty) || +selectedBatchQty <= 0) {
      setQtyError("Qty Outward must be a positive number");
      isValid = false;
    }

    if (!expiryDate) {
      setQtyError("Expiry Date is required");
      isValid = false;
    }

    if (isValid) {
      console.log("Form is valid. Proceed with your logic.");

      // Find the selected product in the response data
      const selectedProductItem =
        createOutwardPerdefinedData?.indent_no?.indent_items?.find(
          (item) => item.product_id === parseInt(selectedProduct)
        );

      if (selectedProductItem) {
        // Calculate the remaining required quantity by subtracting the added quantities
        const remainingQty =
          selectedProductItem.required_quantity -
          selectedProductWithBatchAndQty
            .filter((item) => item.product === selectedProduct)
            .reduce((totalQty, item) => totalQty + +item.qty, 0);

        // Check if the product's required quantity is fulfilled or exceeded
        if (remainingQty <= 0) {
          // Notify user that the requirement is fulfilled
          toast.success("Requirement is fulfilled for selected product");
          // Don't add to the state or reset form fields
          return;
        }

        // Create a new object with the selected data
        const newData = {
          product: selectedProduct,
          batch: selectedBatch,
          qty: selectedBatchQty,
          expiryDate: expiryDate,
          requiredQty: selectedRequiredQty?.total_demand,
        };

        // Update the state with the new data
        setSelectedProductWithBatchAndQty((prevData) => [...prevData, newData]);

        // Update the used batches
        setUsedBatches((prevBatches) => [...prevBatches, selectedBatch]);

        // Reset form fields
        setSelectedProduct("");
        setSelectedRequiredQty(null);
        setSelectedBatch("");
        setExpiryDate("");
        setSelectedBatchQty("");
      }
    } else {
      console.log("Form is not valid. Check error messages.");
    }
  };

  useEffect(() => {
    // Find the selected product in the response data
    const selectedProductItem =
      createOutwardPerdefinedData?.indent_no?.indent_items?.find(
        (item) => item.product_id === parseInt(selectedProduct)
      );

    if (selectedProductItem) {
      // Calculate the remaining required quantity by subtracting the added quantities
      const calculatedRemainingQty =
        selectedProductItem.required_quantity -
        selectedProductWithBatchAndQty
          .filter((item) => item.product === selectedProduct)
          .reduce((totalQty, item) => totalQty + +item.qty, 0);

      // Check if the product's required quantity is fulfilled or exceeded
      if (calculatedRemainingQty <= 0) {
        // Add the product to the usedProducts list
        setUsedProducts((prevProducts) => [...prevProducts, selectedProduct]);

        // Show toast message
        toast.success("Required quantity fulfilled for selected product!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000, // Close the toast after 3 seconds
        });
      }

      setRemainingQty(calculatedRemainingQty);

      setSelectedRequiredQty({
        ...selectedProductItem,
        required_quantity: calculatedRemainingQty,
      });
    } else {
      setSelectedRequiredQty(null);
      setRemainingQty(0);
    }
  }, [selectedProduct, selectedProductWithBatchAndQty]);

  const handleDeleteButtonClick = (index) => {
    // Get the batch of the item to be deleted
    const batchToDelete = selectedProductWithBatchAndQty[index].batch;

    // console.log(`Deleting item at index ${index}, Batch: ${batchToDelete}`);

    // Create a copy of the current state
    const updatedData = [...selectedProductWithBatchAndQty];

    // Remove the item at the specified index
    updatedData.splice(index, 1);

    // Update the state with the modified data
    setSelectedProductWithBatchAndQty(updatedData);

    // Remove the batch from the used batches list
    setUsedBatches((prevBatches) => {
      const updatedBatches = new Set(prevBatches);
      updatedBatches.delete(batchToDelete);
      return [...updatedBatches];
    });
  };

  const getInwardInitialData = async () => {
    const { data } = await axios.get(
      `${API_INDENT_CREATE_INWARD}${id}/`,
      config
    );
    console.log("getInwardInitialData", data.data);
    setInwardCreateInitalData(data.data);
  };
  // Create Inward validations Start

  const createInwardvalidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      indent_no: inwardCreateInitalData?.indent_no || "",
      outward_no: inwardCreateInitalData?.outward_no || "",
      indent: inwardCreateInitalData?.indent || "",
      outward: inwardCreateInitalData?.outward || "",
      outward_from:
        inwardCreateInitalData?.outward_from?.outward_from_name || "",
      outward_from_id:
        inwardCreateInitalData?.outward_from?.outward_from_id || "",
      inward_to_id: inwardCreateInitalData?.inward_to?.inward_to_id || "",
      inward_to: inwardCreateInitalData?.inward_to?.inward_to_name || "",
      inward_by_name: inwardCreateInitalData?.inward_by?.inward_by_name || "",
      inward_by: inwardCreateInitalData?.inward_by?.inward_by_id || "",
      product:
        inwardCreateInitalData?.products?.map((product) => ({
          product: product?.product_id,
          product_name: product?.product_name,
          batch_no: product?.batch_no,
          expairy_date: product?.expired_on,
          required_quantity: product?.required_qty,
          inward_quantity: product?.inward_quantity,
        })) || [],
    },
    validationSchema: Yup.object({
      indent_no: Yup.string(),
      outward_no: Yup.string(),
      outward_from: Yup.string(),
      inward_to_name: Yup.string(),
      inward_by_name: Yup.string(),
      product: Yup.array().of(
        Yup.object().shape({
          product: Yup.number().required(),
          batch_no: Yup.string().required(),
          expairy_date: Yup.date().required(),
          required_quantity: Yup.number().required(),
          inward_quantity: Yup.number().required(),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          `${API_INDENT_CREATE_INWARD}${id}/`,
          values,
          config
        );

        toast.success(data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/indent");
      } catch (error) {
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        console.error("Error in form submission:", error);
      }
    },
  });

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3> Indent Invoice Info</h3>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={8}>
              <Card className="pb-5">
                <CardBody>
                  <Row className="align-items-end">
                    {/* {indentDataById?.indent_data?.status === "Pending" && (
                      <>
                        <Col md={3}>
                          <FormGroup>
                            <Label for="actionSelect">Select Action</Label>
                            <Input
                              type="select"
                              id="actionSelect"
                              value={selectedAction}
                              onChange={(e) =>
                                setSelectedAction(e.target.value)
                              }
                            >
                              <option value="" disabled>
                                Select Action
                              </option>
                              {actions.map((action) => (
                                <option key={action.value} value={action.value}>
                                  {action.label}
                                </option>
                              ))}
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={3} className="mt-auto">
                          <FormGroup>
                            <Label>&nbsp;</Label>
                            <Button
                              type="button"
                              color="primary"
                              onClick={handleIndentStatus}
                            >
                              Submit
                            </Button>
                          </FormGroup>
                        </Col>
                      </>
                    )} */}
                    {department_type_name?.toLowerCase() === "cwh" &&
                      indentDataById?.indent_data?.status === "Pending" && (
                        <>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="actionSelect">Select Action</Label>
                              <Input
                                type="select"
                                id="actionSelect"
                                value={selectedAction}
                                onChange={(e) =>
                                  setSelectedAction(e.target.value)
                                }
                              >
                                <option value="" disabled>
                                  Select Action
                                </option>
                                {actions.map((action) => (
                                  <option
                                    key={action.value}
                                    value={action.value}
                                  >
                                    {action.label}
                                  </option>
                                ))}
                              </Input>
                            </FormGroup>
                          </Col>
                          <Col md={2} className="mt-auto">
                            <FormGroup>
                              <Label>&nbsp;</Label>
                              <Button
                                type="button"
                                color="primary"
                                onClick={handleIndentStatus}
                              >
                                Submit
                              </Button>
                            </FormGroup>
                          </Col>
                        </>
                      )}
                    <Col md={2} className="mt-auto">
                      <FormGroup>
                        <Label>&nbsp;</Label>
                        <Button
                          type="button"
                          color="primary"
                          className=" px-4"
                          onClick={() => {
                            printIndentInvoiceToggle();
                          }}
                        >
                          Print
                        </Button>
                      </FormGroup>
                    </Col>

                    {department_type_name?.toLowerCase() === "cwh" ? (
                           <Col md={6}>
                         
                           <button
                             className="btn btn-primary w-md mb-3 ms-2"
                             onClick={() => {
                               createOutwardGet();
                               createOutwardTogle();
                             }}
                           >
                             Create Outward
                           </button>
                         </Col>
                    ) : (
                 ""
                    )}
                    {department_type_name?.toLowerCase() === "hub" ? (
                           <Col md={6}>
                          
                          <button
   
                             className="btn btn-primary w-md mb-3 ms-2"
                             type="button"
                             onClick={() => {
                               createInwardToggle();
                               getInwardInitialData();
                             }}
                           >
                             Create Inward
                           </button>
                         </Col>
                    ) : (
                 ""
                    )}
                  </Row>

                  <div className="invoice-title"></div>
                  <hr />
                  <div className="table-responsive">
                    <Table className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Required Tomorrow</th>
                          <th>Available Qty</th>
                          <th>Total Demand</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(indentDataById?.indent_data?.indent_items || []).map(
                          (item) => (
                            <tr key={item.id}>
                              <td>{item?.product_name}</td>
                              <td>{item?.required_quantity}</td>
                              <td>{item?.available_quantity}</td>
                              <td>{item?.total_demand}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <TablePagination
                  className="d-flex justify-content-start"
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  count={indentDataById?.indent_items?.length || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Col>
            <Col xl={4}>
              <Card className="pb-5">
                <CardBody>
                  <h5>Comments : </h5>
                  <p className="ms-5">
                    {indentDataById?.indent_data?.comments}
                  </p>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* popup for invoice print Start */}

        <Modal
          size="xl"
          isOpen={printIndentInvoiceModal}
          toggle={() => {
            printIndentInvoiceToggle();
          }}
          className="modal-fullscreen"
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="exampleModalFullscreenLabel">
              Indent Invoice Info
            </h5>

            <Button
              color="light "
              className="me-5"
              onClick={() => window.print()}
            >
              <span className="fas fa-print"></span>
            </Button>
            <button
              onClick={() => {
                setprintIndentInvoiceModal(false);
              }}
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Row className="border-bottom pb-2 w-100">
              <Col md={6} className="">
                <img
                  className="rounded me-2"
                  alt="200x200"
                  width="200"
                  src={`${API_BASE_URL}${companyDetails.logo} `}
                  data-holder-rendered="true"
                />
              </Col>
              <Col md={6} className="d-flex  text-end">
                <div className="d-flex flex-column justify-content-end w-100">
                  <h4 className="">Indent No. : {indentDataById?.indent_no}</h4>
                  <p className="mt-0 pt-0">{companyDetails?.company_name}</p>
                  <p className="mt-0 pt-0">{companyDetails?.company_email}</p>
                  <p>GSTIN : {companyDetails?.GSTIN}</p>

                  {/* Add more details as needed */}
                </div>
              </Col>
            </Row>

            <Row className="w-100 mt-2 ">
              <Col md="6" className="   ">
                <div className="d-flex w-100">
                  <h5>Indent From : </h5>
                  <span className="ms-2">
                    {indentDataById?.requested_from?.name}
                  </span>
                </div>
                <div className="d-flex w-100">
                  <h5>Indent To : </h5>
                  <span className="ms-2">
                    {indentDataById?.requested_to?.name}
                  </span>
                </div>
              </Col>
              <Col md="6" className="d-flex ">
                <div className="d-flex justify-content-end w-100 text-end">
                  <h5 className="d-flex text-end">Issue Date : </h5>
                  <span className="ms-2 text-end">
                    {indentDataById?.indent_date}
                  </span>
                </div>
              </Col>
            </Row>
            <Row className="mt-2 w-100">
              <Table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Required Qty.</th>
                    <th>Batch No.</th>
                    <th>Expired On</th>
                    <th>Qty. Outward</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProductWithBatchAndQty?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product}</td>
                      <td>{item.required_quantity}</td>
                      <td>{item.batch}</td>
                      <td>{item.expiryDate}</td>
                      <td>{item.qty}</td>
                      <td>
                        <Button
                          color="light"
                          className="btn-sm"
                          onClick={() =>
                            handleDeleteButtonClick(index, item.batch)
                          }
                        >
                          <span className="fas fa-trash-alt text-danger"></span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Row>
            <Row className="w-100">
              <Col md="6" className="text-start">
                <p>Comments : </p>
                <p className="">{indentDataById?.comments}</p>
              </Col>
              <Col md="6" className="text-end">
                <h5> {indentDataById?.requested_from?.name} </h5>
                <p className="">Issued By</p>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* popup for invoice print End */}

        {/* Create Outward Popup Start */}

        <Modal
          size="lg"
          isOpen={createOutwardModal}
          toggle={() => {
            createOutwardTogle();
          }}
          centered
        >
          <div className="modal-header">
            <CardTitle className="modal-title mt-0">Create Outward</CardTitle>
            <button
              type="button"
              onClick={() => {
                setcreateOutwardModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Form
              className="needs-validation"
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <div></div>
              <Row>
                <Col md="4">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">Outward By</Label>
                    <Input
                      name="outward_by"
                      placeholder=""
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      disabled={true}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.outward_by || ""}
                      invalid={
                        validation.touched.outward_by &&
                        validation.errors.outward_by
                          ? true
                          : false
                      }
                    />
                    {validation.touched.outward_by &&
                    validation.errors.outward_by ? (
                      <FormFeedback type="invalid">
                        {validation.errors.outward_by}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">Indent No</Label>
                    <Input
                      name="indent_no"
                      placeholder=""
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      disabled={true}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.indent_no || ""}
                      invalid={
                        validation.touched.indent_no &&
                        validation.errors.indent_no
                          ? true
                          : false
                      }
                    />
                    {validation.touched.indent_no &&
                    validation.errors.indent_no ? (
                      <FormFeedback type="invalid">
                        {validation.errors.indent_no}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">Outward From</Label>
                    <Input
                      name="outward_from_name"
                      placeholder=""
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      disabled={true}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.outward_from_name || ""}
                      invalid={
                        validation.touched.outward_from_name &&
                        validation.errors.outward_from_name
                          ? true
                          : false
                      }
                    />
                    {validation.touched.outward_from_name &&
                    validation.errors.outward_from_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.outward_from_name}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">Outward To</Label>
                    <Input
                      name="outward_to_name"
                      placeholder=""
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      disabled={true}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.outward_to_name || ""}
                      invalid={
                        validation.touched.outward_to_name &&
                        validation.errors.outward_to_name
                          ? true
                          : false
                      }
                    />
                    {validation.touched.outward_to_name &&
                    validation.errors.outward_to_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.outward_to_name}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>

                <Col md="4">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">Driver Name *</Label>
                    <Input
                      name="driver_name"
                      placeholder="Enter Driver Name"
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.driver_name}
                      invalid={
                        validation.touched.driver_name &&
                        validation.errors.driver_name
                      }
                    />

                    {validation.touched.driver_name &&
                    validation.errors.driver_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.driver_name}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">Vehicle Name *</Label>
                    <Input
                      name="vehicle_name"
                      placeholder="Enter Vehicle Name "
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.vehicle_name || ""}
                      invalid={
                        validation.touched.vehicle_name &&
                        validation.errors.vehicle_name
                          ? true
                          : false
                      }
                    />
                    {validation.touched.vehicle_name &&
                    validation.errors.vehicle_name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.vehicle_name}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">Vehicle No *</Label>
                    <Input
                      name="vehicle_no"
                      placeholder="Enter Vehicle No "
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.vehicle_no || ""}
                      invalid={
                        validation.touched.vehicle_no &&
                        validation.errors.vehicle_no
                          ? true
                          : false
                      }
                    />
                    {validation.touched.vehicle_no &&
                    validation.errors.vehicle_no ? (
                      <FormFeedback type="invalid">
                        {validation.errors.vehicle_no}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col md="8">
                  <FormGroup className="mb-3">
                    <Label htmlFor="validationCustom01">Comments *</Label>
                    <Input
                      name="comments"
                      placeholder="Enter Comment"
                      type="text"
                      className="form-control"
                      id="validationCustom01"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.comments || ""}
                      invalid={
                        validation.touched.comments &&
                        validation.errors.comments
                          ? true
                          : false
                      }
                    />
                    {validation.touched.comments &&
                    validation.errors.comments ? (
                      <FormFeedback type="invalid">
                        {validation.errors.comments}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="4">
                  <FormGroup className="mb-3">
                    <Input
                      type="hidden"
                      name="outward_from_name"
                      value={validation.values.outward_from_name || ""}
                    />
                  </FormGroup>
                </Col>
                <Col md="4">
                  <FormGroup className="mb-3">
                    <Input
                      type="hidden"
                      name="outward_to"
                      value={validation.values.outward_to || ""}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row className=" border-top pb-3">
                <Col md="2">
                  <FormGroup className="mb-3 pt-3">
                    <Label htmlFor="validationCustom01">Select Product *</Label>
                    <Input
                      placeholder="Enter Vehicle No"
                      type="select"
                      className="form-control"
                      id="validationCustom01"
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      value={selectedProduct}
                      invalid={!!productError}
                    >
                      <option value="">Select Product</option>
                      {createOutwardPerdefinedData?.products?.map((item) => (
                        <option
                          key={item?.product_id}
                          value={item?.product_id}
                          className={`mb-3 pt-3 ${
                            selectedProduct === item?.product_id &&
                            remainingQty <= 0
                              ? "bg-danger"
                              : ""
                          }`}
                        >
                          {item?.product_name}
                        </option>
                      ))}
                    </Input>
                    <FormFeedback>{productError}</FormFeedback>
                  </FormGroup>
                </Col>

                {selectedProduct === null ? (
                  ""
                ) : (
                  <>
                    <Col md="2">
                      <FormGroup className="mb-3 pt-3">
                        <Label htmlFor="validationCustom01">
                          Required Qty *
                        </Label>
                        <Input
                          placeholder="Enter Vehicle No "
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                          invalid={!!qtyError}
                          value={selectedRequiredQty?.total_demand}
                        />
                        <FormFeedback>{reqQty}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup className="mb-3 pt-3">
                        <Label htmlFor="validationCustom01">
                          Select Batch *
                        </Label>
                        <Input
                          placeholder="Enter Vehicle No"
                          type="select"
                          className="form-control"
                          id="validationCustom01"
                          value={selectedBatch}
                          onChange={(e) => setSelectedBatch(e.target.value)}
                          invalid={!!batchError}
                        >
                          <option value="">Select Batch</option>
                          {productWiseBatchData
                            .filter(
                              (item) => !usedBatches.includes(item.batch_name)
                            )
                            .map((item, index) => (
                              <option key={index} value={item.batch_name}>
                                {item.batch_name}
                              </option>
                            ))}
                        </Input>
                        <FormFeedback>{batchError}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup className="mb-3 pt-3">
                        <Label htmlFor="validationCustom01">Expired On *</Label>
                        <Input
                          placeholder="Enter Expired On"
                          type="text"
                          className="form-control"
                          id="validationCustom01"
                          value={expiryDate}
                          invalid={!!qtyError}
                          readOnly
                        />
                        <FormFeedback>{qtyError}</FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup className="mb-3 pt-3">
                        <Label htmlFor="validationCustom01">
                          Qty Outward *
                        </Label>
                        <Input
                          placeholder="Enter Qty Outward"
                          type="number"
                          className="form-control"
                          id="validationCustom01"
                          value={selectedBatchQty}
                          onChange={(e) => setSelectedBatchQty(e.target.value)}
                          invalid={!!qtyError}
                        />
                        <FormFeedback>{outwardQty}</FormFeedback>
                      </FormGroup>
                    </Col>
                  </>
                )}

                <Col md="2" className="align-self-center">
                  <Button color="primary" onClick={handleAddButtonClick}>
                    Add
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col lg={12}>
                  <CardTitle className="h4">DISPATCH DETAILS</CardTitle>

                  <div className="table-responsive mt-3">
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Product</th>
                          <th>Required Qty.</th>
                          <th>Batch No.</th>
                          <th>Expired On</th>
                          <th>Qty. Outward</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProductWithBatchAndQty?.map((item, index) => {
                          // Find the corresponding product in indentItems based on product_id
                          const productDetails = indentItems?.find(
                            (indentItem) =>
                              indentItem.product_id == item.product
                          );

                          return (
                            <tr key={index}>
                              <td>{productDetails?.product_name}</td>
                              <td>{item.requiredQty}</td>
                              <td>{item.batch}</td>
                              <td>{item.expiryDate}</td>
                              <td>{item.qty}</td>
                              <td>
                                <Button
                                  color="light"
                                  className="btn-sm"
                                  onClick={() => handleDeleteButtonClick(index)}
                                >
                                  <span className="fas fa-trash-alt text-danger"></span>
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md="12" className="text-center mt-3">
                  <Button color="primary" type="submit" className=" px-4">
                    Dispatch
                  </Button>
                  <Button
                    color="danger"
                    className="ms-2 px-4"
                    onClick={() => createOutwardTogle()}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>

        {/* Create Outward Popup End */}

        {/* Create Inward Popup Start */}

        <Modal
          isOpen={createInwardModal}
          size="lg"
          toggle={() => {
            createInwardToggle();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Create Inward</h5>
            <button
              type="button"
              onClick={() => {
                setcreateInwardModal(false);
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <Card>
              <CardBody>
                <Form
                  className="needs-validation"
                  onSubmit={(e) => {
                    e.preventDefault();
                    createInwardvalidation.handleSubmit();
                    return false;
                  }}
                >
                  <Row>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom01">Indent No</Label>
                        <Input
                          name="indent_no"
                          placeholder="First name"
                          type="text"
                          className="form-control"
                          disabled={true}
                          id="validationCustom01"
                          onChange={createInwardvalidation.handleChange}
                          onBlur={createInwardvalidation.handleBlur}
                          value={createInwardvalidation.values.indent_no || ""}
                          invalid={
                            createInwardvalidation.touched.indent_no &&
                            createInwardvalidation.errors.indent_no
                              ? true
                              : false
                          }
                        />
                        {createInwardvalidation.touched.indent_no &&
                        createInwardvalidation.errors.indent_no ? (
                          <FormFeedback type="invalid">
                            {createInwardvalidation.errors.indent_no}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="createInwardvalidationCustom02">
                          Outward No
                        </Label>
                        <Input
                          name="outward_no"
                          placeholder="Outward No."
                          type="text"
                          className="form-control"
                          id="createInwardvalidationCustom02"
                          disabled={true}
                          onChange={createInwardvalidation.handleChange}
                          onBlur={createInwardvalidation.handleBlur}
                          value={createInwardvalidation.values.outward_no || ""}
                          invalid={
                            createInwardvalidation.touched.outward_no &&
                            createInwardvalidation.errors.outward_no
                              ? true
                              : false
                          }
                        />
                        {createInwardvalidation.touched.outward_no &&
                        createInwardvalidation.errors.outward_no ? (
                          <FormFeedback type="invalid">
                            {createInwardvalidation.errors.outward_no}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="createInwardvalidationCustom03">
                          Outward From
                        </Label>
                        <Input
                          name="Outward From"
                          placeholder="outward_from"
                          type="text"
                          className="form-control"
                          disabled={true}
                          onChange={createInwardvalidation.handleChange}
                          onBlur={createInwardvalidation.handleBlur}
                          value={
                            createInwardvalidation.values.outward_from || ""
                          }
                          invalid={
                            createInwardvalidation.touched.outward_from &&
                            createInwardvalidation.errors.outward_from
                              ? true
                              : false
                          }
                        />
                        {createInwardvalidation.touched.outward_from &&
                        createInwardvalidation.errors.outward_from ? (
                          <FormFeedback type="invalid">
                            {createInwardvalidation.errors.outward_from}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup className="mb-3">
                        <Label htmlFor="createInwardvalidationCustom04">
                          Inward To
                        </Label>
                        <Input
                          name="inward_to"
                          placeholder="inward_to"
                          type="text"
                          className="form-control"
                          id="createInwardvalidationCustom04"
                          disabled={true}
                          onChange={createInwardvalidation.handleChange}
                          onBlur={createInwardvalidation.handleBlur}
                          value={createInwardvalidation.values.inward_to || ""}
                          invalid={
                            createInwardvalidation.touched.inward_to &&
                            createInwardvalidation.errors.inward_to
                              ? true
                              : false
                          }
                        />
                        {createInwardvalidation.touched.inward_to &&
                        createInwardvalidation.errors.inward_to ? (
                          <FormFeedback type="invalid">
                            {createInwardvalidation.errors.inward_to}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col md="12">
                      <FormGroup className="mb-3">
                        <Label htmlFor="createInwardvalidationCustom05">
                          Inward By
                        </Label>
                        <Input
                          name="inward_by_name"
                          placeholder="inward_by_name"
                          type="text"
                          className="form-control"
                          id="createInwardvalidationCustom05"
                          disabled={true}
                          onChange={createInwardvalidation.handleChange}
                          onBlur={createInwardvalidation.handleBlur}
                          value={
                            createInwardvalidation.values.inward_by_name || ""
                          }
                          invalid={
                            createInwardvalidation.touched.inward_by_name &&
                            createInwardvalidation.errors.inward_by_name
                              ? true
                              : false
                          }
                        />
                        {createInwardvalidation.touched.inward_by_name &&
                        createInwardvalidation.errors.inward_by_name ? (
                          <FormFeedback type="invalid">
                            {createInwardvalidation.errors.inward_by_name}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="12">
                      <Card>
                        <CardBody>
                          <CardTitle className="h4 pb-3">
                            RECEIVED QTY.
                          </CardTitle>

                          <div className="table-responsive">
                            <Table className="table mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>Product</th>
                                  <th>Required Qty.</th>
                                  <th>Batch No.</th>
                                  <th>Expired On</th>
                                  <th>Qty. Inward</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inwardCreateInitalData?.products?.map(
                                  (item, index) => (
                                    <tr key={index}>
                                      <th>
                                        <input
                                          type="hidden"
                                          name="product"
                                          value={item?.product_id}
                                        />
                                        {item?.product_name}
                                      </th>
                                      <td>{item?.required_qty}</td>
                                      <td>{item?.batch_no}</td>
                                      <td>{item?.expired_on}</td>
                                      <td>{item?.outward_quantity}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </Table>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                  <Button color="primary" type="submit">
                    Submit form
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </div>
        </Modal>

        {/* Create Inward Popup End */}
      </div>
    </>
  );
};

export default IndentDetailViewById;
