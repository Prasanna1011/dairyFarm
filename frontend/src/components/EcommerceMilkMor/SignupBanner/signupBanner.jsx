import React, { useState } from "react";
import "./signupBanner.css";

const SignupBanner = () => {
  return (
    <React.Fragment>
      <div className="signup-banner-container">
        <div className="container signup-banner-content">
          <p className="text-light h5">
            Know Your Milk before It's too Late! Subscribe for newletters from
            our Experts! Sign up now.
          </p>
          <button className="sign-up-button">SIGN-UP</button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignupBanner;
