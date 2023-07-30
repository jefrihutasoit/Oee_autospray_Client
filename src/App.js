import "./App.css";
import "./css/style.css";
// import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Detail from "./Pages/Detail";
import Dashboard from "./Pages/Dashboard";
import ErrorRoute from "./Components/ErrorRoute";
import Navigation from "./Components/Navigation";
import Groupdashboard from "./Pages/Groupdashboard";
import GroupdashboardV2 from "./Pages/GroupdashboardV2";
import Clock_server from "./Components/Clock_server";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Datamanagement from "./Admin/DatamanagementV2";
import ip_Server from "../src/ServerConfig.js";
import Machine_management from "./Admin/Machine_management";
import Wizzard_schedule from "./Admin/Wizzard_schedule";
import Operator_schedule_monitoring_Component from "./Components/Operator_schedule_monitoring_Component";

const socket = io.connect(ip_Server);

function App() {
  // const navigate = useNavigate()
  const [dark_mode, setDarkMode] = useState(true);
  const [dataFromServer, setDatarFromserver] = useState();
  const [socketStatus, setSocketStatus] = useState("");
  const [slideShowmode, setSlideshowmode] = useState(false);

  function change_to_dark_mode(data) {
    setDarkMode(data.target.checked);
  }

  function slideShodmode_funct(data) {
    setSlideshowmode(data.target.checked);
    // console.log("slideShow:" + data.target.checked);
    // if (data.target.checked) navigate(`/`);
  }
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    socket.on("fromServer", (data) => {
      setDatarFromserver(data);
    });

    socket.on("connect", () => {
      setIsConnected(true);
      setSocketStatus("Linked");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      setSocketStatus("---");
    });
  }, []);

  // document.body.style = dark_mode ? `background: black;` : `background: white;`;
  return (
    <Router>
      <div style={{ position: "fixed", right: "0", zIndex: 1 }}>
        <Clock_server data={dataFromServer} socketStatus={socketStatus} />
      </div>
      <Navigation
        toggle_dark_mode={change_to_dark_mode}
        slide_showhandle={slideShodmode_funct}
      />
      <body className="content">
        {/* style={{ backgroundColor: dark_mode ? 'black' : 'white', height: '100%', width: '100%', position: 'absolute' }}> */}
        <Routes>
          {/* <Route path="/" element={<Dashboard dark_mode={dark_mode} slideShow={slideShowmode} Data_server={dataFromServer} />} /> */}
          <Route
            path="/detail/:machine_req"
            element={
              <Detail dark_mode={dark_mode} Data_server={dataFromServer} />
            }
          />
          {/* <Route
            path="/group-dashboard/:group"
            element={
              <Groupdashboard
                dark_mode={dark_mode}
                slideShow={slideShowmode}
                Data_server={dataFromServer}
              />
            }
          /> */}
          <Route
            path="*"
            element={
              <GroupdashboardV2
                dark_mode={dark_mode}
                slideShow={slideShowmode}
                Data_server={dataFromServer}
              />
            }
          />
          {/* <Route path='*' element={<Dashboard dark_mode={dark_mode} slideShow={slideShowmode} Data_server={dataFromServer} />} /> */}
          <Route
            path="/admin/data-management"
            element={
              <Datamanagement dark_mode={dark_mode} slideShow={slideShowmode} />
            }
          />
          <Route
            path="/admin/machine"
            element={<Machine_management dark_mode={dark_mode} />}
          />
          <Route
            path="/CreateSchedule/:MC"
            element={<Wizzard_schedule dark_mode={dark_mode} />}
          />
          <Route
            path="/Operator_form_schedule/:MC"
            element={
              <Operator_schedule_monitoring_Component
                dark_mode={dark_mode}
                Data_server={dataFromServer}
              />
            }
          />
        </Routes>
      </body>
    </Router>
  );
}

export default App;
