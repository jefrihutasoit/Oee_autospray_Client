import React, { useEffect, useState } from "react";
import { Colors } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar,buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Pie, Bar, Doughnut } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels
);

function Machinegroupmode(propss) {
  const navigate = useNavigate();
  const [SizeRadial, setSizeRadial] = useState("100%");
  let History_data = propss.history;
  // console.log(History_data);
  let OEE_Mode = propss.mode_OEE;
  const [oeeData, setOEEdata] = useState({ P: 20, Q: 50.5, A: 70, OEE: 70 });
  const [colorStatus, setCOlorStatus] = useState("red"); //History_data.color_code,)
  const limit_indicator={
    low:0.5,
    middle:0.8,
  }

  useEffect(() => {
    // let tmp_status = propss.history.status
    // console.log(propss.color_status[propss.history.status]);
    setCOlorStatus(
      propss.color_status[propss.history.status]
        ? propss.color_status[propss.history.status]
        : "grey"
    );
  }, [propss.history]);

  let props = propss.data;
  const data = {
    labels: OEE_Mode ? ["P", "Q", "A", "OEE"] : ["Run", "Stop/Idle", "Alarm"],
    datasets: [
      {
        label: "",
        data: [History_data.run, History_data.stop, History_data.alarm],
        backgroundColor: ["#93D56A", "#E3E657", "#EC6A6B"],
        borderWidth: 1,
      },
    ],
  };

  // console.log(props);

  const option_oee = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
        color: ["red", "black"],
        formatter: Math.round(1),
        anchor: "start",
        offset: -9,
        align: "end",
        font: {
          weight: "900",
          size:
            (window.innerWidth / 1000) * 6 + (window.innerHeight / 1000) * 4,
        },
      },
      legend: {
        display: false,
      },
    },
  };
  const data_oee = {
    labels: ["OEE"],
    datasets: [
      {
        label: "",
        data: [History_data.OEE * 100, 100 - History_data.OEE * 100], //[History_data.run, History_data.stop, History_data.alarm],
        backgroundColor: [
          oeeData.OEE < 50
            ? "#e34040"
            : oeeData.OEE < 70
            ? "#e3d840"
            : "#93D56A",
          "#ffffff",
        ],
        borderWidth: 0,
      },
    ],
  };
  const data_availability = {
    labels: ["A"],
    datasets: [
      {
        label: "",
        data: [oeeData.A, 100 - oeeData.A], //[History_data.run, History_data.stop, History_data.alarm],
        backgroundColor: ["#618eff", "#ffffff"],
        borderWidth: 0,
      },
    ],
  };
  const data_performance = {
    labels: ["P"],
    datasets: [
      {
        label: "",
        data: [oeeData.P, 100 - oeeData.P], //[History_data.run, History_data.stop, History_data.alarm],
        backgroundColor: ["#ffe261", "#ffffff"],
        borderWidth: 0,
      },
    ],
  };
  const data_quality = {
    labels: ["Q"],
    datasets: [
      {
        label: "",
        data: [10, 20], //[History_data.run, History_data.stop, History_data.alarm],
        backgroundColor: ["#61ff8b", "#ffffff"],
        borderWidth: 0,
      },
    ],
  };

  const option = {
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      y: {
        ticks: {
          font: {
            size:
              (window.innerWidth / 1000) * 6 + (window.innerHeight / 1000) * 12,
            family: "vazir",
            weight: "bolder",
          },
          color: "dark",
        },
      },
    },
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
        color: ["red", "black", "blue"],
        formatter: Math.round(1),
        anchor: "center",
        offset: 0,
        align: "end",
        font: {
          weight: "900",
          size:
            (window.innerWidth / 1000) * 10 + (window.innerHeight / 1000) * 12,
        },
      },
      legend: {
        display: false,
      },
    },
  };

  function handleResize() {
    //console.log("resized to: ", window.innerWidth, "x", window.innerHeight);
  }



  window.addEventListener("resize", handleResize);
  return (
    <div
      className={History_data.status == "Alarm" ? "Simple-machine-box" : ""}
      style={{
        border: "2px solid rgba(221, 221, 221, 0.5)",
        borderRadius: "17px",
        margin: "1vh 0.3vw 1vh 0.3vw",
        // height: '40vh',
      }}
    >
      <div
        onClick={() => navigate("/detail/" + props.id_identification)}
        style={{ cursor: "pointer" }}
      >
        <div
          className="md:text-5xl font-bold p-1 text-xs"
          style={{
            paddingLeft: "10px",
            backgroundColor: "darkblue",
            borderRadius: "12px 0 12px 0",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>{props ? props.Number : "no_name"}</div>
          <div style={{ paddingRight: "1rem", color: History_data.OEE < limit_indicator.low ? propss.color_status.Alarm:History_data.OEE < limit_indicator.middle? propss.color_status.Stop:propss.color_status.Run }} className="text-4xl" >
            {OEE_Mode ? `${(History_data.OEE * 100).toFixed(2)}%` : History_data.scale}
          </div>
        </div>

        <div
          className="main-info-group"
          style={{
            fontSize: "30px",
            // fontFamily: 'cursive',
            height: "100%",
          }}
        >
          <div className="pt-4" style={{ height: "30vh" }}>
            {OEE_Mode ? (
              <div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div>
                    <div className="m-1">
                      <div>
                        <CircularProgressbar
                          value={History_data.A * 100}
                          text={ propss.flipremark?`${(History_data.A * 100).toFixed(2)}%`:"A"}
                          styles={buildStyles({
                            pathColor: History_data.A < limit_indicator.low ? propss.color_status.Alarm:History_data.A < limit_indicator.middle? propss.color_status.Stop:propss.color_status.Run,
                            textSize: propss.flipremark?'':'45px',
                          })}
                        />
                      </div>

                      {/* <Doughnut data={data_availability} options={option_oee} height={"100vh"} width='100%'>  </Doughnut> */}
                      {/* <div className="radial-progress text-primary m-2" style={{"--value":100, "--size":SizeRadial, minHeight:'100%'}}>{(History_data.A * 100).toFixed(2)}%</div> */}
                      {/* <div className="radial-progress" style={{ "--value": History_data.A * 100, "--size": "5.7vw", "--thickness": "0.7vw", color: '#618eff', backgroundColor: 'grey' }}>{(History_data.A * 100).toFixed(2)}%</div> */}
                    </div>
                    <div>
                      {/* <span style={{ color: "blue" }}>AV</span> */}
                    </div>
                  </div>
                  <div>
                    {/* <div>
                                            <div className="radial-progress" style={{ "--value": 1* 100, color: '#ffe261', backgroundColor: 'black' , "--size":SizeRadial}}>{(History_data.P * 100).toFixed(2)}%</div>
                                        </div> */}
                    <div>
                      <CircularProgressbar
                        value={History_data.P * 100}
                        text={ propss.flipremark?`${(History_data.P * 100).toFixed(2)}%`:"P"}
                        styles={buildStyles({
                          pathColor: History_data.P < limit_indicator.low ? propss.color_status.Alarm:History_data.P < limit_indicator.middle? propss.color_status.Stop:propss.color_status.Run,
                          textSize: propss.flipremark?'':'45px',
                        })}
                      />
                    </div>
                    <div>
                      {/* <p style={{ color: "red" }}>P</p> */}
                    </div>
                  </div>
                  <div>
                    {/* <div>
                                            <div className="radial-progress" style={{ "--value":1 * 100, color: '#61ff8b', backgroundColor: 'black', "--size":SizeRadial }}>{(History_data.Q * 100).toFixed(1)}%</div>
                                        </div> */}
                    <div>
                      <CircularProgressbar
                        value={History_data.Q * 100}
                        text={ propss.flipremark?`${(History_data.Q * 100).toFixed(2)}%`:"Q"}
                        styles={buildStyles({
                          pathColor: History_data.Q < limit_indicator.low ? propss.color_status.Alarm:History_data.Q < limit_indicator.middle? propss.color_status.Stop:propss.color_status.Run,
                          textSize: propss.flipremark?'':'45px',
                        })}
                      />
                    </div>
                    <div>
                      {/* <span style={{ color: "green" }}>Q</span> */}
                    </div>
                  </div>
                  <div style={{ paddingRight: "12px" }}>
                    <div>
                      <CircularProgressbar
                        value={History_data.OEE * 100}
                        text={ propss.flipremark?`${(History_data.OEE * 100).toFixed(2)}%`:"OEE"}
                        styles={buildStyles({
                          pathColor: History_data.OEE < limit_indicator.low ? propss.color_status.Alarm:History_data.OEE < limit_indicator.middle? propss.color_status.Stop:propss.color_status.Run,
                          textSize: propss.flipremark?'':'40px',
                        })}
                      />
                    </div>
                    <div>
                      {/* <span style={{ color: "purple" }}>OEE</span> */}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "",
                    // fontWeight: "bolder",
                    margin: "0 12px 0 12px",
                    padding: "5px",
                    borderRadius: "12px",
                  }}
                  className="text-xs md:text-xl"
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "2vmin",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Schedule</div>
                    <div style={{ paddingRight: "6vmin" }}>
                      {History_data.Schdeule}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "2vmin",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Target output</div>
                    <div style={{ paddingRight: "6vmin" }}>
                      {History_data.Target}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "2vmin",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Actual output</div>
                    <div style={{ paddingRight: "6vmin" }}>
                      {History_data.Output}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "2vmin",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>Cycle time</div>
                    <div style={{ paddingRight: "6vmin" }}>
                      {History_data.CT}s
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Bar data={data} options={option} height={"20vh"}></Bar>
            )}
          </div>
        </div>
        <div className="pt-4">
          {/* <div className='col-8'>
                        paddd
                    </div> */}
          {/* <span style={{position:'relative', left:'0', fontSize:'12px'}}>Shift:</span>{History_data.shift}  */}
          <div
            className=""
            style={{
              background: colorStatus,
              borderRadius: "0px 0px 14px 14px",
              width: "100%",
              textAlign: "center",
              fontWeight: "bolder",
              fontSize: "3.6vh",
              height: "5vh",
              // paddingTop:'0.4rem',
              // color: History_data.status == "Not operate" ? "white" : "",
            }}
          >
            {" "}
            {History_data.status ? History_data.status : "Unknown"}{" "}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Machinegroupmode;
