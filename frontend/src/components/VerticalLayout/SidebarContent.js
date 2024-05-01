import React, { useEffect, useRef, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import axios from "axios";
import { API_GET_ROLE_PERMSSIONS_DATA } from "customhooks/All_Api/Apis";
import GetAuthToken from "customhooks/TokenVerifivation/GetAuthToken";

const SidebarContent = (props) => {
  const [permissions, setPermissions] = useState([]);
  const ref = useRef();

  const config = GetAuthToken();

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }
  const fetchPermissions = async () => {
    try {
      const { data } = await axios.get(
        API_GET_ROLE_PERMSSIONS_DATA,
        config.config
      );
      setPermissions(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Dashboard"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/dashboard">
                <i className="bx bx-home-circle"></i>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>

            {/* Master Start */}

            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem?.resource?.name === "Master"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow">
                <i className="bx bx-building-house"></i>
                <span>{props.t("Master")}</span>
              </Link>

              <ul className="sub-menu">
                {/* <li>
                  <Link to="/master">{props.t("Default")}</Link>
                </li> */}
                <li>
                  <Link to="/master-city">{props.t("City")}</Link>
                </li>
                <li>
                  <Link to="/master-pincode">{props.t("Pincode")}</Link>
                </li>
                <li>
                  <Link to="/master-area">{props.t("Area")}</Link>
                </li>
                <li>
                  <Link to="/master-delivery-boys">
                    {props.t("Delivery Boys")}
                  </Link>
                </li>

                <li>
                  <Link to="/master-users">{props.t("Users")}</Link>
                </li>
                <li>
                  <Link to="/master-customer-group">
                    {props.t("Customer Group")}
                  </Link>
                </li>
                <li>
                  <Link to="/master-Product-category">
                    {props.t("Product Category")}
                  </Link>
                </li>
                <li>
                  <Link to="/master-uom">{props.t("UOM")}</Link>
                </li>
                <li>
                  <Link to="/master-tax-rate">{props.t("Tax Rate")}</Link>
                </li>
                <li>
                  <Link to="/master-hsn-code">{props.t("HSN Code")}</Link>
                </li>

                <li>
                  <Link to="/master-delivery-pattern">
                    {props.t("Delivery Pattern")}
                  </Link>
                </li>
              </ul>
            </li>

            {/* Master End */}

            {/* Farm start */}
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Farm"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/farm-home">
                <i className="bx bxs-store-alt"></i>
                <span>{props.t("Farm")}</span>
              </Link>
            </li>
            {/* Farm End */}

            {/* CWH start */}
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "CWH"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/cwh-home">
                <i className="bx bxs-home-circle"></i>
                <span>{props.t("CWH")}</span>
              </Link>
            </li>
            {/* CWH End */}

            {/* HUB Start */}

            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Hub"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-desktop"></i>
                <span>{props.t("HUB")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/hub-list">{props.t("HUB List")}</Link>
                </li>
                <li>
                  <Link to="/delivery-logs">{props.t("Delivery Logs")} </Link>
                </li>
                <li>
                  <Link to="/hub-collection-summary">
                    {props.t("Collection Summery")}{" "}
                  </Link>
                </li>
              </ul>
            </li>

            {/* HUB End */}

            {/* Customers Start */}
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Customers"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-group"></i>
                <span>{props.t("Customers")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/customer-list">{props.t("Customer List")}</Link>
                </li>
                <li>
                  <Link to="/wallet-details">{props.t("Wallet Details")} </Link>
                </li>
                <li>
                  <Link to="/bottle-management">
                    {props.t("Bottle Management")}{" "}
                  </Link>
                </li>
              </ul>
            </li>

            {/* Customers End */}

            {/* Products Start */}

            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Products"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/products">
                <i className="bx bx-shopping-bag"></i>
                <span>{props.t("Products")}</span>
              </Link>
            </li>

            {/* Products End */}

            {/* Subscription Start */}
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Subscription"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow ">
                <i className="bx bxl-youtube"></i>
                <span>{props.t("Subscription")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/subscription-config">
                    {props.t("Subscription Config")}
                  </Link>
                </li>
              </ul>
            </li>

            {/* Subscription End */}

            {/* Orders Start */}
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Orders"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow ">
                <i
                  className="bx bx-cart
"
                ></i>
                <span>{props.t("Orders")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/cart-orders">{props.t(" Cart Orders")}</Link>
                </li>
                <li>
                  <Link to="/subscription-orders">
                    {props.t(" Subscription Orders")}
                  </Link>
                </li>
              </ul>
            </li>

            {/* Orders End */}

            {/* Role And Permission Start */}
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Role & Permissions"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/role-&-permissions">
                <i className="bx bxs-store-alt"></i>
                <span>{props.t("Role & Permissions")}</span>
              </Link>
            </li>
            {/* Role And Permission End */}

            {/* Inventry Start */}
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Inventory"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-file"></i>
                <span>{props.t("Inventry")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/indent">{props.t(" Indent")}</Link>
                </li>
                <li>
                  <Link to="/stock">{props.t(" Stock")}</Link>
                </li>
                <li>
                  <Link to="/inward">{props.t(" Inward")}</Link>
                </li>
                <li>
                  <Link to="/outward">{props.t(" Outward")}</Link>
                </li>
                <li>
                  <Link to="/returun-stock">{props.t(" Return Stock")}</Link>
                </li>
                <li>
                  <Link to="/stock-summery">{props.t("  Stock Summary")}</Link>
                </li>
                <li>
                  <Link to="/stock-transferred">
                    {props.t("  Stock Transferred")}
                  </Link>
                </li>
              </ul>
            </li>

            {/* Inventry End */}

            {/* Accounts Start */}
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Accounts"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow ">
                <i className="bx bxs-bank"></i>
                <span>{props.t("Accounts")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/invoices">{props.t(" Invoice")}</Link>
                </li>
                <li>
                  <Link to="/payment-transactios">
                    {props.t(" Payment Transaction")}
                  </Link>
                </li>
                <li>
                  <Link to="/collection-summary">
                    {props.t(" Collection Summery")}
                  </Link>
                </li>
                <li>
                  <Link to="/pending-transaction">
                    {props.t(" Pending Transaction")}
                  </Link>
                </li>
              </ul>
            </li>

            {/* Accounts End */}

            {/* Other Start */}
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Other"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-list-ul"></i>
                <span>{props.t("Other")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/tickets">{props.t(" Tickets")}</Link>
                </li>
                <li>
                  <Link to="/company-details">
                    {props.t(" Company Details")}
                  </Link>
                </li>

                <li>
                  <Link to="/terms-&-conditions">
                    {props.t(" Terms & Conditions")}
                  </Link>
                </li>
                <li>
                  <Link to="/html-section">{props.t(" HTML Section")}</Link>
                </li>
              </ul>
            </li>

            {/* Other End */}

            {/* Farm start */}
            <li
              className={
                permissions &&
                permissions?.some(
                  (eachItem) => eachItem.resource?.name === "Offers"
                )
                  ? ""
                  : "d-none"
              }
            >
              <Link to="/offers">
                <i className="bx bx-gift"></i>
                <span>{props.t("Offers")}</span>
              </Link>
            </li>
            {/* Farm End */}

        


        

      
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
