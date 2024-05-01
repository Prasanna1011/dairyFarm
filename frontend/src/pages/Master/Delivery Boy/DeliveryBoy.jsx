import React, { useEffect, useState, useRef } from "react";
import { TablePagination } from "@mui/material";
import {
  API_BASE_URL,
  API_DELIVERY_BOYS_POST_GET,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

import { Link } from "react-router-dom";
import {
  Button,
  Modal,
  CardBody,
  Table,
  Label,
  FormGroup,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Card,
  Form,
  FormFeedback,
  Badge,
  InputGroup,
  Container,
} from "reactstrap";
import LoaderPage from "components/Loader/LoaderPage";
import { CSVLink } from "react-csv";
import axios from "axios";
const DeliveryBoy = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deliveryBoysData, setDeliveryBoysData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  //  local storage token Start
  const { config, first_name, last_name } = GetAuthToken();
  //  local storage token End

  // get head Person Name Start
  const getDeliveryBoysAllData = async () => {
    const { data } = await axios.get(API_DELIVERY_BOYS_POST_GET, config);
    setDeliveryBoysData(data.data);
    setLoading(false)
  };
  // get head Person Name End


  // Pagenation Start
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Pagenation End
  useEffect(() => {
    getDeliveryBoysAllData();
  }, []);
  const csvData = deliveryBoysData.map((item) => ({
    Name: `${item.first_name} ${item.last_name}`,
    "Contact No.": item.contact_no,
    "Allocated Hub": item.allocated_hub,
    "Job Type": item.job_type,
    Manager: item.head_person,
    Status: item.is_active ? "Active" : "Inactive",
  }));

  const csvHeaders = [
    { label: "Name", key: "Name" },
    { label: "Contact No.", key: "Contact No." },
    { label: "Allocated Hub", key: "Allocated Hub" },
    { label: "Job Type", key: "Job Type" },
    { label: "Manager", key: "Manager" },
    { label: "Status", key: "Status" },
  ];

  return (
    <>
      {/*  */}
      <div className="page-content">
        <Container fluid={true}>
       {
        loading=== true ?(
          <LoaderPage/>
        ):(
          <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <h3>Delivery Boys</h3>
                <Link to="/master-add-delivery-boys">
                  <Button color="primary" className="px-4">
                    Create
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </Col>

          {/* CSV Button */}
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={"delivery_boys.csv"}
          >
            <Button color="primary" className="px-4">
              Export CSV
            </Button>
          </CSVLink>
          {/* CSV Button */}
          <Col xl={12}>
            <Card className="pb-5">
              <CardBody>
                <div className="table-responsive">
                  <Table className="align-middle ">
                    <thead className="table-light">
                      <tr>
                        <th>Image</th>
                        <th>Delivery Boy</th>
                        <th>Contact No.</th>
                        <th>Allocated Hub</th>
                        <th> Job Type</th>
                        <th>Manager</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody className="">
                      {(searchQuery
                        ? filteredData
                        : deliveryBoysData &&
                          deliveryBoysData.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                      ).map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <div>
                              <img
                                src={`${API_BASE_URL}${item.profile_picture} `}
                                alt="Profile"
                                className="rounded-circle avatar-sm"
                              />
                            </div>
                          </td>
                          <th className="text-primary">
                          <Link
                              to={`/master-delivery-boys-view/${item.delivery_boy_id}`}
                            >
                            {item.first_name} {item.last_name}
                            </Link>
                          </th>
                          <td>{item?.contact_no}</td>
                          <td>{item?.allocated_hub_name} </td>
                          <td>{item?.job_type} </td>
                          <td>{item?.head_person_name} </td>
                          <td>
                            {item?.is_active == true ? (
                              <button
                                type="button"
                                className="btn btn-success btn-sm "
                              >
                                <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                                Active
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-danger  btn-sm "
                              >
                                <i className="bx bx-block font-size-16 align-middle me-2"></i>
                                InActive
                              </button>
                            )}
                          </td>
                          <td>
                            {/* <Link
                              to={`/master-delivery-boys-view/${item.delivery_boy_id}`}
                            >
                              <Button className="edit-button btn btn-sm btn-info ">
                                <i className="fas fa-eye"></i>
                              </Button>
                            </Link> */}

                            <Link
                              to={`/master-delivery-boys/${item.delivery_boy_id}`}
                            >
                              <Button className="edit-button btn btn-sm btn-warning ms-2">
                                <i className="fas fa-pen"></i>
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
                className=" d-flex justfy-content-start"
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={deliveryBoysData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Col>
        </Row>
        )
       }
        </Container>
      </div>
    </>
  );
};

export default DeliveryBoy;
