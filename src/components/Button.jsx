import React from "react";

const Button = ({ className, textButton }) => {
  return (
    <>
      <button className={className}>{textButton}</button>
    </>
  );
};

export default Button;
