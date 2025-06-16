import React, { Suspense } from "react";
import { ClipLoader } from "react-spinners";
import BannerSlider from "./BannerSlider";
import LatestItemsSection from "./LatestItemsSection";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <BannerSlider></BannerSlider>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-40">
            <ClipLoader size={40} color="#3B82F6" />
          </div>
        }
      >
        <LatestItemsSection></LatestItemsSection>
      </Suspense>
    </div>
  );
};

export default Home;
