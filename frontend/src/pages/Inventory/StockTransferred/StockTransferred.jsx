import React, { useEffect, useState } from "react";
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Button,
  Label,
  Input,
} from "reactstrap";
import CreateStockTransfer from "./CreateStockTransfer";
import axios from "axios";
import { API_STOCK_TRANSFERRED_GET_DATA_FOR_TABLE_LIST } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { FormGroup, TablePagination } from "@mui/material";
import { format } from "date-fns";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import LoaderPage from "components/Loader/LoaderPage";

const StockTransferred = () => {
  const [createStockTransfer, setcreateStockTransfer] = useState([]);
  const [stockTransferredData, setStockTransferredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterOpen, setFilterOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transferType, setTransferType] = useState("All type of transfer");

  const { config, first_name, last_name, department_type_name, designation } =
    GetAuthToken();
  // Pagenation Start

  useEffect(() => {
    getStockTransferredData();
  }, [page, pageSize]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(1);
  };


  function createStockTransferPopupToggle() {
    setcreateStockTransfer(!createStockTransfer);
  }

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
  
  const getStockTransferredData = async () => {
    try {
      const response = await axios.get(API_STOCK_TRANSFERRED_GET_DATA_FOR_TABLE_LIST, {
        ...config,
        params: { page, page_size: pageSize, from_date: fromDate, to_date: toDate, transfer_type: transferType }
      });
      setStockTransferredData(response.data.results);
      setTotalPages(Math.ceil(response.data.count / pageSize));
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  console.log("fromDate", fromDate);
  console.log("toDate", toDate);


  useEffect(() => {
    getStockTransferredData();
  }, [fromDate, toDate, transferType]);
  

  
  return (
    <>
      <div className="page-content">
  {
    loading=== true ?(<LoaderPage/>):(
      <>
      
      <Container fluid={true}>
          {filterOpen === true ? (
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
                          const formattedDate = format(dates[0], "yyyy-MM-dd");
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
                      {/* <Flatpickr
                        id="to_date"
                        name="to_date"
                        placeholder="dd-mm-yyyy"
                        className="form-control "
                        options={{
                          dateFormat: "Y-m-d",
                        }}
                        onChange={(dates) => {
                          const formattedDate = format(dates[0], "yyyy-MM-dd");
                          setToDate(formattedDate);
                         
                        }}
                      /> */}

                      <Flatpickr
                        id="to_date"
                        name="to_date"
                        placeholder="dd-mm-yyyy"
                        className="form-control"
                        options={{
                          dateFormat: "Y-m-d",
                        }}
                        onChange={(dates) => {
                          const formattedDate = format(dates[0], "yyyy-MM-dd");
                          setToDate(formattedDate);
                          showtodateGraterThanFromDate(); // Call the function here
                        }}
                      />
                    </div>
                  </Col>
                  <Col md="3">
                    <FormGroup className="mb-3">
                      <Label htmlFor="transfet_type">Transfer Type</Label>
                      <Input
                        name="transfet_type"
                        placeholder="transfet_type"
                        type="select"
                        className="form-control"
                        id="validationCustom04"
                        value={transferType}
                        onChange={(e) => setTransferType(e.target.value)}
                      >
                        <option value="All type of transfer">
                          All type of transfer
                        </option>
                        <option value="Internal Transfer">
                          Internal Transfer
                        </option>
                        <option value="Indirect Transfer">
                          Indirect Transfer
                        </option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col className="d-flex align-items-center mt-2">
                    <Button
                      color="danger"
                      onClick={() => {
                        setFilterOpen(false);
                        setFromDate([]);
                        setToDate([]);
                        setTransferType("All type of transfer");
                      }}
                    >
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ) : (
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody className="d-flex justify-content-between">
                    <h3>Stock Transfer</h3>
                    <div className="d-flex">
                      <CreateStockTransfer
                        openPopup={createStockTransferPopupToggle}
                      />
                      <Button
                        className="ms-2 px-4"
                        color="info"
                        onClick={() => {
                          setFilterOpen(!filterOpen);
                        }}
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
                    <Table className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Document No.</th>
                          <th>Transferred On</th>
                          <th>Total Stock</th>
                          <th>Transferred From</th>
                          <th>Transferred To</th>
                          <th>Transferred By</th>
                        </tr>
                      </thead>

                      <tbody>
                        {stockTransferredData.map((item) => (
                          <tr key={item.index}>
                            <td>{item.document_no}</td>
                            <td>{item.transfer_date}</td>
                            <td>{item.total_stock}</td>
                            <td>{item.transfer_from_name}</td>
                            <td>{item.transfer_to_name}</td>
                            <td>{item.transfer_by_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <TablePagination
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
      </>
    )
  }
      </div>
    </>
  );
};

export default StockTransferred;
