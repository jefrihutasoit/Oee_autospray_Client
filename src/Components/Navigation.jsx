import { RiDashboardLine } from "@react-icons/all-files/ri/RiDashboardLine";
import { HiDocumentReport } from "@react-icons/all-files/hi/HiDocumentReport";
import { AiOutlineSetting } from "@react-icons/all-files/ai/AiOutlineSetting";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
// import io from 'socket.io-client'
// const socket =io.connect("http://192.168.1.161:8001")
// import{route}
// import route from "vendor/tightenco/ziggy/src/js";
function Navigation(props) {
  const [nighMode, setNightMode] = useState(true);

  useEffect(() => {
    // socket.on("connect",(msg) =>{
    //     setSocketConnect("checked")
    // })
    // socket.on("disconnect",(msg) =>{
    //     setSocketConnect("")
    // })
  }, []);

  function changeThem(value) {
    document
      .getElementById("html-wrap")
      .setAttribute("data-theme", value ? "forest" : "light");
    setNightMode(value);
  }

  return (
    <div className=" fixed right-14 bottom-5">
      <div>
        <input
          defaultChecked
          type="checkbox"
          className="toggle toggle-lg toggle-primary tooltip"
          onClick={(e) => changeThem(e.target.checked)}
          data-tip={nighMode ? "Switch to light mode" : "Switch to dark mode"}
        />
      </div>
    </div>
  );
}

export default Navigation;
