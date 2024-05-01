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
  Table,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import axios from "axios";
import {
  API_AREA_GET_POST,
  API_CUSTOMERS_GET_LIST,
  API_CUSTOMERS_REGISTER_GET_POST,
} from "customhooks/All_Api/Apis";
import LoaderPage from "components/Loader/LoaderPage";
const CustomerList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [customresDetails, setCustomresDetails] = useState([]);
  const [areaAllData, setAreaAllData] = useState([]);
  const [customerType, setCustomerType] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);
  const [customerName, setCustomerName] = useState([]);
  const [handleOpenFilter, setHandleOpenFilter] = useState(false);

  // console.log("handleOpenFilter", handleOpenFilter);
  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  // Customers list get Start

  
  const getCustomersData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CUSTOMERS_GET_LIST}?customer_type=${customerType}&area_id=${selectedArea}&customer_name=${customerName}`,
        {
          ...config,
          params: {
            page: page + 1,
            page_size: rowsPerPage,
          },
        }
      );
      setCustomresDetails(data.results);
      setLoading(false)

      setTotalPages(Math.ceil(data.count / rowsPerPage));
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };
  // Customers list get End

 

  const getAreaData = async () => {
    const { data } = await axios.get(API_AREA_GET_POST, config);
    setAreaAllData(data.data);
    // console.log(areaAllData);
  };

 
  useEffect(() => {
    getCustomersData();
    getAreaData();
  }, [customerType, selectedArea, customerName,page, rowsPerPage, customerType, selectedArea, customerName]);

// console.log("customresDetails",customresDetails);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
 {
  loading === true ?(<LoaderPage/>):(<>
           {handleOpenFilter === true ? (
            <>
              <Card>
                <CardBody className="">
                  <Row>
                    <Col md="3">
                      <FormGroup className="mb-3">
                        <Label htmlFor="transfet_type">Customer Type</Label>
                        <Input
                          name="customer_type"
                          placeholder="customer_type"
                          type="select"
                          className="form-control"
                          id="validationCustom04"
                          onChange={(e) => setCustomerType(e.target.value)}
                        >
                          <option value=""></option>
                          <option value="Suscriber">Suscriber</option>
                          <option value="Registered">Registered</option>
                          <option value="Guest Buyer">Guest Buyer</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup className="mb-3">
                        <Label htmlFor="area_name">Area Name</Label>
                        <Input
                          name="area_name"
                          placeholder="Area Name"
                          type="select"
                          className="form-control"
                          id="validationCustom04"
                          onChange={(e) => setSelectedArea(e.target.value)}
                        >
                          <option value="">Select Area</option>
                          {areaAllData.map((item) =>
                            item.areas.map((area) => (
                              <option key={area?.id} value={area?.id}>
                                {area?.area}
                              </option>
                            ))
                          )}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup className="mb-3">
                        <Label htmlFor="transfet_type">
                          Search By Customer Name
                        </Label>
                        <Input
                          name="transfet_type"
                          placeholder="Customer Name"
                          type="text"
                          className="form-control"
                          id="validationCustom04"
                          // value={transferType}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </FormGroup>
                    </Col>

                    <Col className="d-flex align-items-center mt-2">
                      <Button
                        color="danger"
                        onClick={() => {setHandleOpenFilter(!handleOpenFilter);
                          setCustomerName([]);
                          setSelectedArea([]);
                          setCustomerType([]);}
                        }
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </>
          ) : (
            <>
              <Row>
                <Col xl={12}>
                  <Card>
                    <CardBody className="d-flex justify-content-between">
                      <h3>Customer List</h3>
                      <div>
                        <Link to="/add-customer">
                          <Button className="px-4" color="primary">
                            Create
                          </Button>
                        </Link>
                        <Button
                          className="px-4 ms-2"
                          color="light"
                          onClick={() => setHandleOpenFilter(!handleOpenFilter)}
                        >
                          Filter
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          )}


          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  <div className="table-responsive">
                    <Table className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Customer Name</th>
                          <th>Contact No.</th>
                          <th>City</th>
                          <th>Pincode</th>
                          <th>Area</th>
                          <th>Customer status</th>
                          <th>Customer Type</th>
                          <th>Customer Group</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {customresDetails.map((item, index) => (
                          <tr key={item.customer_id}>
                            <td>
                              <span>{item.first_name}</span>
                              <span className="ms-2">{item.last_name}</span>
                            </td>
                            <td>{item?.contact_no}</td>
                            <td>{item?.address?.city?.name}</td>
                            <td>{item?.address?.pincode?.code}</td>
                            <td>{item?.address?.area?.area_name}</td>
                            <td>{item?.customer_status}</td>
                            <td>{item?.customer_type}</td>
                            <td>{item?.customer_group?.customer_group_name}</td> 
                            <td className="d-flex">
                              <Link to={`/customer-detail/${item.customer_id}`}>
                                <Button className="btn btn-info btn-sm ms-1">
                                  <i className="fas fa-eye"></i>
                                </Button>
                              </Link>
                              <Link to={`/customer-edit/${item.customer_id}`}>
                                <Button
                                  className="btn btn-warning btn-sm ms-2"
                                  size="small"
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <TablePagination
            className="d-flex justify-content-start"
            rowsPerPageOptions={[5, 10, 25, 100, 150]}
            component="div"
            count={totalPages * rowsPerPage}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
              </Card>
            </Col>
          </Row>
  </>)
 }
        </Container>
      </div>
    </>
  );
};

export default CustomerList;
