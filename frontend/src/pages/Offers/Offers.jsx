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
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import LoaderPage from "components/Loader/LoaderPage";

import {
  API_OFFERS_CANCEL,
  API_OFFERS_POST_GET,
} from "customhooks/All_Api/Apis";
import axios from "axios";
import { toast } from "react-toastify";
const Offers = () => {
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState(false);
  const [createdOn, setCreatedOn] = useState(false);

  // modal popus Start
  const modalToggle = () => setModal(!modal);
  // modal popus End

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = offers.filter((item) => {
      // const searchString = `${item.city} ${item.activated_on}   ${item.deactivated_on}`; // Add more properties as needed
      return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(searchData);
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

  // get offers all data start
  const getOffersData = async () => {
    const { data } = await axios.get(API_OFFERS_POST_GET, config);
    setOffers(data.data);
    setLoading(false)
  };
  // get offers all data End

  // Offer Cancel Function Start
  const cancelOffer = async () => {
    console.log("before api");
    try {
      const { data } = await axios.delete(
        `${API_OFFERS_CANCEL}${selectedId}/`,
        config
      );
      console.log("before after api");

      console.log("fetch all data start");
      getOffersData();
      console.log("fetch all data Done");

      console.log("success toast start");
      toast.success(`Offer  Cancelled successfully`, {
        position: "top-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(`Something went wrong`, {
        position: "top-center",
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };
  // Offer Cancel Function End

  useEffect(() => {
    getOffersData();
  }, []);

  return (
    <>
      <div className="page-content">
      {
        loading=== true?(<LoaderPage/>):(<>
          <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Offers List</h3>
                  <Link to="/offers-add">
                    <Button className="px-4" color="primary">
                      Create
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/*Search filter  */}
          <div className="d-flex mb-3 justify-content-center">
            <input
              className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded "
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
            {searchQuery.length >= 1 ? (
              <Button
                className="btn btn-sm "
                onClick={() => {
                  const input = searchInputRef.current;
                  if (input) {
                    input.select();
                    document.execCommand("cut");
                  }
                }}
              >
                <i className="fas fa-times"></i>
              </Button>
            ) : (
              <Button className=" btn btn-sm " onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </Button>
            )}
          </div>
          {/*  Search filter*/}
          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  <div className="table-responsive">
                    <Table className="align-middle ">
                      <thead className="table-light">
                        <tr>
                          <th>Created On</th>
                          <th>Customer Group</th>
                          <th> Coupon Code</th>
                          <th> Order Type </th>
                          <th> Min. Order Amount</th>
                          <th>Discount Rate in % </th>
                          <th>Validity</th>
                          <th>Usage Limit</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {(searchQuery
                          ? filteredData
                          : offers &&
                            offers.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                        ).map((item, index) => (
                          <tr key={item.id}>
                            <td>{item.created_on}</td>
                            <td>{item.customer_group}</td>
                            <td>{item.coupon_code}</td>
                            <td>{item.order_type}</td>
                            <td>{item.min_order_amount}</td>
                            <td>{item.discount_rate}</td>
                            <td>
                              {item.validity_from} To <br />
                              {item.validity_to}
                            </td>
                            <td>{item.usage_limit}</td>
                            <td>
                              {item.is_active === true ? "Active" : "Expired"}
                            </td>
                            <td>
                              <Button
                                onClick={() => {
                                  setSelectedId(item.id);
                                  modalToggle(item.id);
                                  setCreatedOn(item.min_order_amount);
                                }}
                                className="btn btn-danger btn-sm"
                              >
                                <i className="bx bx-window-close "></i>
                              </Button>
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
                  count={offers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Col>
          </Row>

          {/* Edit  Pincode Modal Popup start  */}

          <div>
            <Modal isOpen={modal} toggle={modalToggle}>
              <ModalHeader toggle={modalToggle}>Modal title</ModalHeader>
              <ModalBody>
                <br />
                <Row>
                  <Col md="6">
                    <h1>{createdOn}</h1>
                    Are you sure want to Cancel ?<h5></h5>
                    <Button color="primary" onClick={cancelOffer}>
                      yes
                    </Button>
                    <Button color="danger">No</Button>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
          </div>

          {/* Edit  Pincode Modal Popup End  */}
        </Container>
        </>)
      }
      </div>
    </>
  );
};

export default Offers;
