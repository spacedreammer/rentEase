import React from "react";
import { FaRegHeart } from "react-icons/fa";
import {
  FaBath,
  FaBed,
  FaHouse,
  FaLocationDot,
  FaSquare,
  FaSquareCaretLeft,
  FaSquareDribbble,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
const Card = ({ image, rentPrice, location, bedSize, bathRoom, houseSize, linka }) => {
  return (
    <>
      <div className="">
        <div className="bg-[#f7f7ff] rounded-xl shadow-md relative ">
          <div className="p-1">
            <div className="mb-5">
              <img
                src={image}
                alt="image"
                className="rounded-md h-[8cm] w-full"
              />
            </div>

            <div className="flex flex-row justify-between items-center mb-3">
              <h3 className="text-blue-500 mb-2 font-poppins">{rentPrice}</h3>
              <div className="flex justify-center h-7 w-7 rounded-full border border-gray-400 items-center">
                <FaRegHeart className="text-purple-500" />
              </div>
            </div>
            <div className=" flex mb-3 pl-3">
              <FaLocationDot className="text-2xl text-gray-700 font-poppins " />
              <h1 className="text-2xl font-bold">{location}</h1>
            </div>
            <p className="text-gray-400">299 Majengo kwa mtei</p>
            <div className="border border-gray-100 mb-5"></div>
            <div className="grid grid-cols-3  mb-4 font-poppins text-gray-500">
              <span className="flex">
                <FaBed className="text-purple-500" />
                <p className="ml-2">{bedSize}</p>
              </span>
              <span className="flex">
                <FaBath className="text-purple-500" />
                <p className="ml-2">{bathRoom}</p>
              </span>
              <span className="flex">
                <FaHouse className="text-purple-500" />
                <p className="ml-2">
                  {houseSize}m <sup>2</sup>
                </p>
              </span>
              <Link
            to={linka}
            className="h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm"
          >
            Read More
          </Link>
            </div>
            {/* <div className="flex flex-col lg:flex-row justify-between mb-4">
                  
                  <a
                    href="job.html"
                    className="h-[36px] bg-blue-300 font-poppins hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-center text-sm">
                    Read More
                  </a>
                </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
