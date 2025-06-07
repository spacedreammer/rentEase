import React from "react";
import Card from "../components/Card";
import house1 from "../assets/images/house1.jpg";
import house2 from "../assets/images/house2.jpg";
import SearchFilter from "../components/SearchFilter";

const HomePage = () => {
  return (
    <>

      <h1 className="flex justify-center items-center mt-4 font-poppins text-3xl font-bold">Search properties to rent</h1>
      <SearchFilter />
     
      {/* Flex container for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        <div className="w-2/3">
          <Card
            image={house1}
            location={"Kinondoni"}
            rentPrice={"800K"}
            bathRoom={"2 Bath Rooms"}
            bedSize={"2 Beds"}
            houseSize={"5X7"}
          />
        </div>

        <div className="w-2/3">
          <Card
            image={house2}
            location={"Kinondoni"}
            rentPrice={"800K"}
            bathRoom={"2 Bath Rooms"}
            bedSize={"2 Beds"}
            houseSize={"5X7"}
          />
        </div>
        <div className="w-2/3">
          <Card
            image={house1}
            location={"Kinondoni"}
            rentPrice={"800K"}
            bathRoom={"2 Bath Rooms"}
            bedSize={"2 Beds"}
            houseSize={"5X7"}
          />
        </div>
      </div>

      {/* Flex container for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        <div className="w-2/3">
          <Card
            image={house1}
            location={"Kinondoni"}
            rentPrice={"800K"}
            bathRoom={"2 Bath Rooms"}
            bedSize={"2 Beds"}
            houseSize={"5X7"}
          />
        </div>

        <div className="w-2/3">
          <Card
            image={house2}
            location={"Kinondoni"}
            rentPrice={"800K"}
            bathRoom={"2 Bath Rooms"}
            bedSize={"2 Beds"}
            houseSize={"5X7"}
          />
        </div>
        <div className="w-2/3">
          <Card
            image={house1}
            location={"Kinondoni"}
            rentPrice={"800K"}
            bathRoom={"2 Bath Rooms"}
            bedSize={"2 Beds"}
            houseSize={"5X7"}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
