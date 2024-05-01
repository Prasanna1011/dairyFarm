// import { TablePagination } from "@mui/material";
// import axios from "axios";
// import { API_USER_POST_GET } from "customhooks/All_Api/Apis";
// import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   Button,
//   Card,
//   CardBody,
//   CardSubtitle,
//   CardTitle,
//   Col,
//   Container,
//   Popover,
//   PopoverBody,
//   PopoverHeader,
//   Row,
//   Table,
// } from "reactstrap";
// import LoaderPage from "components/Loader/LoaderPage";
// const Users = () => {
//   const [loading, setLoading] = useState(true);
//   const [usersData, setUsersData] = useState([]);
//   const [popoverOpen, setPopoverOpen] = useState(false);
//   const [currentRoles, setCurrentRoles] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   console.log("roles", usersData)

//   // Local storage token Start
//   const { config, first_name, last_name } = GetAuthToken();

//   // Local storage token End

//   const togglePopover = () => {
//     setPopoverOpen(!popoverOpen);
//   };

//   const handlePopoverOpen = (roles) => {
//     setCurrentRoles(roles);
//     togglePopover();
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const getUsersData = async () => {
//  try {
//   const { data } = await axios.get(API_USER_POST_GET, config);
//   setUsersData(data.data);
//   setLoading(false)
//  } catch (error) {
//   console.log("error",error);
//  }
//   };


//   console.log(usersData);
//   useEffect(() => {
//     getUsersData();
//   }, []);

//   return (
//     <div className="page-content">
//       <Container fluid={true}>
//   {
//     loading=== true (<LoaderPage/>):(
//      <>
//       <Row>
//       <Col xl={12}>
//         <Card>
//           <CardBody className="d-flex justify-content-between">
//             <h3>Users</h3>
//             <Link to={"/master-add-users"}>
//               <Button color="primary">Add Users</Button>
//             </Link>
//           </CardBody>
//         </Card>
//       </Col>
//     </Row>
//     <Row>
//     <Col xl={12} className="mt-4">
//         <Card>
//           <CardBody>
//             <div className="table-responsive">
//               <Table className="table mb-0">
//                 <thead className="table-light">
//                   <tr>
//                     <th>Username</th>
//                     <th>Department</th>
//                     <th>Role</th>
//                     <th>Status</th>
//                     <th>Activity</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* Paginate the usersData array */}
//                   {usersData
//                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                     .map((item, index) => (
//                       <tr key={index}>
//                         <td scope="row">
//                           {item.first_name} {item.last_name}
//                         </td>
//                         <td>{item.department_type_name}</td>
//                         <td>
//                           {item.roles.map((roleNames) => (
//                             <p key={roleNames.id}>{roleNames.name}</p>
//                           ))}
//                         </td>
//                         <td>
//                           {item.is_active === true ? (
//                             <button
//                               type="button"
//                               className="btn btn-success btn-sm "
//                             >
//                               Active
//                             </button>
//                           ) : (
//                             <button
//                               type="button"
//                               className="btn btn-danger  btn-sm "
//                             >
//                               InActive
//                             </button>
//                           )}
//                         </td>
//                         <td>
//                           <Link
//                             to={`/master-users-edit/${item.milkmor_user_id}`}
//                           >
//                             <Button className="edit-button btn btn-sm btn-warning">
//                               <i className="fas fa-pen"></i>
//                             </Button>
//                           </Link>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </Table>
//             </div>
//           </CardBody>
//         </Card>
//         {/* Pagination */}
//         <TablePagination
//           className=" d-flex justfy-content-start"
//           rowsPerPageOptions={[5, 10, 25, 100]}
//           component="div"
//           count={usersData.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Col>
//     </Row>
//      </>
//     )
//   }
//       </Container>
//     </div>
//   );
// };

// export default Users;


import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { TablePagination } from "@mui/material";
import axios from "axios";
import { API_USER_POST_GET } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";
import LoaderPage from "components/Loader/LoaderPage";

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { config } = GetAuthToken();

  const getUsersData = async () => {
    try {
      const { data } = await axios.get(API_USER_POST_GET, config);
      setUsersData(data.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="page-content">
      <Container fluid={true}>
        {loading ? (
          <LoaderPage />
        ) : (
          <>
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody className="d-flex justify-content-between">
                    <h3>Users</h3>
                    <Link to={"/master-add-users"}>
                      <Button color="primary">Add Users</Button>
                    </Link>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xl={12} className="mt-4">
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <Table className="table mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Username</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Activity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersData
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((item, index) => (
                              <tr key={index}>
                                <td scope="row">
                                  {item.first_name} {item.last_name}
                                </td>
                                <td>{item.department_type_name}</td>
                                <td>
                                  {item.roles.map((roleNames) => (
                                    <p key={roleNames.id}>
                                      {roleNames.name}
                                    </p>
                                  ))}
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className={`btn btn-sm ${
                                      item.is_active
                                        ? "btn-success"
                                        : "btn-danger"
                                    }`}
                                  >
                                    {item.is_active ? "Active" : "Inactive"}
                                  </button>
                                </td>
                                <td>
                                  <Link
                                    to={`/master-users-edit/${item.milkmor_user_id}`}
                                  >
                                    <Button className="edit-button btn btn-sm btn-warning">
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
                </Card>
                <TablePagination
                  className=" d-flex justfy-content-start"
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  count={usersData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default Users;
