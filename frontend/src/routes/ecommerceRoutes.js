// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// const EcommerceAuthmiddleware = (props) => {
//   if (!localStorage.getItem("EcommerceTokenData")) {
//     return (
//       <Navigate
//         to={{ pathname: "/products-home", state: { from: props.location } }}
//       />
//     );
//   }
//   return <React.Fragment>{props.children}</React.Fragment>;
// };

// export default EcommerceAuthmiddleware;
import React from "react";
import { useNavigate } from "react-router-dom";

const EcommerceAuthmiddleware = (props) => {
  const navigate = useNavigate()
  if (!localStorage.getItem("EcommerceTokenData")) {
    navigate("/products-home", { state: { from: props.location } });
    return null;
  }
  return <React.Fragment>{props.children}</React.Fragment>;
};

export default EcommerceAuthmiddleware;
