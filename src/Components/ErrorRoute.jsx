import React from "react";
import { useNavigate } from "react-router-dom";
function ErrorRoute() {
  let navigate = useNavigate();
  return (
    <div>
      ErrorRoute <button onClick={() => navigate("/")}>balik</button>{" "}
    </div>
  );
}

export default ErrorRoute;
