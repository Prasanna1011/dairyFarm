import React, { useState } from "react";
import "./homeNavbar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import milkmorlogoecommerce from "../../../assets/images/milkmorlogoecommerce.png";
import { Link } from "react-router-dom";

const HomeNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  // Function to open the submenu
  const openSubmenu = () => {
    setSubmenuOpen(true);
  };

  // Function to close the submenu after a delay
  const closeSubmenu = () => {
    setTimeout(() => {
      setSubmenuOpen(false);
    }, 2000);
  };

  const closeSubmenuImmediately = () => {
    setSubmenuOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <button className="menu-button" onClick={toggleMenu}>
          &#9776;
        </button>
        <ul className={`menu ${isOpen ? "active" : ""}`}>
          <li
            className="menu-item text-light menu-hover"
            onMouseEnter={openSubmenu}
            onMouseLeave={closeSubmenu}
          >
            ABOUT US
            <ul
              style={{ left: "8%" }}
              className={`submenu ${submenuOpen ? "open" : ""}`}
              onMouseEnter={closeSubmenuImmediately}
              onMouseLeave={closeSubmenu}
            >
              <Link to="/directors">
                <li className="submenu-item">DIRECTORS</li>
              </Link>
              <Link to="/downloads">
                <li className="submenu-item">DOWNLOADS</li>
              </Link>
            </ul>
          </li>
          <li
            className="menu-item text-light menu-hover"
            onMouseEnter={openSubmenu}
            onMouseLeave={closeSubmenu}
          >
            PRODUCTS
            <ul
              style={{ left: "14%" }}
              className={`submenu ${submenuOpen ? "open" : ""}`}
              onMouseEnter={closeSubmenuImmediately}
              onMouseLeave={closeSubmenu}
            >
              <Link to="/products-shop">
                <li className="submenu-item ms-0">PRODUCTS</li>
              </Link>
              <Link to="/milkmor-delivery-areas">
                <li className="submenu-item">MILKMOR DELIVERY AREAS</li>
              </Link>
            </ul>
          </li>

          <li className="menu-item text-light menu-hover">
            MILKMORNING
            <ul className="submenu" style={{ left: "22%" }}>
              <Link to="/recipe">
                <li className="submenu-item">RECIPE</li>
              </Link>
            </ul>
          </li>
          <li className="menu-item text-light">OUR FARM</li>
          <li
            className="menu-item text-light menu-hover"
            onMouseEnter={openSubmenu}
            onMouseLeave={closeSubmenu}
          >
            CONTACT US
            <ul
              // style={{ left: "30%" }}
              className={`submenu ${submenuOpen ? "open" : ""}`}
              onMouseEnter={closeSubmenuImmediately}
              onMouseLeave={closeSubmenu}
            >
              <Link to="/milkmor-outlets">
                <li className="submenu-item ms-0">MILKMOR OUTLETS</li>
              </Link>
              <Link to="/career">
                <li className="submenu-item">CAREER</li>
              </Link>
            </ul>
          </li>
          <Link to="/products-shop">
            <li className=" menu-item">
              <button className="order-now-button">ORDER NOW</button>
            </li>
          </Link>
        </ul>

        <div className="logo ">
          <img src={milkmorlogoecommerce} alt="Logo" />
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
