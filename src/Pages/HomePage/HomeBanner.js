import React from "react";
import mobileTower1 from "../../images/Mobile Tower2.jpg";

const HomeBanner = () => {
  return (
    <div className="carousel w-full mb-2 mt-1">
      <div id="slide4" className="carousel-item relative w-full">
        <img src={mobileTower1} className="w-full h-96" alt="mobile Tower" />
        {/* <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
      <a href="#slide3" className="btn btn-circle">❮</a> 
      <a href="#slide1" className="btn btn-circle">❯</a>
    </div> */}
      </div>
    </div>
  );
};

export default HomeBanner;
