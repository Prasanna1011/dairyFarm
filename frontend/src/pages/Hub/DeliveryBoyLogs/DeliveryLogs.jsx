import React, { useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  Container,
  Table,
  Modal,
  CardTitle,
  Input,
  Form,
  FormFeedback,
  Label,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import LoaderPage from "components/Loader/LoaderPage";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import { toast } from "react-toastify";
import {
  API_HUB_DELIVERYBOY_END_DAY,
  API_HUB_DELIVERYBOY_OR_DELIVERY_ASSISTANT_GET,
  API_HUB_DELIVERY_LOGS_GET,
  API_HUB_DELIVERY_LOGS_RETURN_STOCK,
  API_HUB_DELIVERY_LOGS_RETURN_STOCK_GET_POST,
  GET_BATCH_DATA_WHILE_EDIT_DELIVERED_QUANTITY,
  GET_DATA_TO_ALLOCATE_STOCK,
  VIEW_IF_STOCK_ALLOCATED_TO_DELIVERY_BOY,
} from "customhooks/All_Api/Apis";
import { CSVLink } from "react-csv";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import { format } from "date-fns";
import { useFormik } from "formik";
import * as Yup from "yup";

const DeliveryLogs = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryLogsData, setdeliveryLogsData] = useState([]);
  const [jobTypeDeliveryBoyData, setJobTypeDeliveryBoyData] = useState([]);
  const [deliveryAssistantData, setDeliveryAssistantData] = useState();
  const [taskLogModal, settaskLogModal] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deliveryBoyPopup, setdeliveryBoyPopup] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [editedQty, setEditedQty] = useState({});
  const [showAllocateButton, setShowAllocateButton] = useState();
  const [allocateStockModal, setAllocateStockModal] = useState(false);
  const [stockAllocationDataId, setStockAllocationDataId] = useState();
  const [stockAllocationDate, setStockAlloacationDate] = useState();
  const [dataForStockAllocation, setDataForStockAllocation] = useState();
  const [requiredQuantity, setRequiredQuantity] = useState();
  const [error, setError] = useState("");
  const [hubStockData, setHubStockData] = useState();
  const [assignedStock, setAssignedStock] = useState([]);
  const [returnDeliveryStockGetData, setReturnDeliveryStockGetData] = useState(
    []
  );
  const [allocatedStockToDeliveryBoy, setAllocateStockToDeliveryBoy] =
    useState();
  const [returnQty, setReturnQty] = useState("");
  const [returnQtyMap, setReturnQtyMap] = useState({});
  const [editDeliveryQuantityModal, setEditDeliveryQuantityModal] = useState();
  const [editQuantityNumber, setEditQuantityNumber] = useState();
  const [
    totalRequiredQuantityForEditForState,
    setTotalRequiredQuantityForEditForState,
  ] = useState();
  const [
    totalRequiredQuantityAfterOrderedQuantityForState,
    setTotalRequiredQuantityAfterOrderedQuantityForState,
  ] = useState();
  const [batchDataForEdit, setBatchDataForEdit] = useState();
  const [registerStockSubmitData, setRegisterStockSubmitData] = useState([]);
  const [productToRegisterStock, setProductToRegisterStock] = useState();
  const [itemIdToRegisterStock, setItemIdToRegisterStock] = useState();
  const [
    requiredQuantityForRegisterSubmit,
    setRequiredQuantityForRegisterSubmit,
  ] = useState();
  const [returnStockModal, setreturnStockModal] = useState(false);

  function returnStockToggle() {
    setreturnStockModal(!returnStockModal);
  }

  // console.log("editedQty", editedQty);
  // console.log("editDeliveryQuantityModal", editDeliveryQuantityModal);
  // console.log("EditMode", editMode);

  console.log("setReturnQty", returnQty);
  const submitAllottedStock = async () => {
    try {
      const { data } = await axios.post(
        `${GET_DATA_TO_ALLOCATE_STOCK}${stockAllocationDataId}/`,
        {
          allocated_data: assignedStock && assignedStock,
        },
        config
      );
      toast.success(`Stock Allocated successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setAllocateStockModal(false);
      setdeliveryBoyPopup(false);
      getDeliveryBoyTaskDetailData();
      setAssignedStock();
    } catch (error) {
      toast.error("Something went wrong while allocating stock", {
        position: "top-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const editDeliveryQuantityValidation = useFormik({
    initialValues: {
      batch: "",
      batch_allocated_qty: "",
    },
    validationSchema: Yup.object({
      batch: Yup.string().required("Batch is Required"),
      batch_allocated_qty: Yup.string().required(
        "Allocated Quantity is required"
      ),
    }),
    onSubmit: (values, { resetForm }) => {
      setRegisterStockSubmitData((registerStockSubmitData) => [
        ...registerStockSubmitData,
        values,
      ]);
      resetForm();
    },
  });

  useEffect(() => {
    if (editDeliveryQuantityValidation?.values?.batch) {
      const filteredBatchData =
        batchDataForEdit &&
        batchDataForEdit?.filter(
          (eachItem) =>
            eachItem?.batch_name ===
            editDeliveryQuantityValidation?.values?.batch
        )?.[0]?.total_quantity;
      editDeliveryQuantityValidation.setValues((values) => ({
        ...values,
        batch_allocated_qty: filteredBatchData,
      }));
    }
  }, [batchDataForEdit, editDeliveryQuantityValidation?.values?.batch]);

  const validation = useFormik({
    initialValues: {
      product_id: "",
      required_quantity: (requiredQuantity && requiredQuantity) || "",
      batch_no: "",
      allocated_qty: "",
    },
    validationSchema: Yup.object({
      product_id: Yup.string().required("Product is Required"),
      required_quantity: Yup.string().required("Quantity is required"),
      batch_no: Yup.string().required("Batch is Required"),
      allocated_qty: Yup.string().required("Selecting Quantity is Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      setAssignedStock((assignedStock) => [...assignedStock, values]);
      resetForm();
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (dataForStockAllocation) {
        const selectedProduct =
          dataForStockAllocation &&
          dataForStockAllocation?.products?.find(
            (eachItem) => eachItem?.product_id == validation?.values?.product_id
          );

        if (selectedProduct) {
          const quantity = selectedProduct?.required_quantity || "";

          setRequiredQuantity(quantity);

          validation.setValues((values) => ({
            ...values,
            required_quantity: quantity,
          }));
        }
      }
    };

    fetchData();
  }, [dataForStockAllocation, validation.values.product_id]);

  useEffect(() => {
    const fetchStockQuantity = async () => {
      if (validation.values.batch_no) {
        const stockQuantity =
          hubStockData &&
          hubStockData.filter(
            (eachItem) => eachItem.batch_name == validation.values.batch_no
          )[0]?.total_quantity;
        validation.setValues((values) => ({
          ...values,
          allocated_qty: stockQuantity,
        }));
      }
    };

    fetchStockQuantity();
  }, [dataForStockAllocation, validation.values.batch_no]);

  useEffect(() => {
    if (validation.values.product_id) {
      let filteredHubList =
        dataForStockAllocation &&
        dataForStockAllocation.stock_data.filter(
          (eachStock) => eachStock?.product_id == validation?.values?.product_id
        );
      setHubStockData(filteredHubList);
    }
  }, [validation?.values?.product_id]);

  function taskLogToggle() {
    settaskLogModal(!taskLogModal);
  }

  const handleEditClick = (itemId) => {
    setEditMode({ [itemId]: true });

    const itemToEdit = jobTypeDeliveryBoyData?.items.find(
      (item) => item.id === itemId
    );
    setEditedQty((prevEditedQty) => ({
      ...prevEditedQty,
      [itemId]: itemToEdit?.delivered_qty || "",
    }));
  };

  const handleSaveClick = async (itemId, deliveredQuantityNumber) => {
    let totalRequiredQuantityForEdit;
    let totalRequiredQuantityAfterOrderedQuantity;
    setEditMode((prevEditState) => ({ ...prevEditState, [itemId]: false }));

    if (deliveredQuantityNumber) {
      const total =
        parseInt(deliveredQuantityNumber) + parseInt(editQuantityNumber);
      totalRequiredQuantityForEdit = total;
    } else {
      const total = parseInt(0) + parseInt(editQuantityNumber);
      console.log("total in zero", total);
      totalRequiredQuantityForEdit = total;
    }
    if (deliveredQuantityNumber) {
      totalRequiredQuantityAfterOrderedQuantity =
        parseInt(totalRequiredQuantityForEdit) -
        parseInt(deliveredQuantityNumber);
    } else {
      totalRequiredQuantityAfterOrderedQuantity =
        parseInt(totalRequiredQuantityForEdit) - 0;
    }
    setTotalRequiredQuantityForEditForState(totalRequiredQuantityForEdit);
    setTotalRequiredQuantityAfterOrderedQuantityForState(
      totalRequiredQuantityAfterOrderedQuantity
    );
    try {
      const { data } = await axios.get(
        `${GET_BATCH_DATA_WHILE_EDIT_DELIVERED_QUANTITY}${itemId}`,
        config
      );
      setBatchDataForEdit(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  function toggleDeliveryBoy() {
    setdeliveryBoyPopup(!deliveryBoyPopup);
  }

  function tasklogToggle() {
    settaskLogModal(!taskLogModal);
  }

  const allocateStockModalToggle = async () => {
    try {
      setAllocateStockModal(!allocateStockModal);
      const { data } = await axios.get(
        `${VIEW_IF_STOCK_ALLOCATED_TO_DELIVERY_BOY}${stockAllocationDataId}/?date=${stockAllocationDate}`,
        config
      );
      setAllocateStockToDeliveryBoy(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (allocateStockModal === true && showAllocateButton === true) {
      const getDataForAllocation = async () => {
        try {
          const { data } = await axios.get(
            `${GET_DATA_TO_ALLOCATE_STOCK}${stockAllocationDataId}`,
            config
          );
          setDataForStockAllocation(data);
        } catch (error) {
          console.log(error);
        }
      };
      getDataForAllocation();
    }
  }, [allocateStockModal]);

  const handleReturnQtyChange = (itemId, value) => {
    setReturnQtyMap((prevState) => ({
      ...prevState,
      [itemId]: value,
    }));
  };

  const handleSubmitReturnStock = async () => {
    try {
      // Constructing the data format
      const stockData = Object.keys(returnQtyMap).map((itemId) => ({
        id: Number(itemId), // Ensure id is parsed as a number
        return_quantity: Number(returnQtyMap[itemId]), // Ensure return_quantity is parsed as a number
      }));
  
      // Wrap stockData in the desired object structure
      const payload = {
        stock_data: stockData,
      };
  
      console.log("Payload:", payload);
  
      const { data } = await axios.post(
        `${API_HUB_DELIVERY_LOGS_RETURN_STOCK_GET_POST}${selectedDeliveryBoy.delivery_boy.delivery_boy_id}/`,
        payload, // Send the payload instead of stockData
        config
      );
  
      console.log("Response data:", data);
      
      toast.success(data.message, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
  
      setreturnStockModal(false);
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
  };
  
  
  const prepareCSVData = () => {
    return (
      jobTypeDeliveryBoyData?.items?.map((item) => ({
        "Order No.": String(item.order_id),
        Customer: String(item.customer),
        "Customer Contact": String(item.delivery_boy?.contact_no || ""),
        Address: String(item.address),
        Product: String(item.product?.product_name || ""),
        Remarks: String(item.remarks || ""),
        "Remark Annotation": "",
        Hub: String(item.delivery_boy?.allocated_hub || ""),
        "Date of Delivery log": String(item.delivered_at || ""),
      })) || []
    );
  };

  const csvDataForDeliveryAssistant = () => {
    return (
      (deliveryAssistantData &&
        deliveryAssistantData?.items.map((eachItem) => ({
          "Task Id": String(eachItem.task_id),
          "Task Type": String(eachItem.task_type),
          "Order No": String(eachItem.order_id),
          "Customer Phone": String(eachItem.customer?.contact_no),
          Address: String(eachItem?.customer_address?.full_address),
          Status: String(eachItem?.task_status),
        }))) ||
      []
    );
  };

  const editDelivereyQuantitySubmit = async () => {
    const dataToSubmit = {
      allocated_qty: requiredQuantityForRegisterSubmit,
      total_required_qty: totalRequiredQuantityForEditForState,
      required_qty: totalRequiredQuantityAfterOrderedQuantityForState,
      batches: registerStockSubmitData.map((batch) => ({
        batch: batch.batch,
        allocated_qty: batch.batch_allocated_qty,
      })),
    };

    try {
      const { data } = await axios.put(
        `${GET_BATCH_DATA_WHILE_EDIT_DELIVERED_QUANTITY}${itemIdToRegisterStock}/`,
        dataToSubmit,
        config
      );
      toast.success(`Successful`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setEditDeliveryQuantityModal(false);
      getDeliveryAssistantData();
      getDeliveryBoyTaskDetailData();
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

  const { config } = GetAuthToken();

  const deliveryBoyEndDay = async (id) => {
    const requestData = {
      id: id,
    };

    try {
      const { data } = await axios.patch(
        `${API_HUB_DELIVERYBOY_END_DAY}`,
        requestData,
        config
      );
      getDeliveryLogs();
      toast.success(`Day ended successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.error("Error in deliveryBoyEndDay:", error);
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

  // Search Filter Start
  const searchInputRef = useRef(null);

  const handleSearch = () => {
    // Implement your search logic here
  };
  // Search Filter End

  // Pagenation Start
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // Pagenation End

  // get Delivery Logs data Start
  const getDeliveryLogs = async () => {
    try {
      const { data } = await axios.get(
        `${API_HUB_DELIVERY_LOGS_GET}${format(selectedDate, "yyyy-MM-dd")}`,
        config
      );
      setdeliveryLogsData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching delivery logs:", error);
      // Handle the error as needed
    }
  };
  const getReturnDeliveryStockGet = async (deliveryBoyId) => {
    try {
      const { data } = await axios.get(
        `${API_HUB_DELIVERY_LOGS_RETURN_STOCK_GET_POST}${selectedDeliveryBoy.delivery_boy.delivery_boy_id}`,
        config
      );
      console.log("getReturnDeliveryStockGet", data);
      setReturnDeliveryStockGetData(data);
    } catch (error) {
      console.error("Error fetching delivery logs:", error);
      // Handle the error as needed
    }
  };

  //
  // const getDeliveryBoyTaskDetailData = async (date, deliveryBoyId) => {
  //   const payload = {
  //     delivery_boy_id: deliveryBoyId,
  //     date: date,
  //   };
  //   console.log("payload", payload);

  //   const { data } = await axios.get(
  //     API_HUB_DELIVERYBOY_OR_DELIVERY_ASSISTANT_GET,
  //     config,
  //     payload
  //   );
  // };
  const getDeliveryBoyTaskDetailData = async (deliveryBoyId, date) => {
    try {
      const { data } = await axios.get(
        `${API_HUB_DELIVERYBOY_OR_DELIVERY_ASSISTANT_GET}?delivery_boy_id=${deliveryBoyId}&date=${date}`,
        config
      );
      setJobTypeDeliveryBoyData(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDeliveryAssistantData = async (deliveryBoyId, date) => {
    try {
      const { data } = await axios.get(
        `${API_HUB_DELIVERYBOY_OR_DELIVERY_ASSISTANT_GET}?delivery_boy_id=${deliveryBoyId}&date=${date}`,
        config
      );
      setDeliveryAssistantData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDeliveryBoyStockData = async (deliveryBoyId, date) => {
    try {
      const response = await axios.get(
        `${VIEW_IF_STOCK_ALLOCATED_TO_DELIVERY_BOY}${deliveryBoyId}/?date=${date}`,
        config
      );
      setShowAllocateButton(response.status === 204 ? true : false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDeliveryLogs();
  }, [selectedDate]);





  // Define the isSaveDisabled function here
  const isSaveDisabled = () => {
    // Check if any return quantity exceeds the total quantity
    return returnDeliveryStockGetData.some(item =>
      (returnQtyMap[item.id] || 0) > item.total_qty
    );
  };


  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Modal size="lg" isOpen={editDeliveryQuantityModal}>
            <div className="modal-header">
              <h5 className="modal-title mt-0">Register Stock</h5>
              <button
                type="button"
                onClick={() => {
                  setEditDeliveryQuantityModal(false);
                  setEditMode(true);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h6>
                Total Required Quantity : {totalRequiredQuantityForEditForState}
              </h6>
              <h6>
                Required Quantity:{" "}
                {totalRequiredQuantityAfterOrderedQuantityForState}
              </h6>
              <Form
                className="needs-validation"
                onSubmit={(e) => {
                  e.preventDefault();
                  editDeliveryQuantityValidation.handleSubmit();
                }}
              >
                <Row>
                  <Col lg={6}>
                    <Label htmlFor="selectBatchEdit">Select Batch*</Label>
                    <Input
                      type="select"
                      id="selectBatchEdit"
                      name="batch"
                      className="form-control"
                      onChange={editDeliveryQuantityValidation.handleChange}
                      onBlur={editDeliveryQuantityValidation.handleBlur}
                      value={editDeliveryQuantityValidation.values.batch || ""}
                      invalid={
                        editDeliveryQuantityValidation.touched.batch &&
                        editDeliveryQuantityValidation.errors.batch
                          ? true
                          : false
                      }
                    >
                      <option value="" disabled>
                        Select Batch
                      </option>

                      {batchDataForEdit &&
                        batchDataForEdit.map((eachItem, index) => (
                          <option key={index} value={eachItem.batch_name}>
                            {eachItem.batch_name}
                          </option>
                        ))}
                    </Input>
                    {editDeliveryQuantityValidation.touched.batch &&
                    editDeliveryQuantityValidation.errors.batch ? (
                      <FormFeedback type="invalid">
                        {editDeliveryQuantityValidation.errors.batch}
                      </FormFeedback>
                    ) : null}
                  </Col>

                  <Col lg={6}>
                    <Label htmlFor="batch_allocated_qty">Allocate Qty.*</Label>
                    <Input
                      type="number"
                      id="batch_allocated_qty"
                      name="batch_allocated_qty"
                      min={0}
                      max={totalRequiredQuantityAfterOrderedQuantityForState}
                      onBlur={editDeliveryQuantityValidation.handleBlur}
                      value={
                        editDeliveryQuantityValidation.values
                          .batch_allocated_qty
                      }
                      onChange={editDeliveryQuantityValidation.handleChange}
                      invalid={
                        editDeliveryQuantityValidation.touched
                          .batch_allocated_qty &&
                        editDeliveryQuantityValidation.errors
                          .batch_allocated_qty
                          ? true
                          : false
                      }
                    />
                    {editDeliveryQuantityValidation.touched
                      .batch_allocated_qty &&
                    editDeliveryQuantityValidation.errors
                      .batch_allocated_qty ? (
                      <FormFeedback type="invalid">
                        {
                          editDeliveryQuantityValidation.errors
                            .batch_allocated_qty
                        }
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>
                <button className="btn btn-sm btn-primary mt-1" type="submit">
                  Add
                </button>
              </Form>
              <div className="table-responsive w-100 mt-2">
                <Table>
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">Products</th>
                      <th className="text-center">Batch No.</th>
                      <th className="text-center">Allocated</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registerStockSubmitData &&
                      registerStockSubmitData.map((eachStock, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {productToRegisterStock && productToRegisterStock}
                          </td>
                          <td className="text-center">{eachStock.batch}</td>
                          <td className="text-center">
                            {eachStock.batch_allocated_qty}
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                const updatedItems =
                                  registerStockSubmitData &&
                                  registerStockSubmitData.filter(
                                    (i) => i.batch !== eachStock.batch
                                  );
                                setRegisterStockSubmitData(updatedItems);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
              <button
                className="btn btn-sm btn-primary"
                onClick={editDelivereyQuantitySubmit}
              >
                Save
              </button>
            </div>
          </Modal>
          {loading === true ? (
            <LoaderPage />
          ) : (
            <>
              <Row>
                <Col xl={12}>
                  <Card>
                    <CardBody className="d-flex justify-content-between align-items-center ">
                      <h3>Delivery Logs</h3>
                      <div className="d-flex  align-items-bottom ">
                        <div className=" d-flex align-items-bottom">
                          <Button className="px-4 me-2 mt-4" color="primary">
                            Export
                          </Button>
                        </div>
                        <div className="">
                          <label htmlFor="datepicker" className="form-label">
                            Select Date:
                          </label>
                          <Flatpickr
                            id="datepicker"
                            value={selectedDate}
                            onChange={(dates) => setSelectedDate(dates[0])}
                            options={{
                              dateFormat: "d-m-Y",
                              maxDate: new Date(),
                            }}
                            className="form-control"
                          />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xl={12}>
                  <Card className="pb-5">
                    <CardBody>
                      <div className="table-responsive">
                        <Table className="align-middle ">
                          <thead className="table-light">
                            <tr>
                              <th>Delivery Boy</th>
                              <th>Started At</th>
                              <th>Completed At</th>
                              <th> Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody className="">
                            {deliveryLogsData &&
                              deliveryLogsData?.map((item) => (
                                <>
                                  <tr key={item?.id}>
                                    <th
                                      style={{
                                        cursor: "pointer",
                                      
                                      }}
                                      className="text-primary"
                                    
                                      onClick={() => {
                                        setSelectedDeliveryBoy(item);
                                        toggleDeliveryBoy();
                                        taskLogToggle();
                                        getDeliveryAssistantData(
                                          item?.delivery_boy?.delivery_boy_id,
                                          item.date
                                        );
                                        getDeliveryBoyTaskDetailData(
                                          item?.delivery_boy?.delivery_boy_id,
                                          item.date
                                        );
                                        getDeliveryBoyStockData(
                                          item?.delivery_boy?.delivery_boy_id,
                                          item.date
                                        );
                                        setStockAllocationDataId(
                                          item?.delivery_boy?.delivery_boy_id
                                        );
                                        setStockAlloacationDate(item?.date);
                                        setSelectedDeliveryBoy(item);
                                      }}
                                    >
                                      {item?.delivery_boy?.first_name}{" "}
                                      {item?.delivery_boy?.last_name}
                                    </th>

                                    <td>
                                      {item?.started_at
                                        ? item?.started_at
                                        : "-"}
                                    </td>
                                    <td>
                                      {item?.completed_at
                                        ? item?.completed_at
                                        : "-"}
                                    </td>
                                    <td>{item?.status}</td>
                                    <td>
                                      {item?.started_at !==null  && item?.completed_at === null  ? (
                                        <Button
                                          color="primary"
                                          onClick={() =>
                                            deliveryBoyEndDay(item.id)
                                          }
                                        >
                                          End Day
                                        </Button>
                                      ): (
                                        <button className="btn bg-secondary bg-soft">
                                          End Day
                                        </button>
                                      ) }
                                    </td>
                                  </tr>
                                </>
                              ))}
                          </tbody>
                        </Table>
                      </div>
                    </CardBody>
                    <TablePagination
                      className=" d-flex justfy-content-start"
                      rowsPerPageOptions={[5, 10, 25, 100]}
                      component="div"
                      count={deliveryLogsData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Container>

        {/* Delivery boy Task Log Popup Start */}

        {selectedDeliveryBoy &&
        selectedDeliveryBoy?.delivery_boy?.job_type === "Delivery Boy" ? (
          <>
            <Modal
              size="xl"
              isOpen={deliveryBoyPopup}
              toggle={() => {
                toggleDeliveryBoy();
              }}
            >
              <div className="modal-header">
                {jobTypeDeliveryBoyData?.items?.length > 0 && (
                  <div className="d-flex justify-content-evenly  w-100">
                    <h5 className="modal-title mt-0" id="myModalLabel">
                      Delivery Boy:{" "}
                      {
                        jobTypeDeliveryBoyData?.items[0]?.delivery_boy
                          ?.first_name
                      }{" "}
                      {
                        jobTypeDeliveryBoyData?.items[0]?.delivery_boy
                          ?.last_name
                      }
                    </h5>
                    <h5 className="modal-title mt-0" id="myModalLabel">
                      Delivery Time:{" "}
                      {jobTypeDeliveryBoyData?.items[0]?.delivered_at}
                    </h5>
                    <h5 className="modal-title mt-0" id="myModalLabel">
                      Date: {jobTypeDeliveryBoyData?.items[0]?.assign_at}
                    </h5>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setdeliveryBoyPopup(false);
                  }}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body w-100">
                <div className="table-responsive w-100">
                  <Table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="text-center">No.</th>
                        <th className="text-center">Order No.</th>
                        <th className="text-center">Customer Name</th>
                        <th className="text-center">Address</th>
                        <th className="text-center">Product</th>
                        <th className="text-center">Ordered Qty.</th>
                        <th className="text-center">Delivered Qty</th>
                        <th className="text-center">Remarks</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(
                        jobTypeDeliveryBoyData && jobTypeDeliveryBoyData?.items
                      ) && jobTypeDeliveryBoyData?.items.length > 0 ? (
                        jobTypeDeliveryBoyData?.items.map((item, index) => (
                          <tr key={item.id}>
                            <th scope="row" className="text-center">
                              {index + 1}
                            </th>
                            <td className="text-center">{item?.order_id}</td>
                            <td className="text-center">{item?.customer}</td>
                            <td className="text-center">{item?.address}</td>
                            <td className="text-center">
                              {item?.product?.product_name}
                            </td>
                            <td className="text-center">{item?.ordered_qty}</td>
                            <td className="text-center">
                              {/* <input
                                type="number"
                                disabled={!editMode[item.id]}
                                value={
                                  editedQty[item.id] || item.delivered_qty
                                    ? item?.delivered_qty
                                    : 0 || ""
                                }
                                onChange={(e) => {
                                  setEditedQty((prevEditedQty) => ({
                                    ...prevEditedQty,
                                    [item.id]: e.target.value,
                                  }));
                                  setEditQuantityNumber(e.target.value);
                                }}
                                className="w-50"
                              /> */}
                              <input
                                type="number"
                                disabled={!editMode[item.id]}
                                value={
                                  editMode[item.id]
                                    ? editedQty[item.id] ||
                                      item?.delivered_qty ||
                                      ""
                                    : item?.delivered_qty || 0
                                }
                                onChange={(e) => {
                                  setEditedQty((prevEditedQty) => ({
                                    ...prevEditedQty,
                                    [item.id]: e.target.value,
                                  }));
                                  setEditQuantityNumber(e.target.value);
                                }}
                                className="w-50"
                              />
                            </td>
                            <td className="text-center">
                              {item?.remarks ? item?.remarks : "-"}
                            </td>
                            <td className="text-center">
                              {!editMode[item.id] ? (
                                <Button
                                  color="light"
                                  onClick={() => {
                                    handleEditClick(
                                      item.id,
                                      item.delivered_qty
                                    );
                                    setEditDeliveryQuantityModal(false);
                                  }}
                                >
                                  <span className="fas fa-pen"></span>
                                </Button>
                              ) : (
                                <Button
                                  color="primary"
                                  onClick={() => {
                                    handleSaveClick(item.id);
                                    setEditDeliveryQuantityModal(true);
                                    setProductToRegisterStock(
                                      item?.product?.product_name
                                    );
                                    setItemIdToRegisterStock(item.id);
                                    setRequiredQuantityForRegisterSubmit(
                                      item.ordered_qty
                                    );
                                  }}
                                >
                                  <span className="fas fa-save"></span>
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="modal-footer">
                <CSVLink
                  data={prepareCSVData()}
                  filename={`delivery_boy_export_${Date.now()}.csv`}
                  className="btn btn-primary"
                >
                  Export
                </CSVLink>
                <button
                  type="button"
                  onClick={() => {
                    toggleDeliveryBoy();
                  }}
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                {showAllocateButton === true ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => allocateStockModalToggle()}
                  >
                    Allocate Stock
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => allocateStockModalToggle()}
                  >
                    View Allocated Stock
                  </button>
                )}
              </div>
              ;
            </Modal>
          </>
        ) : selectedDeliveryBoy &&
          selectedDeliveryBoy?.delivery_boy?.job_type ===
            "Delivery Assistant" ? (
          <Modal
            size="xl"
            isOpen={taskLogModal}
            toggle={() => {
              taskLogToggle();
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0">Task Log</h5>
              <button
                type="button"
                onClick={() => {
                  settaskLogModal(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body  w-100 ">
              <Row className=" w-100">
                <Col md="6" className="text-start">
                  <h6>Delivery assistant name : </h6>
                  <h5>
                    {deliveryAssistantData &&
                      deliveryAssistantData?.items[0]?.assign_to &&
                      deliveryAssistantData?.items[0]?.assign_to?.first_name +
                        " " +
                        deliveryAssistantData?.items[0]?.assign_to?.last_name}
                  </h5>
                </Col>
                <Col md="6" className="text-end">
                  <h6>Date :</h6>
                  <h5>
                    {deliveryAssistantData &&
                    deliveryAssistantData?.items[0]?.task_date
                      ? deliveryAssistantData &&
                        deliveryAssistantData?.items[0]?.task_date
                      : "-"}
                  </h5>
                </Col>
              </Row>

              <div className="table-responsive w-100 mt-3">
                <Table className="table mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">Task Id</th>
                      <th className="text-center">Task type</th>
                      <th className="text-center">Order No.</th>
                      <th className="text-center">Customer Phone</th>
                      <th className="text-center">Address</th>
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryAssistantData &&
                      deliveryAssistantData.items.map((eachItem, index) => (
                        <tr key={index}>
                          <td className="text-center">{eachItem.task_id}</td>
                          <td className="text-center">
                            {eachItem.task_type ? eachItem.task_type : "-"}
                          </td>
                          <td className="text-center">{eachItem.order_id}</td>
                          <td className="text-center d-flex flex-column">
                            <div>
                              {eachItem.customer.first_name +
                                " " +
                                eachItem.customer.last_name}
                            </div>
                            <div>{eachItem.customer.contact_no}</div>
                          </td>
                          <td className="text-center">
                            {eachItem?.customer_address?.full_address}
                          </td>
                          <td className="text-center">
                            {eachItem.task_status}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <CSVLink
                  data={csvDataForDeliveryAssistant()}
                  filename={`delivery_assistant_export_${Date.now()}.csv`}
                  className="btn btn-primary"
                >
                  Export
                </CSVLink>
                <Button
                  color="info"
                  className="px-3"
                  onClick={() => {
                    getReturnDeliveryStockGet();
                    returnStockToggle();
                  }}
                >
                  Return Stock
                </Button>

                {showAllocateButton === true ? (
                  <button
                    type="button"
                    className="btn btn-primary px-2"
                    onClick={() => allocateStockModalToggle()}
                  >
                    Allocate Stock
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => allocateStockModalToggle()}
                  >
                    View Allocated Stock
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    tasklogToggle();
                  }}
                  className="btn btn-danger px-3"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        ) : (
          ""
        )}

        {showAllocateButton === true ? (
          <Modal
            size="lg"
            isOpen={allocateStockModal}
            toggle={() => {
              allocateStockModalToggle();
            }}
          >
            <div className="modal-header d-flex flex-column">
              <div className="m-2">
                <h4>Allocate Stock</h4>
              </div>
              <Form
                className="needs-validation"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                }}
              >
                <Row>
                  <Col lg={3}>
                    <Label htmlFor="SelectProduct">Select Product*</Label>
                    <Input
                      type="select"
                      name="product_id"
                      id="SelectProduct"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.product_id || ""}
                      invalid={
                        validation.touched.product_id &&
                        validation.errors.product_id
                          ? true
                          : false
                      }
                    >
                      <option value="" disabled>
                        Select Product
                      </option>
                      {dataForStockAllocation &&
                        dataForStockAllocation?.products?.map(
                          (eachProduct, index) =>
                            !assignedStock?.find(
                              (stock) =>
                                stock?.product_id == eachProduct?.product_id
                            ) && (
                              <option
                                key={index}
                                value={eachProduct.product_id}
                              >
                                {eachProduct.product_name}
                              </option>
                            )
                        )}
                    </Input>
                    {validation.touched.product_id &&
                    validation.errors.product_id ? (
                      <FormFeedback type="invalid">
                        {validation.errors.product_id}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col lg={3}>
                    <Label htmlFor="requiredQuantity">Required Quantity</Label>
                    <Input
                      type="text"
                      id="requiredQuantity"
                      placeholder="Required Quantity*"
                      name="required_quantity"
                      className="form-control"
                      value={validation.values.required_quantity || ""}
                      disabled
                    />
                  </Col>
                  <Col lg={3}>
                    <Label htmlFor="selectBatch">Select Batch*</Label>
                    <Input
                      type="select"
                      id="selectBatch"
                      name="batch_no"
                      className="form-control"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.batch_no || ""}
                      invalid={
                        validation.touched.batch_no &&
                        validation.errors.batch_no
                          ? true
                          : false
                      }
                    >
                      <option value="" disabled>
                        Select Batch
                      </option>
                      {hubStockData &&
                        hubStockData.map((eachItem, index) => (
                          <option key={index} value={eachItem.batch_name}>
                            {eachItem.batch_name}
                          </option>
                        ))}
                    </Input>
                    {validation.touched.batch_no &&
                    validation.errors.batch_no ? (
                      <FormFeedback type="invalid">
                        {validation.errors.batch_no}
                      </FormFeedback>
                    ) : null}
                  </Col>
                  <Col lg={3}>
                    <Label htmlFor="autoFetchQuantity">
                      AutoFetch Quantity
                    </Label>
                    <Input
                      type="number"
                      name="allocated_qty"
                      id="autoFetchQuantity"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.allocated_qty || ""}
                      invalid={
                        validation.touched.allocated_qty &&
                        validation.errors.allocated_qty
                          ? true
                          : false
                      }
                      min={requiredQuantity && requiredQuantity}
                    />
                    {validation.touched.allocated_qty &&
                    validation.errors.allocated_qty ? (
                      <FormFeedback type="invalid">
                        {validation.errors.allocated_qty}
                      </FormFeedback>
                    ) : null}
                  </Col>
                </Row>

                <button className="mt-3 btn btn-sm btn-primary" type="submit">
                  Add
                </button>
              </Form>

              <div className="table-responsive w-100 mt-2">
                <Table>
                  <thead className="table-light">
                    <tr>
                      <th>Products</th>
                      <th>Batch No.</th>
                      <th>Allocated</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedStock &&
                      assignedStock.map((eachStock, index) => (
                        <tr key={index}>
                          <td>
                            {dataForStockAllocation &&
                              dataForStockAllocation?.products?.filter(
                                (eachItem) =>
                                  eachItem.product_id == eachStock.product_id
                              )[0].product_name}
                          </td>
                          <td>{eachStock.batch_no}</td>
                          <td>{eachStock.allocated_qty}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                const updatedItems =
                                  assignedStock &&
                                  assignedStock?.filter(
                                    (i) => i.product_id !== eachStock.product_id
                                  );
                                setAssignedStock(updatedItems);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    <button
                      className="btn btn-sm btn-primary mt-2"
                      onClick={submitAllottedStock}
                    >
                      Save
                    </button>
                  </tbody>
                </Table>
              </div>
            </div>
          </Modal>
        ) : (
          <Modal
            size="lg"
            isOpen={allocateStockModal}
            toggle={() => {
              allocateStockModalToggle();
            }}
          >
            <div className="modal-header">
              <h4>Stock Allocation Status</h4>
            </div>
            <div className="modal-body">
              <div className="table-responsive w-100 mt-2">
                <Table>
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">Products</th>
                      <th className="text-center">Batch No.</th>
                      <th className="text-center">Allocated qty</th>
                      <th className="text-center">Returned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocatedStockToDeliveryBoy &&
                      allocatedStockToDeliveryBoy.map((eachItem, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            {eachItem.product.product_name}
                          </td>
                          <td className="text-center">{eachItem.batch_no}</td>
                          <td className="text-center">{eachItem.total_qty}</td>
                          <td className="text-center">{eachItem.return_qty}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Modal>
        )}

        {/* Retuen Stock Pupup Start  */}

        <Modal
          isOpen={returnStockModal}
          toggle={() => {
            returnStockToggle();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Return Stock</h5>
            <button
              type="button"
              onClick={() => {
                setreturnStockModal(false);
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
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <Table className="table mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Product</th>
                            <th>Batch No.</th>
                            <th>Total Qty.</th>
                            <th>Return Qty.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {returnDeliveryStockGetData &&
                            Array.isArray(returnDeliveryStockGetData) &&
                            returnDeliveryStockGetData.map((item) => (
                              <tr key={item?.id}>
                                <th scope="row">
                                  {item?.product?.product_name}
                                </th>
                                <td>{item?.batch_no}</td>
                                <td>{item?.total_qty}</td>
                                <td>
                                  <Input
                                    name="return_quantity"
                                    placeholder="Return Qty"
                                    type="number"
                                    className="form-control"
                                    value={returnQtyMap[item.id] || ""}
                                    onChange={(e) =>
                                      handleReturnQtyChange(
                                        item.id,
                                        e.target.value
                                      )
                                    }
                                  />
                                  {(returnQtyMap[item.id] || 0) >
                                    item.total_qty && (
                                    <span
                                      className="text-danger"
                                      style={{ fontSize: "11px" }}
                                    >
                                      Quantity exceeds
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          <tr>
                            <td colSpan="4">
                              {" "}
                              {/* Ensures the buttons span across all columns */}
                              <div className="d-flex justify-content-center mt-2">
                                <Button
                                  color="primary"
                                  className="px-3"
                                  onClick={handleSubmitReturnStock}
                                  disabled={isSaveDisabled()} // Check if save button should be disabled
                                >
                                  Save
                                </Button>
                                <Button
                                  color="danger"
                                  className="ms-2 px-3"
                                  onClick={() => {
                                    setreturnStockModal(false);
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Modal>

        {/* Retuen Stock Pupup End */}
      </div>
    </>
  );
};

export default DeliveryLogs;
