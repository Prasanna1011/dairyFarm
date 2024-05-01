import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Modal,
  Table,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { toast } from "react-toastify";
import {
  API_PRODUCT_POST_GET,
  API_STOCK_GET_NEW,
  API_STOCK_GET_POST,
} from "customhooks/All_Api/Apis";
import axios from "axios";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import * as Yup from "yup";
import { useFormik } from "formik";
import { format } from "date-fns";
import LoaderPage from "components/Loader/LoaderPage";
const Stock = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [stockdata, setStockdata] = useState([]);
  const [productData, setProductData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [addStockModal, setaddStockModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [handleOpenFilter, setHandleOpenFilter] = useState(false);
  const [selectedProductData, setSelectedProductData] = useState(null); // State to hold selected product data
  const [expiryDate, setExpiryDate] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  console.log("expiryDate", expiryDate);

  console.log("handleOpenFilter", handleOpenFilter);

  function toggleCreateStock() {
    setaddStockModal(!addStockModal);
  }

  // Local storage token Start
  const { config, first_name, last_name,department_type_name, designation  } = GetAuthToken();

  // Pagenation Start
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(1);
  };
  const getAllStockData = async () => {
    
    try {
   
      const { data } = await axios.get(
        `${API_STOCK_GET_NEW}?from_date=${fromDate}&to_date=${toDate}`,
        {
          ...config,
          params: {
            page,
            page_size: pageSize,
          },
        }
      );
      const { results, count } = data;
      setStockdata(data.results);
      setTotalPages(Math.ceil(count / pageSize));
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log("setStockdata",stockdata);
  const getAllProdyctData = async () => {
    const { data } = await axios.get(API_PRODUCT_POST_GET, config);
    console.log(data);
    setProductData(data.data);
  };

  const showtodateGraterThanFromDate = () => {
    if (toDate && fromDate && toDate < fromDate) {
      toast.error(`To Date must be greater than or equal to From Date`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return false; // Return false to indicate the error
    }
    return true; // Return true if no error
  };

  const handleAddItem = () => {
    // Check if all required fields are filled
    const isValid = Object.values(validation.values).every(
      (value) => value !== ""
    );
    validation.resetForm();
    if (isValid) {
      // Check for duplicate batch number
      const isDuplicateBatch = selectedItems.some(
        (item) => item.batch_name === validation.values.batch_name
      );

      if (isDuplicateBatch) {
        // Display a message or take appropriate action for duplicate batch number
        toast.error(`Duplicate batch number is not allowed`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        getAllStockData();
      } else {
        // Add the selected item to the state
        setSelectedItems((prevItems) => [...prevItems, validation.values]);
        // Reset the form values
        validation.resetForm();
      }
    } else {
      // Display a message or take appropriate action for incomplete data
      console.log("Please fill in all required fields");
    }
  };

  const handleDeleteItem = (index) => {
    // Remove the item at the specified index
    setSelectedItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleSubmit = async () => {
    // Transform selectedItems into the desired format
    console.log("handle submit clicked");
    const formattedData = {
      product: selectedItems.map((item) => ({
        product: item.product,
        batch_name: item.batch_name,
        expairy_date: item.expairy_date
          ? format(new Date(item.expairy_date), "yyyy-MM-dd")
          : null,
        total_quantity: item.total_quantity,
      })),
    };

    console.log("formattedData1", formattedData);

    // Check if there are any products to submit
    if (formattedData.product.length === 0) {
      toast.error(`Add Select Stock `, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      return; // or handle it in a way that suits your logic
    }

    // Send API request with formatted data
    try {
      const response = await axios.post(
        API_STOCK_GET_POST,
        formattedData,
        config
      );
      toggleCreateStock();
      getAllStockData();

      console.log("response.data", response.data);
      setSelectedItems([]);
      toast.success(`Stock Added successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(`Something Went Wrong`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      product: "",
      batch_name: "",
      expairy_date: expiryDate || "",
      total_quantity: "",
    },
    validationSchema: Yup.object({
      product: Yup.string().required("Please Select Product"),
      batch_name: Yup.string().required("Please Enter Your Batch Name"),
      expairy_date: Yup.date().required("Please Enter Date"),

      total_quantity: Yup.string()
        .matches(/^\d+$/, "Please enter only numbers")
        .required("Please Enter Total Qty."),
    }),
    onSubmit: (values) => {
      console.log("values", values);
      setSelectedItems(values);
    },
  });

  console.log("setSelectedItems", selectedItems);

  useEffect(() => {
    getAllStockData();
    getAllProdyctData();
  }, [fromDate, toDate,page, pageSize]);

  useEffect(() => {
    const product = productData.find(
      (item) => item.id === parseInt(selectedProduct)
    );

    // Update the selected product data in the state
    setSelectedProductData(product);

    // Calculate the expiry date based on today's date and expiry_days
    if (product) {
      const today = new Date();
      const expiryDate = new Date(
        today.setDate(today.getDate() + product.expiry_days)
      );
      const formattedExpiryDate = format(expiryDate, "yyyy-MM-dd"); // Format the expiry date
      setExpiryDate(formattedExpiryDate);
    }
  }, [selectedProduct, productData]);
  const getProductNameById = (productId) => {
    const product = productData.find((item) => item.id === parseInt(productId));
    return product ? product.product_name : "";
  };


  return (
    <>
      <div className="page-content">
     {
      loading=== true ?(<LoaderPage/>):(<>
      
      <Container fluid={true}>
          {handleOpenFilter === true ? (
            <Row>
              <Card>
                <CardBody className="">
                  <Row>
                    <Col md="3">
                      <div className="mb-3">
                        <label htmlFor="joined_on" className="form-label">
                          From
                        </label>

                        <Flatpickr
                          id="from_date"
                          name="from_date"
                          placeholder="dd-mm-yyyy"
                          className="form-control"
                          options={{
                            dateFormat: "Y-m-d",
                          }}
                          onChange={(dates) => {
                            const formattedDate = format(
                              dates[0],
                              "yyyy-MM-dd"
                            );
                            setFromDate(formattedDate);
                            showtodateGraterThanFromDate(); // Call the function here
                          }}
                        />
                      </div>
                    </Col>
                    <Col md="3">
                      <div className="mb-3">
                        <label htmlFor="to_date" className="form-label">
                          to
                        </label>

                        <Flatpickr
                          id="to_date"
                          name="to_date"
                          placeholder="dd-mm-yyyy"
                          className="form-control"
                          options={{
                            dateFormat: "Y-m-d",
                          }}
                          onChange={(dates) => {
                            const formattedDate = format(
                              dates[0],
                              "yyyy-MM-dd"
                            );
                            setToDate(formattedDate);
                            showtodateGraterThanFromDate(); // Call the function here
                          }}
                        />
                      </div>
                    </Col>

                    <Col className="d-flex align-items-center mt-2">
                      <Button
                        color="danger"
                        onClick={() => {
                          setHandleOpenFilter(!handleOpenFilter);
                          setFromDate([]);
                          setToDate([]);
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Row>
          ) : (
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody className="d-flex justify-content-between">
                    <h3>Stock</h3>
                    <div>
                      

                      {
                        department_type_name.toLowerCase() === "cwh" ?<Button
                        className="px-4"
                        color="primary"
                        onClick={() => {
                          toggleCreateStock();
                        }}
                      >
                        Create
                      </Button> :""
                      }

                      <Button
                        className="px-4 ms-2"
                        color="info"
                        onClick={() => setHandleOpenFilter(!handleOpenFilter)}
                      >
                        Filter
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  <div className="table-responsive">
                    <Table className="align-middle ">
                      <thead className="table-light">
                        <tr>
                          <th>CWH</th>
                          <th>Product</th>
                          <th> Batch</th>
                          <th> Expiry Date</th>
                          <th> Total Qty.</th>
                          <th>Stock Date</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {stockdata?.map((item, index) => (
                          <tr key={item?.id}>
                            <td>{item?.CWH}</td>
                            <td>{item?.product_name}</td>
                            <td>{item?.batch_name}</td>
                            <td>{item?.expairy_date}</td>
                            <td>{item?.total_quantity}</td>
                            <td>{item?.stock_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <TablePagination
                  className="d-flex justify-content-start"
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  count={totalPages * pageSize}
                  rowsPerPage={pageSize}
                  page={page - 1}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Col>
          </Row>
        </Container>
      </>)
     }
      </div>

      {/* Add Stock Popup Start */}

      <Modal
        size="xl"
        isOpen={addStockModal}
        toggle={() => {
          toggleCreateStock();
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Add Stock</h5>
          <button
            type="button"
            onClick={() => {
              setaddStockModal(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
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
                    <Col md="3">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom01">Products</Label>
                        <Input
                          name="product"
                          placeholder="Select Products"
                          type="select"
                          className="form-control"
                          id="validationCustom01"
                          onChange={(e) => {
                            // Update the selected product in the state
                            setSelectedProduct(e.target.value);

                            validation.handleChange(e);
                          }}
                          onBlur={validation.handleBlur}
                          value={validation.values.product || ""}
                          invalid={
                            validation.touched.product &&
                            validation.errors.product
                              ? true
                              : false
                          }
                        >
                          <option value="" disabled>
                            Select a product
                          </option>
                          {productData
                            .filter(
                              (item) =>
                                item.product_classification.toLowerCase() ===
                                "saleable"
                            )
                            .map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.product_name}
                              </option>
                            ))}
                        </Input>
                        {validation.touched.product &&
                        validation.errors.product ? (
                          <FormFeedback type="invalid">
                            {validation.errors.product}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col md="2">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom02">Batch No</Label>
                        <Input
                          name="batch_name"
                          placeholder="Batch No"
                          type="text"
                          className="form-control"
                          id="validationCustom02"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.batch_name || ""}
                          invalid={
                            validation.touched.batch_name &&
                            validation.errors.batch_name
                              ? true
                              : false
                          }
                        />
                        {validation.touched.batch_name &&
                        validation.errors.batch_name ? (
                          <FormFeedback type="invalid">
                            {validation.errors.batch_name}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col md="2">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom03">Expiry Date</Label>
                        <Flatpickr
                          id="expairy_date"
                          name="expairy_date"
                          placeholder="dd-mm-yyyy"
                          className={`form-control ${
                            validation.touched.expairy_date &&
                            validation.errors.expairy_date
                              ? "is-invalid"
                              : ""
                          }`}
                          value={validation.values.expairy_date}
                          onChange={(selectedDates) => {
                            const formattedDate =
                              selectedDates.length > 0
                                ? format(selectedDates[0], "dd-MM-yyyy")
                                : "";
                            validation.setFieldValue(
                              "expairy_date",
                              formattedDate
                            );

                            // Pass the formatted date to another function or component
                            // For example, assuming you have a function to handle the formatted date
                          }}
                          options={{
                            dateFormat: "d-m-Y", // Use correct date format
                            minDate: new Date(), // Restrict selection to the current date
                          }}
                        />
                        {validation.touched.expairy_date &&
                        validation.errors.expairy_date ? (
                          <FormFeedback type="invalid">
                            {validation.errors.expairy_date}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <FormGroup className="mb-3">
                        <Label htmlFor="validationCustom04">Total Qty.</Label>
                        <Input
                          name="total_quantity"
                          placeholder="Total Quantity"
                          type="number"
                          className="form-control"
                          id="validationCustom04"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.total_quantity || ""}
                          invalid={
                            validation.touched.total_quantity &&
                            validation.errors.total_quantity
                              ? true
                              : false
                          }
                        />
                        {validation.touched.total_quantity &&
                        validation.errors.total_quantity ? (
                          <FormFeedback type="invalid">
                            {validation.errors.total_quantity}
                          </FormFeedback>
                        ) : null}
                      </FormGroup>
                    </Col>
                    <Col md="1" className=" d-flex align-items-center ">
                      <Button
                        color="primary"
                        className="px-4"
                        type="submit"
                        onClick={() => {
                          handleAddItem();
                        }}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <Card>
                        <CardBody>
                          <div className="table-responsive">
                            <Table className="table table-striped mb-0">
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Products</th>
                                  <th>Batch No</th>
                                  <th>Expiry Date</th>
                                  <th>Total Qty.</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedItems?.map((item, index) => (
                                  <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{getProductNameById(item.product)}</td>
                                    <td>{item.batch_name}</td>
                                    <td>{item.expairy_date}</td>
                                    <td>{item.total_quantity}</td>
                                    <td>
                                      <Button
                                        color="light"
                                        onClick={() => handleDeleteItem(index)}
                                      >
                                        <span className="fas fa-trash-alt text-danger"></span>
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>

                  <Button
                    color="primary"
                    type="submit"
                    onClick={handleSubmit} // Trigger the submit function
                  >
                    Submit form
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </div>
      </Modal>

      {/* Add Stock Popup End */}
    </>
  );
};

export default Stock;
