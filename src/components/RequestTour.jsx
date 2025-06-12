import React from "react";
import Button from "./Button";

const RequestTour = ({title = "Request a Tour", desc = 'Get a Tour of the house as per your time'}) => {
  return (
    <>
      <div className="bg-white shadow-md w-[10cm] h-[5cm] pl-7 pt-3 rounded-md">
        <div>
          <h1 className="font-poppins text-2xl pb-3">{title}</h1>
          <p className="font-poppins pb-2">
            {desc}
          </p>
        </div>

        {/*  */}
        <div className="w-[10cm]">
          <input type="date" className=" bg-gray-100" />
          <input type="time" className=" bg-gray-100" />
        </div>

        <div className="pt-5">
          <Button
            className={
              "bg-purple-500 text-white border w-full lg:mt-0 mt-4 border-gray-400  p-2 rounded-md hover:bg-purple-400"
            }
            textButton={"Schedule a Tour"}
          />
        </div>
      </div>
    </>
  );
};

export default RequestTour;
