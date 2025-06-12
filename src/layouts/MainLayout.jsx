import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";

const MainLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
      <ToastContainer/>
    </>
  );
};

export default MainLayout;
