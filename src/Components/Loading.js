import React from "react";
import "./Loading.css";

const Loading = (props) => {
  return (
    <div className={`bouncing-loader ${props.asOverlay && 'bouncing-loader__overlay'}`}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
