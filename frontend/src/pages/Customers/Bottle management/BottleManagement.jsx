// import React, { useState, useRef, useEffect } from "react";
// import {
//   Button,
//   Card,
//   CardBody,
//   CardText,
//   CardTitle,
//   Col,
//   Collapse,
//   Container,
//   Input,
//   Label,
//   Nav,
//   NavItem,
//   NavLink,
//   Row,
//   TabContent,
//   TabPane,
//   Table,
//   UncontrolledCollapse,
// } from "reactstrap";

// import { Link } from "react-router-dom";
// import Flatpickr from "react-flatpickr";
// import "flatpickr/dist/themes/light.css"; // Import the styles
// import classnames from "classnames";
// import { TablePagination } from "@mui/material";
// import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
// import axios from "axios";
// import {
//   API_CUSTOMER_BOTTLE_MANAGEMENT_CUSTOMER_WISE_BOTTLE,
//   API_CUSTOMER_BOTTLE_MANAGEMENT_DAILY_BOTTLE,
// } from "customhooks/All_Api/Apis";
// import { format } from "date-fns";
// function BottleManagement() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [dailyBottleData, setDailyBottleData] = useState([]);
//   const [customerWiseBottleManagement, setCustomerWiseBottleManagement] =
//     useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [customActiveTab, setcustomActiveTab] = useState("1");
//   const [searchTerm, setSearchTerm] = useState("");
//   //meta title
//   document.title = "Bottle management ";
//   // Local storage token Start
//   const { config, first_name, last_name, department_type_name } =
//     GetAuthToken();

//   // Local storage token End

//   console.log("customActiveTabcustomActiveTabcustomActiveTabcustomActiveTabcustomActiveTab",customActiveTab);

//   // Search Filter Start

//   const searchInputRef = useRef(null);



//   // Pagenation Start
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   // Pagenation End


//   const toggleCustom = (tab) => {
//     if (customActiveTab !== tab) {
//       setcustomActiveTab(tab);
//     }
//   };

//   const getDailyBottleData = async () => {
//     const { data } = await axios.get(
//       `${API_CUSTOMER_BOTTLE_MANAGEMENT_DAILY_BOTTLE}?search_query=${searchTerm}&return_date=${format(
//         selectedDate,
//         "yyyy-MM-dd"
//       )}`,
//       config
//     );
//     console.log("data", data);
//     setDailyBottleData(data);
//   };

//   const getCustomerWiseBottleManagement = async () => {
//     const { data } = await axios.get(
//       API_CUSTOMER_BOTTLE_MANAGEMENT_CUSTOMER_WISE_BOTTLE,
//       config
//     );
//     console.log("data", data);
//     setCustomerWiseBottleManagement(data);
//   };

//   useEffect(() => {
//     getDailyBottleData();
//   }, [searchTerm, selectedDate]);

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <Container fluid={true}>
//           <Row>
//             <Col xl={12}>
//               <Card>
//                 <CardBody className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <h3>Bottle Managment</h3>
//                   </div>
//                   <div className="d-flex align-items-end">
//                     <div>
//                       <Button color="primary" className="px-4">
//                         Export
//                       </Button>
//                     </div>

                 
//                     {customActiveTab == 2 ?"":<>
//                     <div className="ms-2">
//                       <Label htmlFor="formrow-email-Input">
//                         Search Hub/Customer/Delivery Boy
//                       </Label>
//                       <Input
//                         type="text"
//                         className="form-control"
//                         id="formrow-email-Input"
//                         placeholder="Search Customer/Orders"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                     <div className="ms-2">
//                       <Label htmlFor="datepicker" className="form-label">
//                         Select Date:
//                       </Label>
//                       <Flatpickr
//                         id="datepicker"
//                         value={selectedDate}
//                         onChange={(dates) => {
                      
//                           const newDate =
//                             dates && dates.length > 0 ? dates[0] : new Date();
//                           setSelectedDate(newDate);
//                         }}
//                         options={{
//                           dateFormat: "d-m-Y",
//                           maxDate: new Date(),
//                         }}
//                         className="form-control"
//                       />
//                     </div></>}
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
       

//           <Row>
//             <Col lg={12}>
//               <Card>
//                 <CardBody>
//                   <Nav tabs className="nav-tabs-custom nav-justified">
//                     <NavItem>
//                       <NavLink
//                         style={{ cursor: "pointer" }}
//                         className={classnames({
//                           active: customActiveTab === "1",
//                         })}
//                         onClick={() => {
//                           toggleCustom("1");
//                         }}
//                       >
//                         <span className="d-block d-sm-none">
//                           <i className="fas fa-home"></i>
//                         </span>
//                         <span className="d-none d-sm-block">Daily Bottle</span>
//                       </NavLink>
//                     </NavItem>
//                     <NavItem>
//                       <NavLink
//                         style={{ cursor: "pointer" }}
//                         className={classnames({
//                           active: customActiveTab === "2",
//                         })}
//                         onClick={() => {
//                           toggleCustom("2");
//                           getCustomerWiseBottleManagement();
//                         }}
//                       >
//                         <span className="d-block d-sm-none">
//                           <i className="far fa-user"></i>
//                         </span>
//                         <span className="d-none d-sm-block">
//                           Customer Wise Bottle
//                         </span>
//                       </NavLink>
//                     </NavItem>
//                   </Nav>

//                   <TabContent
//                     activeTab={customActiveTab}
//                     className="p-3 text-muted"
//                   >
//                     <TabPane tabId="1">
//                       <Row>
//                         <Col sm="12">
//                           <Row>
//                             <Col xl={12}>
//                               <Card className="pb-5">
//                                 <CardBody>
//                                   <div className="table-responsive">
//                                     <Table className="align-middle ">
//                                       <thead className="table-light">
//                                         <tr>
//                                           <th>Customer Name</th>
//                                           <th> Hub Name</th>
//                                           <th>Delivery Boys Name</th>
//                                           <th> Return Date</th>
//                                           <th>
//                                             {" "}
//                                             Returned Bottle Count (500 ml)
//                                           </th>
//                                           <th> Returned Bottle Count (1 L)</th>
//                                         </tr>
//                                       </thead>

//                                       <tbody className="">
//                                         {dailyBottleData.results &&
//                                           dailyBottleData?.results?.map(
//                                             (item, index) => (
//                                               <tr key={item.id}>
//                                                 <th>
//                                                   {item?.customer?.first_name}{" "}
//                                                   {item?.customer?.last_name}
//                                                 </th>
//                                                 <td>{item?.hub_name}</td>

//                                                 <td>
//                                                   {
//                                                     item?.delivery_boy
//                                                       ?.first_name
//                                                   }{" "}
//                                                   {
//                                                     item?.delivery_boy
//                                                       ?.last_name
//                                                   }
//                                                 </td>
//                                                 <td>{item?.returned_data}</td>
//                                                 <td>{item?.count_500ml}</td>
//                                                 <td>{item?.count_1l}</td>
//                                               </tr>
//                                             )
//                                           )}
//                                       </tbody>
//                                     </Table>
//                                   </div>
//                                 </CardBody>
//                                 <TablePagination
//                                   className=" d-flex justfy-content-start"
//                                   rowsPerPageOptions={[5, 10, 25, 100]}
//                                   component="div"
//                                   // count={deliveryBoysData.length}
//                                   rowsPerPage={rowsPerPage}
//                                   page={page}
//                                   onPageChange={handleChangePage}
//                                   onRowsPerPageChange={handleChangeRowsPerPage}
//                                 />
//                               </Card>
//                             </Col>
//                           </Row>
//                         </Col>
//                       </Row>
//                     </TabPane>
//                     <TabPane tabId="2">
//                       <Row>
//                         <Col sm="12">
//                           <Row>
//                             <Col xl={12}>
//                               <Card className="pb-5">
//                                 <CardBody>
//                                   <div className="table-responsive">
//                                     <Table className="align-middle ">
//                                       <thead className="table-light">
//                                         <tr>
//                                           <th>Customer Name</th>

//                                           <th>Total Bottle Count (500 ml)</th>
//                                           <th> Total Bottle Count (1 L)</th>
//                                         </tr>
//                                       </thead>

//                                       <tbody className="">
//                                         {customerWiseBottleManagement.results &&
//                                           customerWiseBottleManagement?.results?.map(
//                                             (item, index) => (
//                                               <tr key={item.id}>
//                                                 <th>
//                                                   {item?.customer?.first_name}{" "}
//                                                   {item?.customer?.last_name}
//                                                 </th>
//                                                 <td>{item?.count_500ml}</td>
//                                                 <td>{item?.count_1l}</td>
//                                               </tr>
//                                             )
//                                           )}
//                                       </tbody>
//                                     </Table>
//                                   </div>
//                                 </CardBody>
//                                 <TablePagination
//                                   className=" d-flex justfy-content-start"
//                                   rowsPerPageOptions={[5, 10, 25, 100]}
//                                   component="div"
//                                   // count={deliveryBoysData.length}
//                                   rowsPerPage={rowsPerPage}
//                                   page={page}
//                                   onPageChange={handleChangePage}
//                                   onRowsPerPageChange={handleChangeRowsPerPage}
//                                 />
//                               </Card>
//                             </Col>
//                           </Row>
//                         </Col>
//                       </Row>
//                     </TabPane>
//                   </TabContent>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </React.Fragment>
//   );
// }

// export default BottleManagement;



import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Table,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import classnames from "classnames";
import axios from "axios";
import { format } from "date-fns";
import { TablePagination } from "@mui/material";

import {
  API_CUSTOMER_BOTTLE_MANAGEMENT_CUSTOMER_WISE_BOTTLE,
  API_CUSTOMER_BOTTLE_MANAGEMENT_DAILY_BOTTLE,
} from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

function BottleManagement() {
  const [page, setPage] = useState(0);
  const [page1, setPage1] = useState(0); // Pagination state for first tab
  const [pageSize1, setPageSize1] = useState(10);
  const [page2, setPage2] = useState(0); // Pagination state for second tab
  const [pageSize2, setPageSize2] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const [dailyBottleData, setDailyBottleData] = useState([]);
  const [customerWiseBottleManagement, setCustomerWiseBottleManagement] =
    useState([]);

  // Get token and configuration
  const { config } = GetAuthToken();

  // Function to toggle between tabs
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  // Fetch data for Daily Bottle tab
  const getDailyBottleData = async () => {
    try {
      const { data } = await axios.get(
        `${API_CUSTOMER_BOTTLE_MANAGEMENT_DAILY_BOTTLE}?search_query=${searchTerm}&return_date=${format(
          selectedDate,
          "yyyy-MM-dd"
        )}`,
        {
          ...config,
          params: {
            page:page1+1,
            page_size: pageSize1,
          },
  
        }
      );
      setDailyBottleData(data);
    } catch (error) {
      console.error("Error fetching daily bottle data:", error);
    }
  };

 
  // Fetch data for Customer Wise Bottle tab
  const getCustomerWiseBottleManagement = async () => {
    try {
      const { data } = await axios.get(
        API_CUSTOMER_BOTTLE_MANAGEMENT_CUSTOMER_WISE_BOTTLE,
      {
        ...config,
        params: {
          page:page2+1,
          page_size: pageSize2,
        },

      }
      );
      setCustomerWiseBottleManagement(data);
    } catch (error) {
      console.error("Error fetching customer wise bottle data:", error);
    }
  };

  // Handle change in selected date for Daily Bottle tab
  const handleDateChange = (dates) => {
    const newDate = dates && dates.length > 0 ? dates[0] : new Date();
    setSelectedDate(newDate);
  };

  // Effect to fetch data when search term or selected date changes
  useEffect(() => {
    getDailyBottleData();
  }, [searchTerm, selectedDate]);

  useEffect(() => {
    getCustomerWiseBottleManagement(page2, pageSize2);
  }, [ page2, pageSize2]);

  useEffect(() => {
    getDailyBottleData(page1, pageSize1);
  }, [page1,  pageSize1]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3>Bottle Management</h3>
                  </div>
                  <div className="d-flex align-items-end">
                    {/* Search input for Daily Bottle tab */}
                    {customActiveTab === "1" && (
                      <div className="ms-2">
                        <Label htmlFor="formrow-email-Input">
                          Search Hub/Customer/Delivery Boy
                        </Label>
                        <Input
                          type="text"
                          className="form-control"
                          id="formrow-email-Input"
                          placeholder="Search Customer/Orders"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    )}

                    {/* Date picker for Daily Bottle tab */}
                    {customActiveTab === "1" && (
                      <div className="ms-2">
                        <Label htmlFor="datepicker" className="form-label">
                          Select Date:
                        </Label>
                        <Flatpickr
                          id="datepicker"
                          value={selectedDate}
                          onChange={handleDateChange}
                          options={{
                            dateFormat: "d-m-Y",
                            maxDate: new Date(),
                          }}
                          className="form-control"
                        />
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Tabs */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Nav tabs className="nav-tabs-custom nav-justified">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        onClick={() => {
                          toggleCustom("1");
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="fas fa-home"></i>
                        </span>
                        <span className="d-none d-sm-block">Daily Bottle</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "2",
                        })}
                        onClick={() => {
                          toggleCustom("2");
                          getCustomerWiseBottleManagement();
                        }}
                      >
                        <span className="d-block d-sm-none">
                          <i className="far fa-user"></i>
                        </span>
                        <span className="d-none d-sm-block">
                          Customer Wise Bottle
                        </span>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  {/* Tab content */}
                  <TabContent
                    activeTab={customActiveTab}
                    className="p-3 text-muted"
                  >
                    {/* Daily Bottle Tab */}
                    <TabPane tabId="1">
                      <Row>
                        <Col sm="12">
                          <Row>
                            <Col xl={12}>
                              <Card className="pb-5">
                                <CardBody>
                                  <div className="table-responsive">
                                    <Table className="align-middle">
                                      <thead className="table-light">
                                        <tr>
                                          <th>Customer Name</th>
                                          <th>Hub Name</th>
                                          <th>Delivery Boys Name</th>
                                          <th>Return Date</th>
                                          <th>Returned Bottle Count (500 ml)</th>
                                          <th>Returned Bottle Count (1 L)</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {dailyBottleData.results &&
                                          dailyBottleData.results.map(
                                            (item) => (
                                              <tr key={item.id}>
                                                <td>
                                                  {item.customer.first_name}{" "}
                                                  {item.customer.last_name}
                                                </td>
                                                <td>{item.hub_name}</td>
                                                <td>
                                                  {item.delivery_boy.first_name}{" "}
                                                  {item.delivery_boy.last_name}
                                                </td>
                                                <td>{item.returned_data}</td>
                                                <td>{item.count_500ml}</td>
                                                <td>{item.count_1l}</td>
                                              </tr>
                                            )
                                          )}
                                      </tbody>
                                    </Table>
                                  </div>
                                </CardBody>
                                {/* Pagination for Daily Bottle tab */}
                                <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={dailyBottleData?.count}
                                  rowsPerPage={pageSize1}
                                  page={page1}
                                  onPageChange={(event, newPage) =>
                                    setPage1(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSize1(+event.target.value);
                                    setPage1(0);
                                  }}
                                />
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </TabPane>

                    {/* Customer Wise Bottle Tab */}
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="12">
                          <Row>
                            <Col xl={12}>
                              <Card className="pb-5">
                                <CardBody>
                                  <div className="table-responsive">
                                    <Table className="align-middle">
                                      <thead className="table-light">
                                        <tr>
                                          <th>Customer Name</th>
                                          <th>Total Bottle Count (500 ml)</th>
                                          <th>Total Bottle Count (1 L)</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {customerWiseBottleManagement?.results &&
                                          customerWiseBottleManagement?.results.map(
                                            (item) => (
                                              <tr key={item.id}>
                                                <td>
                                                  {item?.customer?.first_name}{" "}
                                                  {item?.customer?.last_name}
                                                </td>
                                                <td>{item?.count_500ml}</td>
                                                <td>{item?.count_1l}</td>
                                              </tr>
                                            )
                                          )}
                                      </tbody>
                                    </Table>
                                  </div>
                                </CardBody>
                                {/* Pagination for Customer Wise Bottle tab */}
                                <TablePagination
                                  className=" d-flex justfy-content-start"
                                  rowsPerPageOptions={[5, 10, 25, 100]}
                                  component="div"
                                  count={customerWiseBottleManagement?.count}
                                  rowsPerPage={pageSize2}
                                  page={page2}
                                  onPageChange={(event, newPage) =>
                                    setPage2(newPage)
                                  }
                                  onRowsPerPageChange={(event) => {
                                    setPageSize2(+event.target.value);
                                    setPage2(0);
                                  }}
                                />
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default BottleManagement;
