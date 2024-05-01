// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardBody,
//   FormGroup,
//   Button,
//   Label,
//   Input,
//   FormFeedback,
//   Form,
//   Table,
//   CardText,
//   CardTitle,
//   Collapse,
//   Nav,
//   NavItem,
//   NavLink,
//   TabContent,
//   TabPane,
//   UncontrolledCollapse,
// } from "reactstrap";
// import CreateIndent from "./CreateIndent";
// import axios from "axios";
// import {
//   API_INDENT_GET,
//   API_INDENT_GET_LIST_OF_INDENT,
// } from "customhooks/All_Api/Apis";
// import { Link } from "react-router-dom";
// import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
// const Indent = () => {
//   const [createIndent, setcreateIndent] = useState(false);
//   const [indentData, setIndentData] = useState([]);

//   // Local storage token Start
//   const { config, first_name, last_name } = GetAuthToken();

//   // Local storage token End

//   function createIndentPopupToggle() {
//     setcreateIndent(!createIndent);
//   }
//   const getIndentData = async () => {
//     const { data } = await axios.get(API_INDENT_GET_LIST_OF_INDENT, config);
//     console.log("data", data.results);
//     setIndentData(data.results);
//   };

//   useEffect(() => {
//     getIndentData();
//   }, []);

//   return (
//     <>
//       <div className="page-content">
//         <Container fluid={true}>
//           <Row>
//             <Col xl={12}>
//               <Card>
//                 <CardBody className="d-flex justify-content-between">
//                   <h3>Indent</h3>

//                   <CreateIndent openPopup={createIndentPopupToggle} getIndentData={getIndentData} />

                  
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>

//           <Row>
//             <Col xl={12}>
//               <Card className="pb-5">
//                 <CardBody>
//                   <div className="table-responsive">
//                     <Table className="align-middle ">
//                       <thead className="table-light">
//                         <tr>
//                           <th>Indent No.</th>
//                           <th>Indent Date</th>
//                           <th> Requested by</th>
//                           <th> Total Products</th>
//                           <th> Total Qty.</th>
//                           <th>Status</th>
//                           <th>Actions</th>
//                         </tr>
//                       </thead>

//                       <tbody className="">
//                         {indentData?.map((item) => (
//                           <tr key={item.id}>
//                             <td>{item?.indent_no}</td>
//                             <td>{item?.indent_date}</td>
//                             <td>{item?.requested_by_name}</td>
//                             <td>{item?.total_products}</td>
//                             <td>{item?.total_quantity}</td>
//                             <td>{item?.status}</td>
//                             <td>
//                               <Link to={`/indent-detail/${item?.indent_no}`}>
//                                 <Button color="light" className="btn-sm">
//                                   <span className="fas fa-eye"></span>
//                                 </Button>
//                               </Link>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default Indent;

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
} from "reactstrap";
import CreateIndent from "./CreateIndent";
import axios from "axios";
import {
  API_INDENT_GET_LIST_OF_INDENT,
} from "customhooks/All_Api/Apis";
import { Link } from "react-router-dom";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import { TablePagination } from "@mui/material";
import LoaderPage from "components/Loader/LoaderPage";

const Indent = () => {
  const [loading, setLoading] = useState(true);
  const [createIndent, setCreateIndent] = useState(false);
  const [indentData, setIndentData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const { config } = GetAuthToken();

  const getIndentData = async () => {
    try {
      const { data } = await axios.get(API_INDENT_GET_LIST_OF_INDENT, {
        ...config,
        params: { page, page_size: pageSize },
      });
      setIndentData(data.results);
      setTotalPages(Math.ceil(data.count / pageSize));
      setLoading(false)
    } catch (error) {
      console.error("Error fetching indent data:", error);
    }
  };

  useEffect(() => {
    getIndentData();
  }, [page, pageSize]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(1);
  };

  const createIndentPopupToggle = () => {
    setCreateIndent(!createIndent);
  };

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
                  <h3>Indent</h3>
                  <CreateIndent
                    openPopup={createIndentPopupToggle}
                    getIndentData={getIndentData}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  <div className="table-responsive">
                    <Table className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Indent No.</th>
                          <th>Indent Date</th>
                          <th>Requested by</th>
                          <th>Total Products</th>
                          <th>Total Qty.</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {indentData.map((item) => (
                          <tr key={item.id}>
                            <td>{item.indent_no}</td>
                            <td>{item.indent_date}</td>
                            <td>{item.requested_by_name}</td>
                            <td>{item.total_products}</td>
                            <td>{item.total_quantity}</td>
                            <td>{item.status}</td>
                            <td>
                              <Link to={`/indent-detail/${item.indent_no}`}>
                               <Button className="btn-sm btn-info" color="info">
                                <span className="fas fa-eye"></span>
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
            </>)
          }
        </Container>
      </div>
    </>
  );
};

export default Indent;
