import React, { useEffect, useState } from "react";
import HomeNavbar from "components/EcommerceMilkMor/HomeHeader/homeNavbar";
import BannerAndSignUp from "components/EcommerceMilkMor/CommonMilkmorImage/CommonMilkmorImage";
import Footer from "components/EcommerceMilkMor/EcommerceFooter/Footer";
import axios from "axios";

const MilkmorOutlets = () => {
  const initialAddress =
    "14, Astha-2 Complex, Madhav School Rd, opp. Bhavani Party Plot, Shiv Shanti Society, Pranami Nagar, Vastral, Ahmedabad, Gujarat 382418";
  const apiKey = "AIzaSyCa58JNEKqoYm__0jBzAjknyKSvCLCtFSY";

  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            initialAddress
          )}&key=${apiKey}`
        );

        if (response.data.status === "OK" && response.data.results.length > 0) {
          const location = response.data.results[0].geometry.location;
          const latitude = location.lat;
          const longitude = location.lng;
          setCoordinates({ latitude, longitude });
        } else {
          console.error("Geocoding failed. Unable to retrieve coordinates.");
        }
      } catch (error) {
        console.error("Geocoding failed. Error:", error);
      }
    };

    geocodeAddress();
  }, []);

  return (
    <React.Fragment>
      <HomeNavbar />
      <BannerAndSignUp />
      <Footer />
    </React.Fragment>
  );
};

export default MilkmorOutlets;
