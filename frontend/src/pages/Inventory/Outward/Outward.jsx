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
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import LoaderPage from "components/Loader/LoaderPage";
import { API_INDENT_OUTARD_GET_DATA, API_INDENT_OUTARD_GET_DATA_NEW } from "customhooks/All_Api/Apis";
const Outward = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchBy, setSearchBy] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [outwardData, setOutwardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const { config, first_name, last_name } = GetAuthToken();
  // Search Filter Start

  const searchInputRef = useRef(null);


const getOutwardData = async()=>{
  // const {data}= await axios.get(API_INDENT_OUTARD_GET_DATA, config)
  // setOutwardData(data.data)
  try {
   
    const { data } = await axios.get(
      `${API_INDENT_OUTARD_GET_DATA_NEW}?search_by=${searchBy}`,
      {
        ...config,
        params: {
          page,
          page_size: pageSize,
        },
      }
    );
    const { results, count } = data;
    
    setOutwardData(data.results);
    setTotalPages(Math.ceil(count / pageSize));
    setLoading(false)
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}



  // Pagenation Start
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(1);
  };




useEffect(() => {
  getOutwardData()
}, [ page, pageSize,searchBy])

  // Pagenation End
  return (
    <>
      <div className="page-content">
     {
      loading=== true ?(<LoaderPage/>):(<>
      
      <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Outward List</h3>
                  
                   
                    <div className="d-flex">
                    <Button className="px-4" color="primary">
                      Export
                    </Button>
                    <Col md="7" className="ms-2">
                        {/* <Label htmlFor="search_by">Batch No</Label> */}
                        <Input
                          name="search_by"
                          placeholder="Search by Outward or Indent.."
                          type="text"
                          className="form-control"
                          id="validationCustom02"
                      onChange={(e)=> setSearchBy(e.target.value)}
                        
                        />
                      
                    </Col>
                    </div>
                
                </CardBody>
              </Card>
            </Col>
          </Row>
      

          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  <div className="table-responsive">
                    <Table className="align-middle ">
                      <thead className="table-light">
                        <tr>
                          <th>Outward no.</th>
                          <th>Indent No.</th>
                 
                          <th> Outward To</th>
                          <th> Outward Date</th>
                          <th>Outward By</th>
                          <th> Status</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {outwardData &&
                          outwardData?.map((item, index) => (
                          <tr key={item.id}>
                            <th className="text-primary" scope="row"> <Link to={`/outward-detail/${item.outward_no}`}>
                            {item.outward_no}
                            </Link> </th>
                            <td>
                             {item.indent_no}
                            </td>
                            <td>
                             {item.outward_to_name}
                            </td>
                            <td>
                             {item.outward_date}
                            </td>
                            <td>
                             {item.outward_by}
                            </td>
                            <td>
                             {item.outward_status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
                <TablePagination
                  className="d-flex justify-content-start"
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
      </>)
     }

        
      </div>
    </>
  );
};

export default Outward;
