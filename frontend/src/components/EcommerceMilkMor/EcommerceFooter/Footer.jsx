import React from "react";
import milkmorecommercefooter2 from "../../../assets/images/brands/milmorecommerefooter2.png";
import "./Footer.css";

const Footer = () => {
  return (
    <React.Fragment>
      <div className="footer-container pt-4">
        <div className="container">
          <div>
            <h5 className="text-light text-center">Ahmedabad</h5>
            <h5 className="text-light text-center">
              E-mail: contact@milkmor.com
            </h5>
          </div>

          <div className="main-container mt-5">
            <div className="d-flex flex-row align-items-center justify-content-center">
              <a
                href="https://www.facebook.com/milkmorofficial/"
                target="_blank"
                rel="noreferrer"
                className="m-3"
              >
                <i className="fab fa-facebook" style={{ fontSize: "35px" }}></i>
              </a>
              <a
                href="https://twitter.com/MilkmorOfficial"
                target="_blank"
                rel="noreferrer"
                className="m-3"
              >
                <i className="fab fa-twitter" style={{ fontSize: "35px" }}></i>
              </a>
              <a
                href="https://www.instagram.com/milkmorindia/"
                target="_blank"
                rel="noreferrer"
                className="m-3"
              >
                <i
                  className="fab fa-instagram"
                  style={{ fontSize: "35px" }}
                ></i>
              </a>
            </div>
          </div>
        </div>
        <div>
          <h5 className="text-light text-center">
            Copyright &copy; {new Date().getFullYear()} Milkmor - All Rights
            Reserved
          </h5>
          <img src={milkmorecommercefooter2} alt="footer-png" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Footer;
