import React, { useState, useEffect } from "react";
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
  CardTitle,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import {
  API_BATCH_WISE_STOCK_SUMMARY,
  API_STATUS_WISE_STOCK_SUMMARY,
  API_STATUS_WISE_STOCK_SUMMARY_FOR_CWH,
} from "customhooks/All_Api/Apis";
const StockSummery = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [batchWiseData, setBatchWiseData] = useState([]);
  const [stateWiseData, setStateWiseData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(
    "Batch Wise Stock Summary"
  );
  // Local storage token Start
  const { config, first_name, last_name, department_type_name } =
    GetAuthToken();

  // Local storage token End
  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const selectBatchWiseOption = [
    { id: "Batch Wise Stock Summary", name: "Batch Wise Stock Summary" },
    { id: "Status Wise Stock Summary", name: "Status Wise Stock Summary" },
  ];

  // Search Filter Start


  // Pagenation Start
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Pagenation End

  

  const getBatchWiseData = async () => {
    try {
      const { data } = await axios.get(API_BATCH_WISE_STOCK_SUMMARY, config);
      console.log("data", data);
      setBatchWiseData(data.data);
    } catch (error) {
      console.error("Error fetching batch-wise data:", error);
      // Handle error, display a message, etc.
    }
  };
  
  const getStateWiseDataForCwh = async () => {
    try {
      const { data } = await axios.get(API_STATUS_WISE_STOCK_SUMMARY_FOR_CWH, config);
      console.log("getStateWiseDataForCwh", data);
      setStateWiseData(data.data);
    } catch (error) {
      console.error("Error fetching state-wise data for CWH:", error);
      // Handle error, display a message, etc.
    }
  };
  
  useEffect(() => {
    getBatchWiseData();
    getStateWiseDataForCwh();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Stock Summary</h3>
                  <Button className="px-4" color="primary">
                    Export
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
     

          {/* BATCH WISE STOCK SUMMARY START */}

          {selectedOption === "Batch Wise Stock Summary" && (
            <Row>
              <Col md="3">
                <FormGroup className="mb-3">
                  <Label htmlFor="validationCustom03">Returned</Label>
                  <Input
                    name="selectBatchWiseOption"
                    placeholder="Add Returned"
                    type="select"
                    onChange={handleSelectChange}
                    value={selectedOption}
                  >
                    {selectBatchWiseOption.map((item, index) => (
                      <option value={item?.id} key={index}>
                        {item?.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col xl={12}>
                <Card className="pb-5">
                  <CardBody>
                    <div className="table-responsive">
                      <Table className="align-middle ">
                        <thead className="table-light">
                          <tr>
                            <th>Product</th>
                            <th>Batch No.</th>
                            <th> Expiry Date </th>
                            <th>Available Stock</th>
                          </tr>
                        </thead>

                        <tbody>
                          {batchWiseData.map((item) => (
                            <tr>
                              <td>{item?.product_name}</td>
                              <td>{item?.batch_name}</td>
                              <td>{item?.expairy_date}</td>
                              <td>{item?.available_stock}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                  <TablePagination
                    className=" d-flex justfy-content-start"
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={batchWiseData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Card>
              </Col>
            </Row>
          )}
          {/* BATCH WISE STOCK SUMMARY END */}

          {/* STATUS WISE STOCK SUMMARY FOR CWH START */}
          {selectedOption === "Status Wise Stock Summary" && (
            <Row>
              <Col md="3">
                <FormGroup className="mb-3">
                  <Label htmlFor="validationCustom03">Returned</Label>
                  <Input
                    name="selectBatchWiseOption"
                    placeholder="Add Returned"
                    type="select"
                    onChange={handleSelectChange}
                    value={selectedOption}
                  >
                    {selectBatchWiseOption.map((item, index) => (
                      <option value={item?.id} key={index}>
                        {item?.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col xl={12}>
                <Card className="pb-5">
                  <CardBody>
                    <CardTitle className="h4 py-1">For CWH </CardTitle>
                    <div className="table-responsive">
                      <Table className="align-middle ">
                        <thead className="table-light">
                          <tr>
                            <th>Product</th>
                            <th>Batch </th>
                            <th> In-Transit </th>
                            <th>Available </th>
                          </tr>
                        </thead>

                        <tbody>
                          {stateWiseData?.map((item) => (
                            <tr>
                              <td>{item?.product_name}</td>
                              <td>{item?.batch_name}</td>
                              <td>{item?.transfer_quantity}</td>
                              <td>{item?.available}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                  <TablePagination
                    className=" d-flex justfy-content-start"
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    component="div"
                    count={stateWiseData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Card>
              </Col>
            </Row>
          )}
          {/* STATUS WISE STOCK SUMMARY END */}
        </Container>
      </div>
    </>
  );
};

export default StockSummery;
