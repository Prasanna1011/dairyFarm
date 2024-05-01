import React from "react";
import whymilkmor1 from "../../../assets/images/whymilkmor1.png"
import whymilkmor2 from "../../../assets/images/whymilkmor2.png"
import whymilkmor3 from "../../../assets/images/whymilkmor3.png"
import whymilkmor4 from "../../../assets/images/whymilkmor4.png"
import "./whtmilkmor.css";

const Whymilkmor = () => {
  return (
    <React.Fragment>
      <div className="why-milkmor-container">
        <div className="container">
          <div className="d-flex flex-row align-items-center justify-content-center mt-3">
            <h1>Why Milkmor?</h1>
          </div>
          <ul className="why-milkmor-images">
            <li className="why-milkmor-image">
              <img
                src={whymilkmor1}
                alt="whyMilkmor1"
              />
              <h5 className="text-center mt-2">
                FREE DOOR <br />
                DELIVERY
              </h5>
            </li>
            <li className="why-milkmor-image">
              <img
                src={whymilkmor2}
                alt="whyMilkmor2"
              />
               <h5 className="text-center mt-2">
                DEDICATEDED <br />
                CUSTOMER SERVICE
              </h5>
            </li>
            <li className="why-milkmor-image">
              <img
                src={whymilkmor3}
                alt="whyMilkmor3"
              />
              <h5 className="text-center mt-2">
                100% UNTOUCHED <br />
                MILK
              </h5>
            </li>
            <li className="why-milkmor-image">
              <img
                src={whymilkmor4}
                alt="whyMilkmor4"
                className="text-center"
              />
              <h5 className="text-center mt-2">
                RICH FOODER TO  <br />
                THE A2 COWS
              </h5>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Whymilkmor;
