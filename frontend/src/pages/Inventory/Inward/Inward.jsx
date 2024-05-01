import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Table, Button } from "reactstrap";
import axios from "axios";
import { TablePagination } from "@mui/material"; // Import TablePagination
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import CreateInward from "./CreateInward";
import {
  API_INDENT_INWARD_GET,
  API_INDENT_INWARD_GET_NEW,
} from "customhooks/All_Api/Apis";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { format } from "date-fns";
import { toast } from "react-toastify";
import LoaderPage from "components/Loader/LoaderPage";
const Inward = () => {
  const [loading, setLoading] = useState(true);
  const [inwardData, setInwardData] = useState([]);
  const [handleOpenFilter, setHandleOpenFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Local storage token Start
  const { config } = GetAuthToken();
  // Local storage token End

  const getInwardData = async () => {
    try {
     
      const { data } = await axios.get(
        `${API_INDENT_INWARD_GET_NEW}?from_date=${fromDate}&to_date=${toDate}`,
        {
          ...config,
          params: {
            page,
            page_size: pageSize,
          },
        }
      );
      setInwardData(data.results);
      setTotalPages(Math.ceil(data.count / pageSize));
      setLoading(false)
    } catch (error) {
      console.error("Error fetching indent data:", error);
    }
  };

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(1); // Reset page to 1 when changing rows per page
  };

  useEffect(() => {
    getInwardData();
  }, [page, pageSize, fromDate, toDate]);

  return (
    <>
      <div className="page-content">
{
loading === true ?(<LoaderPage/>):(<>

<Container fluid={true}>
          {handleOpenFilter === true ? (
            <Row>
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
                            const formattedDate = format(
                              dates[0],
                              "yyyy-MM-dd"
                            );
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

                        <Flatpickr
                          id="to_date"
                          name="to_date"
                          placeholder="dd-mm-yyyy"
                          className="form-control"
                          options={{
                            dateFormat: "Y-m-d",
                          }}
                          onChange={(dates) => {
                            const formattedDate = format(
                              dates[0],
                              "yyyy-MM-dd"
                            );
                            setToDate(formattedDate);
                            showtodateGraterThanFromDate(); // Call the function here
                          }}
                        />
                      </div>
                    </Col>

                    <Col className="d-flex align-items-center mt-2">
                      <Button
                        color="danger"
                        onClick={() => {
                          setHandleOpenFilter(!handleOpenFilter);
                          setFromDate([]);
                          setToDate([]);
                        }}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Row>
          ) : (
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody className="d-flex justify-content-between">
                    <h3>Inward</h3>
                    <div>
                      {/* <CreateInward /> */}

                      <Button
                        className="px-4 ms-2"
                        color="info"
                        onClick={() => setHandleOpenFilter(!handleOpenFilter)}
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
                          <th>Inward No</th>
                          <th>Outward No</th>
                          <th>Inward Date</th>
                          <th>Outward From</th>
                          <th>Inward To</th>
                        </tr>
                      </thead>

                      <tbody>
                        {inwardData?.map((item) => (
                          <tr key={item?.id}>
                            <td>{item?.inward_no}</td>
                            <td>{item?.outward}</td>
                            <td>{item?.inward_date}</td>
                            <td>{item?.outward_from}</td>
                            <td>{item?.inward_to}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  count={totalPages * pageSize} // Use total pages to calculate total count
                  rowsPerPage={pageSize}
                  page={page - 1} // Subtract 1 from page because MUI pagination starts from 0
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Col>
          </Row>
        </Container>
</>)
}
      </div>
    </>
  );
};

export default Inward;
