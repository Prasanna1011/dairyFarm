import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
  Table,
  CardTitle,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import {
  API_STOCK_TRANSFERRED_GET_DATA,
  API_PRODUCT_POST_GET,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { toast } from "react-toastify";
const CreateStockTransfer = () => {
  const [createStockTransfer, setcreateStockTransfer] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState();
  const [selectedBatch, setSelectedBatch] = useState("");
  const [qtyToTransfer, setQtyToTransfer] = useState(0);
  const [qtyToTransferFixed, setQtyToTransferFixed] = useState(0);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [
    createTransferStockPredefineData,
    setCreateTransferStockPredefineData,
  ] = useState([]);
  const [transferredProducts, setTransferredProducts] = useState([]);

  const { config, first_name, last_name } = GetAuthToken();
  function createStockTransferPopupToggle() {
    setcreateStockTransfer(!createStockTransfer);
  }

  const handleBatchChange = (e) => {
    const batchName = e.target.value;
    setSelectedBatch(batchName);

    // Find the total_quantity in the stock data for the selected batch
    const selectedBatchData = createTransferStockPredefineData?.stock_data.find(
      (item) => item.batch_name === batchName
    );

    // If the selected batch data is found, set its total_quantity as the initial value
    const initialQuantity = selectedBatchData
      ? selectedBatchData.total_quantity
      : "";
    setQtyToTransfer(initialQuantity);
    setQtyToTransferFixed(initialQuantity);
  };

  const handleQtyChange = (e) => {
    const newQty = parseInt(e.target.value, 10); // Convert input value to integer
    if (!isNaN(newQty) && newQty >= 0 && newQty <= qtyToTransferFixed) {
      setQtyToTransfer(newQty);
    }
  };

  const handleAddStockData = () => {
    if (selectedProductId && selectedBatch && qtyToTransfer > 0) {
      const newProduct = {
        product_id: selectedProductId,
        product_name: productsData.find(
          (product) => product.id == selectedProductId
        )?.product_name,
        batch_name: selectedBatch,
        transfer_quantity: qtyToTransfer,
      };

      setTransferredProducts([...transferredProducts, newProduct]);
      setSelectedBatches([...selectedBatches, selectedBatch]);

      setSelectedProductId("");
      setSelectedBatch("");
      setQtyToTransfer(0);
    }
  };

  const handleDeleteItem = (index) => {
    const updatedTransferredProducts = [...transferredProducts];
    updatedTransferredProducts.splice(index, 1); // Remove the product at the specified index
    setTransferredProducts(updatedTransferredProducts);
  };

  console.log("selectedProductId", selectedProductId);
  console.log("selectedBatch", selectedBatch);
  console.log("qtyToTransfer", qtyToTransfer);
  console.log("transferredProducts", transferredProducts);
  // console.log(
  //   "createTransferStockPredefineData",
  //   createTransferStockPredefineData.stock_data
  // );

  const getCreateStockPredefinedData = async () => {
    try {
      const { data } = await axios.get(API_STOCK_TRANSFERRED_GET_DATA, config);
      setCreateTransferStockPredefineData(data.data);
      console.log(data.data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const getProductsData = async () => {
    try {
      const { data } = await axios.get(API_PRODUCT_POST_GET, config);
      setProductsData(data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  // Form validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      transfer_from_name:
        createTransferStockPredefineData?.transfer_from?.transfer_from_name ||
        "",
      transfer_from_id:
        createTransferStockPredefineData?.transfer_from?.transfer_from_id || "",
      transfer_to_id: "",
      transfer_to_name: "",
      // Transfer_by:
      //   createTransferStockPredefineData?.transfer_by?.transfer_by_name || "",
      transfer_by:
        createTransferStockPredefineData?.transfer_by?.transfer_by_id || "",
      transfer_by_name:
        createTransferStockPredefineData?.transfer_by?.transfer_by_name || "",
      product: [],
    },
    validationSchema: Yup.object({
      transfer_from_name: Yup.string().required("Please Enter Your First Name"),
      transfer_to_id: Yup.number().required("Please Enter Transfer To "),
      transfer_by_name: Yup.string().required("Please Enter Your Transfer_by"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Prepare the data to be submitted
        const formData = {
          transfer_from_id: values.transfer_from_id,
          transfer_from_name: values.transfer_from_name,
          transfer_to_id: values.transfer_to_id,
          transfer_to_name: createTransferStockPredefineData?.transfer_to?.find(
            (item) => item.transfer_to_id == values.transfer_to_id
          )?.transfer_to_name || "", // Set transfer_to_name based on transfer_to_id
          transfer_by: values.transfer_by,
          transfer_by_name: values.transfer_by_name,
          product: transferredProducts,
        };

        const { data } = await axios.post(
          API_STOCK_TRANSFERRED_GET_DATA,
          formData,
          config
        );
        console.log("data :", data);
        toast.success(` Stock Transfered Successfully `, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });

        validation.resetForm();
        setTransferredProducts([]);
        setcreateStockTransfer(false);
        setSelectedBatch([])
        setSelectedBatches([])
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    getCreateStockPredefinedData();
    getProductsData();
  }, []);

  return (
    <div>
      <Button
        type="button"
        color="primary"
        className="px-4"
        onClick={() => {
          createStockTransferPopupToggle();
        }}
      >
        Create
      </Button>

      <Modal
        size="lg"
        isOpen={createStockTransfer}
        toggle={() => {
          createStockTransferPopupToggle();
        }}
        centered
      >
        <div className="modal-header">
          <h5 className="modal-title mt-0">Stock Transfer</h5>
          <button
            type="button"
            onClick={() => {
              setcreateStockTransfer(false);
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
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
                          <Label htmlFor="validationCustom01">
                            Transfer From *
                          </Label>
                          <Input
                            name="transfer_from_name"
                            placeholder="First name"
                            type="text"
                            className="form-control"
                            id="validationCustom01"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.transfer_from_name || ""}
                            invalid={
                              validation.touched.transfer_from_name &&
                              validation.errors.transfer_from_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.transfer_from_name &&
                          validation.errors.transfer_from_name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.transfer_from_name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">
                            {" "}
                            Transfer To *
                          </Label>
                          <Input
                            name="transfer_to_id"
                            placeholder="Transfrt To"
                            type="select"
                            className="form-control"
                            id="validationCustom02"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.transfer_to_id || ""}
                            invalid={
                              validation.touched.transfer_to_id &&
                              validation.errors.transfer_to_id
                                ? true
                                : false
                            }
                          >
                            <option value="" disabled>
                              Transfer To
                            </option>
                            {createTransferStockPredefineData?.transfer_to?.map(
                              (item) => (
                                <>
                                  <option
                                    value={item?.transfer_to_id}
                                    key={item?.transfer_to_id}
                                  >
                                    {item?.transfer_to_name}
                                  </option>
                                </>
                              )
                            )}
                          </Input>
                          {validation.touched.transfer_to_id &&
                          validation.errors.transfer_to_id ? (
                            <FormFeedback type="invalid">
                              {validation.errors.transfer_to_id}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="4">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom04">
                            Transfer By *
                          </Label>
                          <Input
                            name="transfer_by_name"
                            placeholder="Transfer_by"
                            type="text"
                            className="form-control"
                            id="validationCustom04"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.transfer_by_name || ""}
                            invalid={
                              validation.touched.transfer_by_name &&
                              validation.errors.transfer_by_name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.transfer_by_name &&
                          validation.errors.transfer_by_name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.transfer_by_name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom04">
                            Select Product *
                          </Label>
                          <Input
                            name="product_id"
                            placeholder="Select Products"
                            type="select"
                            className="form-control"
                            id="validationCustom04"
                            onChange={(e) =>
                              setSelectedProductId(e.target.value)
                            }
                          >
                            <option value="">Select Products</option>
                            {productsData?.map((item) => (
                              <option value={item.id} key={item.id}>
                                {item.product_name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label htmlFor="batchSelect">Select Batch *</Label>
                          <Input
                            name="batch_name"
                            id="batchSelect"
                            type="select"
                            onChange={handleBatchChange}
                            value={selectedBatch}
                          >
                            <option value="">Select Batch</option>
                            {createTransferStockPredefineData?.stock_data
                              ?.filter(
                                (item) =>
                                  item.product_id == selectedProductId &&
                                  !selectedBatches?.includes(item.batch_name)
                              )
                              ?.map((item, index) => (
                                <option key={index} value={item.batch_name}>
                                  {item.batch_name}
                                </option>
                              ))}
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col md="3">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom04">
                            Qty To Transfer *
                          </Label>
                          <Input
                            name="batch_name"
                            placeholder="Qty"
                            type="number"
                            className="form-control"
                            id="validationCustom04"
                            value={qtyToTransfer} // Use state variable for value
                            onChange={handleQtyChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="3" className="d-flex align-items-center">
                        <Button
                          color="primary"
                          className=" px-4"
                          onClick={handleAddStockData}
                        >
                          Add
                        </Button>
                      </Col>
                    </Row>

                    {transferredProducts.length >= 1 ? (
                      <Row>
                        <Col lg={12}>
                          <Card>
                            <CardBody>
                              <CardTitle className="h4">
                                Selected stock for transfer
                              </CardTitle>

                              <div className="table-responsive">
                                <Table className="table mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>#</th>
                                      <th>Product</th>
                                      <th>Batch No.</th>
                                      <th>Qty.to transfer</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {transferredProducts.map(
                                      (product, index) => (
                                        <tr key={index}>
                                          <th scope="row">{index + 1}</th>
                                          <td>{product.product_name}</td>
                                          <td>{product.batch_name}</td>
                                          <td>{product.transfer_quantity}</td>
                                          <td>
                                            <Button
                                              color="light"
                                              onClick={() =>
                                                handleDeleteItem(index)
                                              }
                                            >
                                              <span className="fas fa-trash-alt text-danger"></span>
                                            </Button>
                                          </td>
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
                    ) : null}

                    <Button color="primary" type="submit">
                      Submit form
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default CreateStockTransfer;
