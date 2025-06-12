import React, { Children } from "react";
import Button from "./Button";
import { FaCalculator } from "react-icons/fa";

const AgentInfo = ({
  title = "Agent Information",
  desc = "Get an insight of the house/room from an Agent",
  img = 'https://via.placeholder.com/150', // Placeholder image URL
}) => {
  return (
    <>
      <div className="bg-white shadow-md w-[10cm] font-poppins  pt-3 rounded-md">
        <div>
          <h1 className="text-2xl">{title}</h1>
          <p>{desc}</p>
        </div>

        <div className="flex flex-row gap-1 pt-4">
          <div className=" rounded-md w-[5cm] h-[5cm]">
            <div className="rounded-lg w-[3cm] h-[3cm] bg-gray-100 ">
              <img src={img} alt="image" />
            </div>
          </div>

          <div >
            <h1 className="text-2xl">John Doe</h1>
            <p>Kodisha Company Limted, Majengo-Kwamtei</p>
          </div>
        </div>

        <div>
            <h1 className="text-lg">License</h1>
            <p>Number: #1234</p>

            <h1 className="text-lg">Contact</h1>
            <p>Number: 0677495516</p>
    
        </div>

        <div className="pt-5">
          <Button
            className={
              "bg-purple-100 text-purple-400 border w-full lg:mt-0 mt-4 border-gray-400  p-2 rounded-md hover:bg-white"
            }
            textButton={"Contact Now"}
         />
        </div>
      </div>
    </>
  );
};

export default AgentInfo;
