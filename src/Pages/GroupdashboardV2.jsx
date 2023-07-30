import Rect, { Component, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingAnim from "../Components/LoadingAnim";
import Machinegroupmode from "../Components/Machinegroupmode";
import Mini_chart from "../Components/Mini_chart";
// import io from 'socket.io-client'
import Gantiwarnabody from "../Components/Gantiwarnabody";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { AiOutlineFieldTime } from "@react-icons/all-files/ai/AiOutlineFieldTime";
import { GrDocumentPerformance } from "@react-icons/all-files/gr/GrDocumentPerformance";
import ip_Server from "../ServerConfig.js";

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

import { Pie, Bar } from "react-chartjs-2";
import Group_card_summary from "../Components/Group_card_summary";
import jsPDF from "jspdf";
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

// let serverADR = "http://dckr00162752:8001"
let serverADR = ip_Server; //"http://dckr00162752:8001"

// const socket = io.connect(serverADR)

function Groupdashboard(prop) {
  const navigate = useNavigate();
  let { group } = useParams();
  const [tmpMClist1, setTmpMcList1] = useState([]);
  const [statusHistory, setStatushistory] = useState([]);
  const [firstinit, setFirstinit] = useState(false);
  const [operation_number, setOperationNumber] = useState({
    run: 0,
    stop: 0,
    alarm: 0,
    total_machine: -1,
  });
  const [modeOEE, setModeOEE] = useState(true);
  const [oeeSumaryOnschedule, setoeeSumaryOnschedule] = useState(0);
  // const [stringScale, setStringScale] = useState(" seconds")
  // const [dark_mode, setDarkMode] = useState(true);

  const [machine_on_load, setMachine_on_load] = useState(false);
  const limit_indicator = {
    low: 0.5,
    middle: 0.8,
  };
  const color_status = {
    Alarm: "#f00707",
    Run: "#07f00b",
    Stop: "#f0ec07",
    // Not Running:"grey"
  };

  // const [summary_data, setSummary_data] = useState({total_machine:3, total_run:1, total_stop:3, total_alarm:6})
  let total_operation_number = [1, 2, 3, 0];
  let number_machine = 0;
  let devide_scale = 1;

  if (!group) group = 1;

  const getMcdata = async () => {
    // console.log('load');
    setTmpMcList1([]);
    setStatushistory([]);
    setFirstinit(false);
    await fetch(`${serverADR}/get-machine/` + group)
      .then((data) => data.json())
      .then(
        (json) => (
          // console.log(json),
          // console.log(json[0].id_identification),
          json.map((data, index) => {
            number_machine = 1 + index;
            // console.log(data);
            setTmpMcList1((tmpMClist1) => [...tmpMClist1, data]);
            setStatushistory((statusHistory) => [
              ...statusHistory,
              {
                status: "Not running",
                run: 0,
                stop: 0,
                alarm: 0,
                id_identification: data.id_identification,
                shift: data.shift,
                date: data.batch_start,
                A: 1,
                P: 2,
                Q: 3,
                OEE: 4,
                Schdeule: "--",
                Target: "--",
                Output: "--",
                CT: 0,
              },
            ]);
          }),
          (total_operation_number = [0, 0, 0, number_machine]),
          setOperationNumber(total_operation_number),
          setFirstinit(true),
          setTimeout(() => {
            setMachine_on_load(true);
          }, 1000)
        )
      );
    // console.log(number_machine);
  };

  const updateObjectInArray = (id) => {
    setStatushistory((current) =>
      current.map((obj) => {
        // console.log(obj[0].id_identification+"  "+ id);
        if (obj.id_identification === id) {
          return { ...obj, run: "299", alarm: "500" };
        }
        return obj;
      })
    );
  };

  const [tempSumaryAVOee, settempSumaryAVOee] = useState(0.0);
  //   const [jumlahMesinRun, setJumlahmesinRun] = useState(0);
  //   let jumlah_mesin_active = 0;
  async function update_my_(json) {
    // console.log(json);
    let loop_oee_found = false;
    let scaleStr = " seconds";
    let TMPstatus = "Not Running";
    total_operation_number = [0, 0, 0, 0];
    let TMP_OEE = {
      P: 0,
      Q: 0,
      A: 0,
      Schedule: "--",
      Target: "--",
      CT: "0",
      OEE: 0,
      Output: 0,
    };
    // console.log(json.Schedule);
    let tmp_sum_oee = 0;
    let jumlah_mesin_active = 0;
    json.mainDashboard.map((data, index) => {
      // tempSumaryAVOee=0
      // jumlah_mesin_active=0
      // console.log('on map');
      let loop = 0;
      try {
        if (data == null) return;
        settempSumaryAVOee(0);
        // setJumlahmesinRun(0);
        setStatushistory((current) =>
          current.map((obj) => {
            let color_code = "";
            if (obj.id_identification == data.id_identification) {
              let req_id = obj.id_identification;
              //cari data oee
              loop_oee_found = false;
              json.Schedule.map((data1) => {
                if (!loop_oee_found) {
                  if (data1.Machine_id_identification == req_id) {
                    //operasi variable lain
                    tmp_sum_oee = data1.OEE_data.OEE + tmp_sum_oee;
                    jumlah_mesin_active += 1;
                    // settempSumaryAVOee(tempSumaryAVOee + data1.OEE_data.OEE);
                    // setJumlahmesinRun(jumlahMesinRun + 1);
                    // jumlah_mesin_active += 1;
                    //  console.log("Ketemu mang:"+ data1.OEE_data.OEE +"  "+ tempSumaryAVOee);
                  }
                  if (data1.Machine_id_identification == req_id) {
                    // console.log("MC:"+data1.Machine_id_identification+" status:"+  data1.Machine.status );
                    // console.log(`Data1: ${data1.Machine_id_identification} req_id: ${req_id}`);
                    TMP_OEE.A = data1.OEE_data.Availability;
                    TMP_OEE.P = data1.OEE_data.Performance;
                    TMP_OEE.Q = data1.OEE_data.Quality;
                    TMP_OEE.OEE = data1.OEE_data.OEE;
                    TMP_OEE.Schedule = data1.Planning.Schedule;
                    TMP_OEE.Target = data1.Planning.Output;
                    TMP_OEE.CT = data1.Actual.Cycle_time;
                    TMP_OEE.Output = data1.Actual.Output;
                    TMPstatus = data1.Machine.status;
                    loop_oee_found = true;

                    return;
                  } else {
                    TMP_OEE.A = 0;
                    TMP_OEE.P = 0;
                    TMP_OEE.Q = 0;
                    TMP_OEE.OEE = 0;
                    TMP_OEE.Schedule = "No Schedule";
                    TMP_OEE.Target = "--";
                    TMP_OEE.CT = "--";
                    TMP_OEE.Output = "--";
                    TMPstatus = "Not Running";
                  }
                }
              });
              settempSumaryAVOee(tmp_sum_oee / jumlah_mesin_active);
              // console.log("Sum>"+tmp_sum_oee + "   j:"+ jumlah_mesin_active)

              if (data.data.status === "Run") total_operation_number[0] += 1;
              else if (data.data.status === "Stop")
                total_operation_number[1] += 1;
              else if (data.data.status === "Alarm")
                total_operation_number[2] += 1;
              total_operation_number[3] += 1;
              // console.log(total_operation_number[3]);
              if (data.data.status == "Run") color_code = "#65f76d";
              else if (data.data.status == "Stop") color_code = "#e8f765";
              else if (data.data.status == "Alarm") color_code = "#f76f65";
              else color_code = "rgb(111, 45, 211)";

              //bikin scale
              devide_scale = 1;
              if (
                data.data.total_run > 7200 ||
                data.data.total_stop > 7200 ||
                data.data.total_alarm > 7200
              ) {
                devide_scale = 3600;
                scaleStr = " hours";
              } else if (
                data.data.total_run > 120 ||
                data.data.total_stop > 120 ||
                data.data.total_alarm > 120
              ) {
                devide_scale = 60;
                scaleStr = " minutes";
              } else scaleStr = " seconds";
              setOperationNumber(total_operation_number);
              return {
                ...obj,
                run: (data.data.total_run / devide_scale).toFixed(2),
                alarm: (data.data.total_alarm / devide_scale).toFixed(2),
                stop: (data.data.total_stop / devide_scale).toFixed(2),
                status: TMPstatus,
                color_code: color_code,
                scale: scaleStr,
                shift: data.shift,
                date: data.batch_start,
                A: TMP_OEE.A,
                P: TMP_OEE.P,
                Q: TMP_OEE.Q,
                OEE: TMP_OEE.OEE,
                Schdeule: TMP_OEE.Schedule,
                Target: TMP_OEE.Target,
                Output: TMP_OEE.Output,
                CT: TMP_OEE.CT,
              };
            }
            return obj;
          })
        );
        // console.log("Sum>"+tmp_sum_oee)
        // console.log("Cek:"+ data.data.status);
        // setoeeSumaryOnschedule(10)
      } catch (error) {
        console.log("error");
      }
    });
    //
    // console.log(total_operation_number[3]);
  }
  async function get_current_session() {
    await fetch(`${serverADR}/current-session-data/` + group)
      .then((data) => data.json())
      .then((json) => update_my_(json));
  }

  function handle_socket_data(raw) {
    try {
      update_my_(raw);
      // console.log(raw);
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {
    if (machine_on_load) handle_socket_data(prop.Data_server);
  }, [prop.Data_server]);

  const data = {
    labels: ["Not operate", "Run", "Stop/Idle", "Alarm"],
    datasets: [
      {
        label: "s",
        data: [
          operation_number[3] -
            operation_number[0] -
            operation_number[1] -
            operation_number[2],
          operation_number[0],
          operation_number[1],
          operation_number[2],
        ],
        backgroundColor: ["rgb(111, 45, 211)", "#93D56A", "#E3E657", "#EC6A6B"],
        borderWidth: 1,
      },
    ],
  };

  const option = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          font: {
            size:
              (window.innerHeight / 1000) * 9 + (window.innerWidth / 1000) * 5,
            weight: "bolder",
          },
          color: prop.dark_mode ? "white" : "black",
        },
      },
      datalabels: {
        display: true,
        color: "white",
        formatter: Math.round(1),
        anchor: "center",
        offset: 0,
        align: "center",
        font: {
          weight: "900",
          size:
            (window.innerHeight / 1000) * 10 + (window.innerWidth / 1000) * 7,
        },
      },
    },
  };

  let group_state = 1;
  useEffect(() => {
    setTimeout(() => {
      getMcdata();
      // console.log('get mc');
    }, 200);

    // socket.on("fromServer", (data) => {
    //     handle_socket_data(data)
    // })

    // ini untuk slide show
    if (prop.slideShow) {
      const tm = setInterval(() => {
        if (group_state == 6) {
          group_state = 1;
          group = 1;
          navigate(`${serverADR}`);
        } else {
          getMcdata();
          navigate(`/group-dashboard/${group_state}`);
          group_state += 1;
          group = group_state;
        }
      }, 10000);
      return () => clearTimeout(tm);
    }
  }, []);

  const [flipremark, setFLipRemark] = useState(false);
  let var_flip = false;
  useEffect(() => {
    const intv = setInterval(() => {
      var_flip = !var_flip;
      // setFLipRemark((flipremark) => !flipremark)
      setFLipRemark(var_flip);
    }, 4000);
    return () => clearInterval(intv);
  }, []);

  return (
    // <div style={{ backgroundColor: prop.dark_mode ? 'black' : '', height: '100%' }}>
    <div className="lg:flex p-2 gap-2  gap-y-2 resize-none md:resize">
      <div className="rounded-xl lg:w-3/4">
        {firstinit ? (
          <div>
            {group === 1 ? (
              <div className="grid  lg:grid-cols-3 sm:grid-cols-2">
                <div className="">
                  <Machinegroupmode
                    flipremark={flipremark}
                    color_status={color_status}
                    dark_mode={prop.dark_mode}
                    data={tmpMClist1[0]}
                    history={statusHistory[0]}
                    mode_OEE={modeOEE}
                  />
                </div>
                <div className="">
                  <Machinegroupmode
                    flipremark={flipremark}
                    color_status={color_status}
                    dark_mode={prop.dark_mode}
                    data={tmpMClist1[1]}
                    history={statusHistory[1]}
                    mode_OEE={modeOEE}
                  />
                </div>
                <div className="">
                  <Machinegroupmode
                    flipremark={flipremark}
                    color_status={color_status}
                    dark_mode={prop.dark_mode}
                    data={tmpMClist1[2]}
                    history={statusHistory[2]}
                    mode_OEE={modeOEE}
                  />
                </div>
                <div className="pt-4">
                  <Machinegroupmode
                    flipremark={flipremark}
                    color_status={color_status}
                    dark_mode={prop.dark_mode}
                    data={tmpMClist1[3]}
                    history={statusHistory[3]}
                    mode_OEE={modeOEE}
                  />
                </div>
                <div className="pt-4">
                  <Machinegroupmode
                    flipremark={flipremark}
                    color_status={color_status}
                    dark_mode={prop.dark_mode}
                    data={tmpMClist1[4]}
                    history={statusHistory[4]}
                    mode_OEE={modeOEE}
                  />
                </div>
                {/* <div className="">< Machinegroupmode dark_mode={prop.dark_mode} data={tmpMClist1[4]} history={statusHistory[4]} mode_OEE={modeOEE} /></div>  */}
                <div className="pt-4">
                  <Mini_chart
                    dark_mode={prop.dark_mode}
                    tempSumaryAVOee={tempSumaryAVOee}
                    color_status={color_status}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <LoadingAnim />
        )}
      </div>
      <div className="bg-info rounded-xl lg:w-1/4 mt-3 pt-10 pl-2">
        <p className="text-black font-bolder text-3xl">Output progress</p>
        <div className="flex gap-2 pt-5 text-black">
          <div>C071-1</div>
          <div>
            <progress
              className={
                firstinit
                  ? statusHistory[0].Output / statusHistory[0].Target <
                    limit_indicator.low
                    ? "progress progress-success"
                    : statusHistory[0].Output / statusHistory[0].Target <
                      limit_indicator.middle
                    ? "progress progress-success"
                    : "progress progress-success"
                  : "progress progress-success"
              }
              //   className="progress progress-error w-56"
              value={
                firstinit
                  ? (statusHistory[0].Output / statusHistory[0].Target) * 100
                  : 0
              }
              max="100"
            ></progress>
          </div>
          <div>
            [
            {`${
              firstinit
                ? (
                    (statusHistory[0].Output / statusHistory[0].Target) *
                    100
                  ).toFixed(2)
                : 0
            }%`}
            ]
          </div>
        </div>
        <progress
          className="progress progress-error w-56 bg-dark"
          value={50}
          max="100"
        ></progress>
        <progress
          className="progress progress-error w-56 bg-dark"
          value={50}
          max="100"
        ></progress>
        <progress
          className="progress progress-error w-56 bg-dark"
          value={50}
          max="100"
        ></progress>
        <progress
          className="progress progress-error w-56 bg-dark"
          value={50}
          max="100"
        ></progress>
        <progress
          className="progress progress-error w-56 bg-dark"
          value={50}
          max="100"
        ></progress>
        <progress
          className="progress progress-error w-56 bg-dark"
          value={50}
          max="100"
        ></progress>
      </div>
    </div>
  );
}

export default Groupdashboard;
