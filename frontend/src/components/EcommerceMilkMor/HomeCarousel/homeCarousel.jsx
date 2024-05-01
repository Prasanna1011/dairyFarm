// import React, { useEffect } from "react";
// import "./homeCarousel.css";
// import milkmorCarousel2 from "../../../assets/images/milkmorcarousel2.jpg";
// import milkmorCarousel1 from "../../../assets/images/milkmorcarousel1.jpg";
// import milkmorCarousel3 from "../../../assets/images/milkmorcarousel3.jpg";

// const HomeCarousel = () => {
//   return (
//     <React.Fragment>
//       <div
//         id="carouselExampleIndicators"
//         className="carousel slide"
//         data-ride="carousel"
//         data-interval="5000"
//       >
//         <ol className="carousel-indicators">
//           <li
//             data-target="#carouselExampleIndicators"
//             data-slide-to="0"
//             className="active"
//           ></li>
//           <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
//           <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
//         </ol>
//         <div className="carousel-inner">
//           <div className="carousel-item active">
//             <img
//               className="d-block w-100 carousel-image"
//               src={milkmorCarousel2}
//               alt="First slide"
//             />
//           </div>
//           <div className="carousel-item">
//             <img
//               className="d-block w-100 carousel-image"
//               src={milkmorCarousel1}
//               alt="Second slide"
//             />
//           </div>
//           <div className="carousel-item">
//             <img
//               className="d-block w-100 carousel-image"
//               src={milkmorCarousel3}
//               alt="Third slide"
//             />
//           </div>
//         </div>
//         <a
//           className="carousel-control-prev"
//           href="#carouselExampleIndicators"
//           role="button"
//           data-slide="prev"
//         >
//           <span
//             className="carousel-control-prev-icon"
//             aria-hidden="true"
//           ></span>
//           <span className="sr-only">Previous</span>
//         </a>
//         <a
//           className="carousel-control-next"
//           href="#carouselExampleIndicators"
//           role="button"
//           data-slide="next"
//         >
//           <span
//             className="carousel-control-next-icon"
//             aria-hidden="true"
//           ></span>
//           <span className="sr-only">Next</span>
//         </a>
//       </div>
//     </React.Fragment>
//   );
// };

// export default HomeCarousel;
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import milkmorCarousel1 from "../../../assets/images/milkmorcarousel1.jpg";
import milkmorCarousel2 from "../../../assets/images/milkmorcarousel2.jpg";
import milkmorCarousel3 from "../../../assets/images/milkmorcarousel3.jpg";
import "./homeCarousel.css"

const HomeCarousel = () => {
  const settings = {
    infinite: true,
    fade: true,
    speed: 1000, 
    slidesToShow: 1, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 1500,
    pauseOnHover: false,
  
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div>
          <img
            className="carousel-image"
            src={milkmorCarousel1}
            alt="Slide 1"
          />
        </div>
        <div>
          <img
            className="carousel-image"
            src={milkmorCarousel2}
            alt="Slide 2"
          />
        </div>
        <div>
          <img
            className="carousel-image"
            src={milkmorCarousel3}
            alt="Slide 3"
          />
        </div>
      </Slider>
    </div>
  );
};

export default HomeCarousel;

