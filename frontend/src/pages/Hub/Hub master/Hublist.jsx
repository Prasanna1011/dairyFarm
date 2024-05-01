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
import axios from "axios";
import { API_HUB_ADD_GET } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import LoaderPage from "components/Loader/LoaderPage";
const Hublist = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [hubListData, setHubListData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = hubListData.filter((item) => {
      const searchString = `${item.name} ${item.city}   ${item.cwh} ${item.hub_manager}`; // Add more properties as needed
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

  //   Fetch Data For Hub  Start
  const FetchHubListData = async () => {
    try {
      const { data } = await axios.get(API_HUB_ADD_GET, config);
      setHubListData(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  //   Fetch Data For Hub  End

  useEffect(() => {
    FetchHubListData();
  }, []);

  // Update filteredData when searchQuery changes
  useEffect(() => {
    handleSearch();
  }, [searchQuery, hubListData]);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
        {
          loading === true ?(<LoaderPage/>):(
            <>
              <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Hub Master</h3>
                  <Link to="/hub-list-add">
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
              className="rounded-4 w-25 border-0 shadow-sm bg-body-tertiary rounded px-3 "
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
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {(searchQuery
                          ? filteredData
                          : hubListData &&
                            hubListData.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                        ).map((item, index) => (
                          <tr key={item.id}>
                            <th scope="row"> {item.name} </th>
                            <td>{item.hub_manager}</td>
                            <td>{item.address}</td>
                            <td>{item.city}</td>
                            <td>{item.assigned_pincodes}</td>
                            <td>{item.assigned_delivery_boys}</td>
                            <td>
                              {item.is_active == true ? (
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
                              <Link to={`/hub-details/${item.id}`}>
                                <Button className="edit-button btn btn-sm btn-info ">
                                  <i className="fas fa-eye"></i>
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
                  count={hubListData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Col>
          </Row>
            </>
          )
        }
        </Container>
      </div>
    </>
  );
};

export default Hublist;
