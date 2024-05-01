// import React, { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   FormGroup,
//   Button,
//   Label,
//   Input,
//   Container,
//   FormFeedback,
//   Form,
//   Table,
// } from "reactstrap";
// import { TablePagination } from "@mui/material";
// import CreateRetuenStock from "./CreateRetuenStock";
// import axios from "axios";
// import { API_RETURN_STOCK_GET_DATA } from "customhooks/All_Api/Apis";
// import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

// const ReturnStock = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(20);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [createReturnStock, setcreateReturnStock] = useState([]);
//   const [returnStockData, setReturnStockData] = useState([]);

//   const { config, first_name, last_name } = GetAuthToken();

//   function createReturnStockPopupToggle() {
//     setcreateReturnStock(!createReturnStock);
//   }
//   // Search Filter Start

//   const searchInputRef = useRef(null);

//   const handleSearch = () => {
//     // const searchData = deliveryBoysData.filter((item) => {
//     //   // const searchString = `${item.city} ${item.activated_on}   ${item.deactivated_on}`; // Add more properties as needed
//     //   return searchString.toLowerCase().includes(searchQuery.toLowerCase());
//     // });
//     // setFilteredData(searchData);
//   };

//   // Search Filter End
//   // Pagenation Start
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   // Pagenation End

//   const getReturnStockData = async () => {
//     try {
//       const { data } = await axios.get(API_RETURN_STOCK_GET_DATA, config);
//       console.log("getReturnStockData", data);
//       setReturnStockData(data.results);
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   useEffect(() => {
//     getReturnStockData();
//   }, []);

//   return (
//     <>
//       <div className="page-content">
//         <Container fluid={true}>
//           <Row>
//             <Col xl={12}>
//               <Card>
//                 <CardBody className="d-flex justify-content-between">
//                   <h3>Returned Stock</h3>
//                   <CreateRetuenStock openPopup={createReturnStockPopupToggle} getReturnStockData={getReturnStockData} />
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//           {/*Search filter  */}

//           <div className="d-flex mb-3 justify-content-center">
//             <input
//               className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded ps-3 "
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               ref={searchInputRef}
//             />
//             {searchQuery.length >= 1 ? (
//               <Button
//                 className="btn btn-sm "
//                 onClick={() => {
//                   const input = searchInputRef.current;
//                   if (input) {
//                     input.select();
//                     document.execCommand("cut");
//                   }
//                 }}
//               >
//                 <i className="fas fa-times"></i>
//               </Button>
//             ) : (
//               <Button className=" btn btn-sm " onClick={handleSearch}>
//                 <i className="fas fa-search"></i>
//               </Button>
//             )}
//           </div>

//           {/*  Search filter*/}

//           <Row>
//             <Col xl={12}>
//               <Card className="pb-5">
//                 <CardBody>
//                   <div className="table-responsive">
//                     <Table className="align-middle">
//                       <thead className="table-light">
//                         <tr>
//                           <th>R.Outward No.</th>
//                           <th>R.Inward No.</th>
//                           <th>Outward To</th>
//                           <th>Hub City</th>
//                           <th>Outward date</th>
//                           <th>Status</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {returnStockData?.map((item) => (
//                           <tr key={item?.return_outward_no}>
//                             <td>{item?.return_outward_no}</td>
//                             <td>{item?.return_inward_no }</td>
//                             <td>{item?.return_outward_to}</td>
//                             <td>{item?.return_outward_from}</td>
//                             <td>{item?.return_outward_date}</td>
//                             <td>{item?.return_status}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   </div>
//                 </CardBody>
//                 <TablePagination
//                   className=" d-flex justfy-content-start"
//                   rowsPerPageOptions={[5, 10, 25, 100]}
//                   component="div"
//                   count={returnStockData.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                 />
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default ReturnStock;


import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Table,
} from "reactstrap";
import { TablePagination } from "@mui/material";
import CreateRetuenStock from "./CreateRetuenStock";
import { API_RETURN_STOCK_GET_DATA } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import LoaderPage from "components/Loader/LoaderPage";

const ReturnStock = () => {
  const [returnStockData, setReturnStockData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { config } = GetAuthToken();

  const fetchData = async () => {
    try {
      const response = await axios.get(API_RETURN_STOCK_GET_DATA, {
        ...config,
        params: { page, page_size: pageSize },
      });
      const { results, count } = response.data;
      setReturnStockData(results);
      setTotalPages(Math.ceil(count / pageSize));
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(+event.target.value);
    setPage(1);
  };

  return (
    <>
      <div className="page-content">
     {
      loading === true ?(<LoaderPage/>):(<>
      
      <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Returned Stock</h3>
                  <CreateRetuenStock />
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
                          <th>R.Outward No.</th>
                          <th>R.Inward No.</th>
                          <th>Outward To</th>
                          <th>Hub City</th>
                          <th>Outward date</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {returnStockData.map((item) => (
                          <tr key={item.return_outward_no}>
                            <td>{item.return_outward_no}</td>
                            <td>{item.return_inward_no}</td>
                            <td>{item.return_outward_to}</td>
                            <td>{item.return_outward_from}</td>
                            <td>{item.return_outward_date}</td>
                            <td>{item.return_status}</td>
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

export default ReturnStock;

