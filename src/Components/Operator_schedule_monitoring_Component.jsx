import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as moment from "moment";
import FakeSchedule from "../DummyData/FakeSchedule";
import { FiCheckCircle } from "@react-icons/all-files/fi/FiCheckCircle";
import ip_Server from "../../src/ServerConfig.js";
import { Alert } from "react-bootstrap";
let serverADR = ip_Server; //"http://dckr00162752:8001";
function Operator_schedule_monitoring_Component(props) {
  const navigate = useNavigate();
  const { MC } = useParams();
  const input_reject_qtt = useRef();
  const input_reject_code = useRef();
  const [ScheduleOeeLive, setScheduleOEELive] = useState([]);
  const [reJectCodeList, setRejectCodeList] = useState([]);
  const [ScheduleISLoaded, SetScheduleISLoaded] = useState(false);
  const [livEDownTime_list, setlivEDownTime_list] = useState();
  const [list_Reject_code, setlist_Reject_code] = useState([]);
  const [Downtime_list, setDowntimeList] = useState([]);
  const value_dt_to_be_input = useRef();
  const [input_adjust_output, Setinput_adjust_output] = useState(0);
  const [onloadeddata, setOnloadData] = useState(false);

  // async function get_Reject_code_list() {
  //     setlist_Reject_code([])
  //     await fetch(serverADR + "/get-rejectcode-list").then(res => res.json())
  //         .then(data => {
  //             console.log(data);
  //             data.map((data, index) => {
  //                 setlist_Reject_code(list_Reject_code => [...list_Reject_code,
  //                 <option value={data.Code} key={data._id}>[{data.Code}] {data.Description} </option>
  //                 ])
  //             })
  //         })
  // }

  async function init_data() {
    setlist_Reject_code([]);
    setDowntimeList([]);
    await fetch(`${serverADR}/Operator-screen-get-init-data `)
      .then((res) => res.json())
      .then((data) => {
        data.Reject_code.map((data) =>
          setlist_Reject_code((list_Reject_code) => [
            ...list_Reject_code,
            <option value={data.Code} key={data._id}>
              [{data.Code}] {data.Description}{" "}
            </option>,
          ])
        );
        data.Downtime_list.map((data) =>
          setDowntimeList((Downtime_list) => [
            ...Downtime_list,
            <option value={data.dt_code}>
              [{data.dt_code}] {data.dt_description}
            </option>,
          ])
        );
      });
  }

  async function Submit_Reject_data() {
    console.log(
      `RC ${input_reject_code.current.value} QT:${input_reject_qtt.current.value} id: ${ScheduleOeeLive._id}`
    );
    if (ScheduleISLoaded && input_reject_code.current.value != "--") {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Code: input_reject_code.current.value,
          Quantity: input_reject_qtt.current.value,
          Parent_schedule: ScheduleOeeLive._id,
        }),
      };
      console.log(requestOptions);
      // alert(data + " " + mesin_dipilih.current.value)
      try {
        await fetch(serverADR + "/Register-reject-part", requestOptions)
          .then((response) => response.json())
          .then
          // setTimeout(() => { get_Reject_code_list() }, 1500)
          ();
      } catch (error) {
        alert("error");
      }
    }
  }

  async function modify_doowntime_reason(id, target) {
    // console.log(`Change id:${id} code_dt:${value_dt_to_be_input.current.value}  target: ${target}`);
    try {
      // await fetch(`${serverADR}/modify_downtime_information/${id}/${value_dt_to_be_input.current.value}`).then(res => res.json())
      await fetch(`${serverADR}/modify_downtime_information/${id}/${target}`)
        .then((res) => res.json())
        .then((data) => {
          // alert(JSON.stringify(data))
        });
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    init_data();
  }, []);

  let my_data_found= false
  useEffect(() => {

    setScheduleOEELive(FakeSchedule);
    try {
      my_data_found= false
      props.Data_server.Schedule.forEach((element) => {
        if (MC == element.Machine.id_identification) {
          my_data_found=true
          // console.log(element);
          // console.log(`Machine ${element.Machine.id_identification}`);
          setScheduleOEELive(element);
          SetScheduleISLoaded(true);
          setlivEDownTime_list(
            element.Downtime_list.map((data_dt, no) => (
              <tr key={data_dt._id}>
                <td>{no + 1} </td>
                {data_dt.dt_code ? (
                  <td>
                    {" "}
                    [{data_dt.dt_code}] {data_dt.dt_description}
                  </td>
                ) : (
                  <td>
                    <select
                      name={data_dt._id}
                      id={data_dt._id}
                      onChange={(e) =>
                        modify_doowntime_reason(data_dt._id, e.target.value)
                      }
                      ref={value_dt_to_be_input}
                    >
                      {Downtime_list}
                    </select>
                  </td>
                )}
                {/* <td>{0}</td> */}
                <td> {moment(data_dt.time_issue).format("DD-MM HH:mm:ss")}</td>
                <td>
                  {new Date(data_dt.duration * 1000)
                    .toISOString()
                    .slice(11, 19)}
                </td>
              </tr>
            ))
          );
          setRejectCodeList(
            element.RejectHistory.map((data_reject, no) => (
              <tr key={data_reject._id}>
                <td>{no + 1}</td>
                <td>{data_reject.Code}</td>
                <td>{data_reject.Remarks}</td>
                <td>{data_reject.Quantity}</td>
                <td>{moment(data_reject.Date).format("dddd-MM HH:mm")}</td>
              </tr>
              // console.log('loop');
            ))
          );
        } else if(!my_data_found){
          setlivEDownTime_list();
          setRejectCodeList();
        }
      });
    } catch (error) {
      // console.log('error get');
    }
  }, [props.Data_server]);

  return (
    <div style={{ padding: "1vmin" }} className="">
      <h1 className="font-extrabold text-3xl text-blue-700">
        Schedule MC {MC}
      </h1>
      <div className="flex gap-3">
        <div className="col-md-4 text-md font-thin w-1/3 text-2xl">
          <p>Basic information</p>
          <div className="card" style={{ padding: "1vmin" }}>
            <table className="">
              <tr>
                <td>Operator</td>
                <td>
                  {ScheduleISLoaded
                    ? ScheduleOeeLive.Labour.Operator.Name
                    : "--"}
                </td>
              </tr>
              <tr>
                <td>Mfg Leader</td>
                <td>
                  {ScheduleISLoaded ? ScheduleOeeLive.Labour.Leader.Name : "--"}
                </td>
              </tr>
              <tr>
                <td>Schdeule</td>
                <td>
                  {ScheduleISLoaded ? ScheduleOeeLive.Planning.Schedule : "--"}
                </td>
              </tr>
              <tr>
                <td>Part Number</td>
                <td>
                  {ScheduleISLoaded
                    ? ScheduleOeeLive.Planning.Part_number
                    : "--"}
                </td>
              </tr>
            </table>
          </div>
          <div
            className="card"
            style={{ padding: "1vmin", marginTop: "2vmin" }}
          >
            <table>
              <tr>
                <td>Target Output</td>
                <td>
                  {ScheduleISLoaded ? ScheduleOeeLive.Planning.Output : "--"}
                </td>
              </tr>
              <tr>
                <td> Actual Output</td>
                <td>
                  {ScheduleISLoaded ? ScheduleOeeLive.Actual.Output : "--"}
                </td>
              </tr>
              <tr>
                <td> Actual Reject</td>
                <td>
                  {ScheduleISLoaded
                    ? ScheduleOeeLive.Actual.Output_reject
                    : "--"}
                </td>
              </tr>
              <tr>
                <td>Ideal Cycle Time</td>
                <td>
                  {ScheduleISLoaded
                    ? ScheduleOeeLive.Planning.Cycle_time + "s"
                    : "--"}
                </td>
              </tr>
              <tr>
                <td>Actual Cycle Time</td>
                <td>
                  {ScheduleISLoaded
                    ? ScheduleOeeLive.Actual.Cycle_time + "s"
                    : "--"}
                </td>
              </tr>
              <tr>
                <td>Planning Down time</td>
                <td>
                  {ScheduleISLoaded
                    ? (
                        ScheduleOeeLive.Planning.Down_time_in_seconds / 60
                      ).toFixed(0) + " mins"
                    : "--"}
                </td>
              </tr>
              <tr>
                <td>Actual Down Time</td>
                <td>
                  {ScheduleISLoaded
                    ? new Date(
                        ScheduleOeeLive.Actual.Down_time_in_seconds * 1000
                      )
                        .toISOString()
                        .slice(11, 19)
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Estimate Finish</td>
                <td>
                  {ScheduleISLoaded
                    ? moment(ScheduleOeeLive.Time_data.batch_end).format(
                        "HH:mm D-M-YYYY"
                      )
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Total operating time</td>
                <td>
                  {ScheduleISLoaded
                    ? new Date(ScheduleOeeLive.Actual.Operating_time * 1000)
                        .toISOString()
                        .slice(11, 19)
                    : ""}
                </td>
              </tr>
              <tr>
                <td></td>
              </tr>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-x-1 gap-y-5 pt-2">
            <label
              className="btn btn-lg btn-primary"
              htmlFor={
                ScheduleISLoaded
                  ? ScheduleOeeLive.Planning.Schedule == "No Schedule"
                    ? ""
                    : "adjust-output-modal"
                  : ""
              }
              onClick={
                () =>
                  ScheduleISLoaded
                    ? ScheduleOeeLive.Planning.Schedule == "No Schedule"
                      ? alert(
                          "Adjust output berlaku jika ada schedule pada mesin " +
                            MC
                        )
                      : Setinput_adjust_output(0)
                    : ""
              }
              // onClick={() => Setinput_adjust_output(0)}
            >
              {" "}
              Adjust output
            </label>
            <button className="btn btn-md btn-warning">Call mechanic</button>
            <button className="btn btn-xs btn-error">End schedule</button>
            <button
              className="btn btn-xs"
              onClick={() =>
                ScheduleISLoaded
                  ? ScheduleOeeLive.Planning.Schedule == "No Schedule"
                    ? navigate("/CreateSchedule/" + MC)
                    : alert(
                        `${ScheduleOeeLive.Planning.Schedule} belum selesai`
                      )
                  : navigate("/CreateSchedule/" + MC)
              }
            >
              Create schedule
            </button>
          </div>
        </div>
        <div className="w-2/3 ml-2">
          <div className="">
            <p className="font-extrabold text-3xl">Down Time submission</p>
            <div className="fixed_header_downtime">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Code</th>
                    {/* <th>Description</th> */}
                    <th>T.issue</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "#ff5e5e" }} className="">
                  {livEDownTime_list}
                </tbody>
              </table>
            </div>
          </div>
          <div className="">
            <p className="font-extrabold text-3xl">Reject part submission</p>
            <div style={{ display: "flex", gap: "2vmin" }}>
              <div className="form-control">
                <select
                  name=""
                  id=""
                  ref={input_reject_code}
                  className="text-5xl"
                >
                  <option value="--">Select reject</option>
                  {list_Reject_code}
                </select>
              </div>
              <div className="form-control">
                <input
                  className="input input-bordered w-full max-w-xs text-6xl font-bold"
                  type="number"
                  placeholder="1"
                  min={1}
                  ref={input_reject_qtt}
                />
              </div>
              <div style={{ color: "green" }}>
                <button
                  className="btn btn-lg btn-primary"
                  // style={{ color: "green", backgroundColor: "white" }}
                  onClick={() => Submit_Reject_data()}
                >
                  <FiCheckCircle />
                </button>
              </div>
            </div>
            <div
              className="fixed_header_downtime"
              style={{ paddingTop: "1vmin" }}
            >
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Code</th>
                    <th>Reason</th>
                    <th>Qty</th>
                    <th>T.issue</th>
                    {/* <th>Action code</th> */}
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "#faf87a" }}>
                  {reJectCodeList}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* area modal adjust output*/}
      <input
        type="checkbox"
        id="adjust-output-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <label
            htmlFor="adjust-output-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2 bg-error"
          >
            ✕
          </label>
          <h3 className="font-bold text-4xl">Prubahan output</h3>
          <p className="text-2xl pt-7">Masukkan nilai selisih</p>
          <div className="grid grid-cols-2 font-bold text-xl pt-7">
            <p>Aktual output saat ini</p>
            <p className="text-3xl pl-3">
              {ScheduleISLoaded ? ScheduleOeeLive.Actual.Output : "--"}
            </p>
            <p>Selisih nilai</p>
            <input
              type="number"
              className="pl-2 input input-borded input-error input-xs w-full max-w-xs text-3xl"
              min={1}
              max={1000}
              placeholder="Contoh 1"
              onChange={(e) => Setinput_adjust_output(e.target.value)}
            />
            <div></div>
            <div className="relative pt-2 pb-4">
              {onloadeddata ? (
                <>
                  <progress className="progress w-56 progress-warning"></progress>{" "}
                  <label htmlFor="">Tunggu...</label>
                </>
              ) : (
                <>
                  <button
                    className={
                      input_adjust_output < 1
                        ? "invisible"
                        : "btn btn-lg  absolute right-15 bg-error"
                    }
                    onClick={async () => {
                      setOnloadData(true);
                      await fetch(
                        `${serverADR}/adjust-output/minus/${input_adjust_output}/${ScheduleOeeLive._id}`
                      )
                        .then((res) => res.json())
                        // .then(setOnloadData(false))
                        // .then(res => res.json())
                        // .then()
                        .then(
                          setTimeout(() => {
                            setOnloadData(false);
                          }, 1500)
                        );
                    }}
                  >
                    -
                  </button>
                  <button
                    className={
                      input_adjust_output < 1
                        ? "invisible"
                        : "btn btn-lg ml-3 absolute right-0 bg-success"
                    }
                    onClick={async () => {
                      setOnloadData(true);
                      await fetch(
                        `${serverADR}/adjust-output/plush/${input_adjust_output}/${ScheduleOeeLive._id}`
                      )
                        .then((res) => res.json())
                        // .then(setOnloadData(false))

                        .then(
                          setTimeout(() => {
                            setOnloadData(false);
                          }, 1500)
                        );
                    }}
                  >
                    +
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="modal-action pt-4">
            {/* <label htmlFor="adjust-output-modal" className="btn btn-primary btn-xs">Confirm</label> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Operator_schedule_monitoring_Component;
