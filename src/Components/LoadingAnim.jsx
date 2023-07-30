import React from "react";

function LoadingAnim() {
  return (
    <div
      style={{
        width: "fit-content",
        position: "absolute",
        margin: "0",
        top: "50%",
        left: "50%",
        msTransform: "translate(-50%)",
        transform: "translate(-50%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="spinner-grow text-secondary" role="status"></div>
      <div className="spinner-grow text-success" role="status"></div>
      <div className="spinner-grow text-danger" role="status"></div>
      <div className="spinner-grow text-warning" role="status"></div>
      <div className="spinner-grow text-info" role="status"></div>
      <div className="spinner-grow text-warning" role="status"></div>
      <div className="spinner-grow text-dark" role="status"></div>
      {/* <div >Loading page...</div> */}
    </div>
  );
}

export default LoadingAnim;
