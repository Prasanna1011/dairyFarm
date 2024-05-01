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
import LoaderPage from "components/Loader/LoaderPage";

import { API_BASE_URL, API_HTML_SECTION_GET } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
const HTMLSection = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [htmlSectiondata, setHtmlSectionData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = htmlSectiondata.filter((item) => {
      const searchString = `${item.type} ${item.product_title}  
       ${item.product_name} ${item.description}`; // Add more properties as needed
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

  // get HTML section data start
  const getData = async () => {
    try {
      const { data } = await axios.get(API_HTML_SECTION_GET, config);
      // console.log(data.data);
      setHtmlSectionData(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching HTML section data:", error);
    }
  };

  // get HTML section data End

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="page-content">
        {loading === true ? (
          <LoaderPage />
        ) : (
          <>
            <Container fluid={true}>
              <Row>
                <Col xl={12}>
                  <Card>
                    <CardBody className="d-flex justify-content-between">
                      <h3>HTML Section</h3>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              {/*Search filter  */}

              <div className="d-flex mb-3 justify-content-center">
                <input
                  className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded px-3"
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
                              <th>Sr No.</th>
                              <th>Type</th>
                              <th> Image</th>
                              <th> Product Title</th>
                              <th> Product Name</th>
                              <th>Description</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody className="">
                            {(searchQuery
                              ? filteredData
                              : htmlSectiondata &&
                                htmlSectiondata.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                            ).map((item, index) => (
                              <tr key={item.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.type}</td>
                                <td>
                                  <img
                                    src={`${API_BASE_URL}${item.image}`}
                                    alt="Img"
                                    className="rounded-circle avatar-xs img-fluid"
                                  />
                                </td>
                                <td>{item.product_title}</td>
                                <td>{item.product_name}</td>
                                <td className="w-50">{item.description}</td>
                                <td>
                                  <Link to={`/html-section-edit/${item.id}`}>
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
                      count={
                        searchQuery
                          ? filteredData.length
                          : htmlSectiondata.length
                      }
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Card>
                </Col>
              </Row>
            </Container>
          </>
        )}
      </div>
    </>
  );
};

export default HTMLSection;
