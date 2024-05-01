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
const Offers = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Local storage token Start
  const { config, first_name, last_name ,department_type_name} = GetAuthToken();

  // Local storage token End

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    // const searchData = deliveryBoysData.filter((item) => {
    //   // const searchString = `${item.city} ${item.activated_on}   ${item.deactivated_on}`; // Add more properties as needed
    //   return searchString.toLowerCase().includes(searchQuery.toLowerCase());
    // });
    // setFilteredData(searchData);
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

  // Update filteredData when searchQuery changes
  // useEffect(() => {
  //   handleSearch();
  // }, [searchQuery, hubListData]);
  return (
    <>
      <div className="page-content">
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
              className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded  px-3 "
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
                          <th>Hub Name</th>
                          <th>Hub Manager</th>
                          <th> Hub Address</th>
                          <th> Hub City</th>
                          <th> Pincodes</th>
                          <th>Delivery Boys</th>
                          <th>Hub Status</th>
                        </tr>
                      </thead>

                      {/* <tbody className="">
                        {(searchQuery
                          ? filteredData
                          : deliveryBoysData &&
                            deliveryBoysData.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                        ).map((item, index) => (
                          <tr key={item.id}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              {item.first_name} {item.last_name}
                            </td>
                          </tr>
                        ))}
                      </tbody> */}
                    </Table>
                  </div>
                </CardBody>
                <TablePagination
                  className=" d-flex justfy-content-start"
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  // count={deliveryBoysData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Offers;
