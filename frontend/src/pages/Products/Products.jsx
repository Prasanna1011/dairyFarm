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
import { API_BASE_URL, API_PRODUCT_POST_GET } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import LoaderPage from "components/Loader/LoaderPage";
const Products = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [productData, setProductData] = useState([]);

  // Local storage token Start
  const { config, first_name, last_name } = GetAuthToken();

  // Local storage token End

  // Search Filter Start

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    const searchData = productData.filter((item) => {
      const searchString = `${item.city} ${item.activated_on}   ${item.deactivated_on}`; // Add more properties as needed
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

  const getProductsAllData = async () => {
    const { data } = await axios.get(API_PRODUCT_POST_GET, config);
    setProductData(data.data);
    setLoading(false)
  };

  useEffect(() => {
    getProductsAllData();
  }, []);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
        {
          loading=== true ?(<LoaderPage/>):(<>
            <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Product List</h3>
                  <Link to="/products-add">
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
              className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded px-3 "
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
                          <th>Image</th>
                          <th>Product Name</th>
                          <th> Category</th>
                          <th> UOM</th>
                          <th> Product Type</th>
                          <th>Tax Rate</th>
                          <th>Rate</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {(searchQuery
                          ? filteredData
                          : productData &&
                            productData.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                        ).map((item, index) => (
                          <tr key={item.id}>
                            <td>
                              <div>
                                <img
                                  src={`${API_BASE_URL}${item.profile_picture} `}
                                  alt="Product"
                                  className="rounded-circle avatar-sm"
                                />
                              </div>
                            </td>
                            <td>{item.product_name}</td>
                            <td>{item.product_category}</td>
                            <td>{item.product_uom} </td>
                            <td> {item.product_type} </td>
                            <td> {item.tax_rate} </td>
                            <td> {item.product_rate} </td>

                            <td>
                              <Link to={`/products-view/${item.id}`}>
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
                  count={productData.length}
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

export default Products;
