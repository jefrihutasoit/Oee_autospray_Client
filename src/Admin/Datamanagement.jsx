import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { TiDelete } from "@react-icons/all-files/ti/TiDelete";
import ip_Server from "../../src/ServerConfig.js";

let serverADR = ip_Server; //"http://localhost:8001";
function Datamanagement() {
  const input_part_number = useRef();
  const input_description1 = useRef();
  const input_description2 = useRef();
  const input_default_output_per_cycle = useRef();
  const input_default_ct = useRef();
  const input_default_target_output = useRef();
  const input_dt_code = useRef();
  const input_dt_description = useRef();
  const input_dt_planning_desc = useRef();
  const input_dt_planning_duration = useRef();
  const input_dt_planning_mandatory = useRef();
  const input_operator_name = useRef();
  const input_operator_id = useRef();
  const input_leader_name = useRef();
  const input_leader_id = useRef();
  const input_Reject_Code = useRef();
  const input_Reject_remarks = useRef();

  // const input_standard_cycle_time = useRef()
  const input_image = useRef();
  const [list_part, setPartlist] = useState([]);
  const [list_dt, setDtlist] = useState([]);
  const [list_dt_planning, setDtPlanlist] = useState([]);
  const [list_operator, setOperatorlist] = useState([]);
  const [list_leader, setLeaderlist] = useState([]);
  const [list_Reject_code, setlist_Reject_code] = useState([]);

  const [save_load, setSaveload] = useState(false);

  async function submit_data_part_list() {
    if (
      input_part_number.current.value.length < 4 ||
      input_description1.current.value.length < 4 ||
      input_default_output_per_cycle.current.value < 1 ||
      input_default_ct.current.value < 1 ||
      input_default_target_output.current.value < 5
    )
      return;
    setSaveload(true);
    // console.log(`Nama image: ${input_image.current.data}`);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          part_number: input_part_number.current.value,
          description1: input_description1.current.value,
          description2: input_description2.current.value,
          output_percycle: input_default_output_per_cycle.current.value,
          default_ct: input_default_ct.current.value,
          default_target_output: input_default_target_output.current.value,
        },
      ]),
    };
    // alert(data + " " + mesin_dipilih.current.value)
    try {
      await fetch(serverADR + "/register-parts", requestOptions)
        .then((response) => response.json())
        .then(
          // setCurrentstatus(data)
          // alert(data)
          setTimeout(() => {
            get_part_list();
          }, 1500)
        );
    } catch (error) {
      alert("error " + error);
      setSaveload(false);
    }
  }
  async function submit_data_dt_list() {
    if (
      input_dt_code.current.value.length < 1 ||
      input_dt_description.current.value.length < 3
    )
      return;
    setSaveload(true);
    // console.log(`Nama image: ${input_image.current.data}`);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          dt_code: input_dt_code.current.value,
          dt_description: input_dt_description.current.value,
        },
      ]),
    };
    // alert(data + " " + mesin_dipilih.current.value)
    try {
      await fetch(serverADR + "/register-dt", requestOptions)
        .then((response) => response.json())
        .then(
          // setCurrentstatus(data)
          // alert(data)
          setTimeout(() => {
            get_dt_list();
          }, 1500)
        );
    } catch (error) {
      alert("error");
      setSaveload(false);
    }
  }
  async function submit_data_remark_Reject() {
    if (
      input_Reject_Code.current.value.length < 1 ||
      input_Reject_remarks.current.value.length < 3
    )
      return;
    setSaveload(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          Code: input_Reject_Code.current.value,
          Description: input_Reject_remarks.current.value,
        },
      ]),
    };
    // alert(data + " " + mesin_dipilih.current.value)
    try {
      await fetch(serverADR + "/register-rejectcode", requestOptions)
        .then((response) => response.json())
        .then(
          setTimeout(() => {
            get_Reject_code_list();
          }, 1500)
        );
    } catch (error) {
      alert("error");
      setSaveload(false);
    }
  }

  async function submit_data_dt_planning() {
    if (
      input_dt_planning_desc.current.value.length < 1 ||
      input_dt_planning_duration.current.value < 3
    )
      return;
    setSaveload(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          dt_description: input_dt_planning_desc.current.value,
          dt_duration: input_dt_planning_duration.current.value,
        },
      ]),
    };
    // alert(data + " " + mesin_dipilih.current.value)
    try {
      await fetch(serverADR + "/register-dt-planning", requestOptions)
        .then((response) => response.json())
        .then(
          setTimeout(() => {
            get_dt_planning_list();
          }, 1500)
        );
    } catch (error) {
      alert("error");
      setSaveload(false);
    }
  }

  async function submit_data_operator(Role) {
    let input_id;
    let input_name;
    if (Role == "Operator") {
      input_id = input_operator_id.current.value;
      input_name = input_operator_name.current.value;
      if (
        input_operator_id.current.value.length < 3 ||
        (input_operator_name.current.value.length < 3 &&
          (Role != "Operator" || Role !== "Leader"))
      )
        return;
    } else if (Role == "Leader") {
      input_id = input_leader_id.current.value;
      input_name = input_leader_name.current.value;
      if (
        input_leader_id.current.value.length < 3 ||
        (input_leader_name.current.value.length < 3 &&
          (Role != "Operator" || Role !== "Leader"))
      )
        return;
    }
    setSaveload(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          ID: input_id,
          Name: input_name,
          Role: Role,
        },
      ]),
    };
    // alert(data + " " + mesin_dipilih.current.value)
    try {
      await fetch(serverADR + "/register-labour", requestOptions)
        .then((response) => response.json())
        .then(
          setTimeout(() => {
            get_labour_operator_list();
          }, 1500)
        );
    } catch (error) {
      alert("error");
      setSaveload(false);
    }
  }

  async function drop_data(data) {
    setSaveload(true);
    // await fetch(serverADR+'/drop/'+data).
    await fetch(serverADR + "/drop-parts/" + data, { method: "delete" })
      .then((res) => res.json())
      .then(
        setTimeout(() => {
          get_part_list();
          setSaveload(false);
        }, 800)
      );
  }
  async function drop_data_Reject(data) {
    setSaveload(true);
    await fetch(serverADR + "/drop-rejectcode/" + data, { method: "delete" })
      .then((res) => res.json())
      .then(
        setTimeout(() => {
          get_Reject_code_list();
          setSaveload(false);
        }, 800)
      );
  }

  async function drop_data_dt(data) {
    setSaveload(true);
    // await fetch(serverADR+'/drop/'+data).
    await fetch(serverADR + "/drop-dt/" + data, { method: "delete" })
      .then((res) => res.json())
      .then(
        setTimeout(() => {
          get_dt_list();
          setSaveload(false);
        }, 800)
      );
  }

  async function drop_data_dt_planning(data) {
    setSaveload(true);
    // await fetch(serverADR+'/drop/'+data).
    await fetch(serverADR + "/drop-dt-planning/" + data, { method: "delete" })
      .then((res) => res.json())
      .then(
        setTimeout(() => {
          get_dt_planning_list();
          setSaveload(false);
        }, 800)
      );
  }

  function get_edit_part_list(data1, data2, data3, data4, data5, data6) {
    // console.log('get');
    input_part_number.current.value = data1;
    input_description1.current.value = data2;
    input_description2.current.value = data3;
    input_default_output_per_cycle.current.value = data4;
    input_default_ct.current.value = data5;
    input_default_target_output.current.value = data6;
  }

  function get_edit_dt_list(data1, data2) {
    input_dt_code.current.value = data1;
    input_dt_description.current.value = data2;
  }
  function get_edit_dt_list_planning(data1, data2) {
    input_dt_planning_desc.current.value = data1;
    input_dt_planning_duration.current.value = data2;
  }

  function get_edit_operator(data1, data2) {
    input_operator_id.current.value = data1;
    input_operator_name.current.value = data2;
  }
  function get_edit_leader(data1, data2) {
    input_leader_id.current.value = data1;
    input_leader_name.current.value = data2;
  }
  function get_edit_Reject_code(data1, data2) {
    input_Reject_Code.current.value = data1;
    input_Reject_remarks.current.value = data2;
  }

  async function get_part_list() {
    setPartlist([]);
    await fetch(serverADR + "/get-parts")
      .then((res) => res.json())
      .then((data) => {
        data.map((data, index) => {
          setPartlist((list_part) => [
            ...list_part,
            <tr
              key={data._id}
              onClick={() =>
                get_edit_part_list(
                  data.part_number,
                  data.description1,
                  data.description2,
                  data.output_percycle,
                  data.default_ct,
                  data.default_target_output
                )
              }
            >
              {/* <td>{index + 1}</td> */}
              <td>{data.part_number}</td>
              <td>{data.description1}</td>
              <td>{data.description2}</td>
              <td>{data.output_percycle}</td>
              <td>{data.default_ct}</td>
              <td>{data.default_target_output}</td>
              <td style={{ color: "red", fontSize: "2vmin" }}>
                <TiDelete
                  style={{ cursor: "pointer" }}
                  value={data._id}
                  onClick={() => drop_data(data._id)}
                />
              </td>
            </tr>,
          ]);
        });
      });
    setSaveload(false);
  }

  async function get_Reject_code_list() {
    setlist_Reject_code([]);
    await fetch(serverADR + "/get-rejectcode-list")
      .then((res) => res.json())
      .then((data) => {
        data.map((data, index) => {
          setlist_Reject_code((list_Reject_code) => [
            ...list_Reject_code,
            <tr
              key={data._id}
              onClick={() => get_edit_Reject_code(data.Code, data.Description)}
            >
              <td>{index + 1}</td>
              <td>{data.Code}</td>
              <td>{data.Description}</td>
              <td style={{ color: "red", fontSize: "2vmin" }}>
                <TiDelete
                  style={{ cursor: "pointer" }}
                  value={data._id}
                  onClick={() => drop_data_Reject(data._id)}
                />
              </td>
            </tr>,
          ]);
        });
      });
    setSaveload(false);
  }

  async function get_dt_list() {
    setDtlist([]);
    await fetch(serverADR + "/get-dt-list")
      .then((res) => res.json())
      .then((data) => {
        data.map((data, index) => {
          setDtlist((list_dt) => [
            ...list_dt,
            <tr
              key={data._id}
              onClick={() =>
                get_edit_dt_list(data.dt_code, data.dt_description)
              }
            >
              <td>{index + 1}</td>
              <td>{data.dt_code}</td>
              <td>{data.dt_description}</td>
              <td style={{ color: "red", fontSize: "2vmin" }}>
                <TiDelete
                  style={{ cursor: "pointer" }}
                  value={data._id}
                  onClick={() => drop_data_dt(data._id)}
                />
              </td>
            </tr>,
          ]);
        });
      });
    setSaveload(false);
  }

  async function get_dt_planning_list() {
    setDtPlanlist([]);
    await fetch(serverADR + "/get-dt-planning-list")
      .then((res) => res.json())
      .then((data) => {
        data.map((data, index) => {
          setDtPlanlist((list_dt_planning) => [
            ...list_dt_planning,
            <tr
              key={data._id}
              onClick={() =>
                get_edit_dt_list_planning(
                  data.dt_description,
                  data.dt_duration,
                  data.required
                )
              }
            >
              <td>{index + 1}</td>
              <td>{data.dt_description}</td>
              <td>{data.dt_duration}</td>
              <td>{data.dt_duration}</td>
              <td>
                {data.required ? (
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      defaultChecked
                      disabled
                    ></input>
                  </div>
                ) : (
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      disabled
                      defaultChecked
                    ></input>
                  </div>
                )}
              </td>
              <td style={{ color: "red", fontSize: "2vmin" }}>
                <TiDelete
                  style={{ cursor: "pointer" }}
                  value={data._id}
                  onClick={() => drop_data_dt_planning(data._id)}
                />
              </td>
            </tr>,
          ]);
        });
      });
    setSaveload(false);
  }
  async function get_labour_operator_list() {
    await fetch(serverADR + "/get-labour")
      .then((res) => res.json())
      .then((data) => {
        setOperatorlist([]);
        setLeaderlist([]);
        data.map((data, index) => {
          // console.log(data);
          data.Role == "Operator"
            ? setOperatorlist((list_operator) => [
                ...list_operator,
                <tr
                  key={data._id}
                  onClick={() => get_edit_operator(data.ID, data.Name)}
                >
                  <td>{index + 1}</td>
                  <td>{data.ID}</td>
                  <td>{data.Name}</td>
                  <td style={{ color: "red", fontSize: "2vmin" }}>
                    <TiDelete
                      style={{ cursor: "pointer" }}
                      value={data._id}
                      onClick={() => drop_data_dt_planning(data._id)}
                    />
                  </td>
                </tr>,
              ])
            : setLeaderlist((list_leader) => [
                ...list_leader,
                <tr
                  key={data._id}
                  onClick={() => get_edit_leader(data.ID, data.Name)}
                >
                  <td>{index + 1}</td>
                  <td>{data.ID}</td>
                  <td>{data.Name}</td>
                  <td style={{ color: "red", fontSize: "2vmin" }}>
                    <TiDelete
                      style={{ cursor: "pointer" }}
                      value={data._id}
                      onClick={() => drop_data_dt_planning(data._id)}
                    />
                  </td>
                </tr>,
              ]);
        });
      });
    setSaveload(false);
  }

  useEffect(() => {
    // console.log('load');
    get_part_list();
    get_dt_list();
    get_dt_planning_list();
    get_labour_operator_list();
    get_Reject_code_list();
    // input_dt_planning_mandatory.current.value.defaultChecked
  }, []);

  return (
    <div style={{ padding: "12px", fontSize: "12px", paddingTop: "12vmin" }}>
      <div className="overflow-x-auto">
        <div>Part list</div>
        <table className="table table-xs table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <td>Part number</td>
              <td>Desc1</td>
              <td>Desc2</td>
              <td>Output/CYC[PCS]</td>
              <td> CT</td>
              <td>Target</td>
              <th>Act</th>
            </tr>
          </thead>
          <tbody>{list_part}</tbody>
          <tfoot>
            {/* <tr>
         Part list
        </tr>  */}
          </tfoot>
        </table>
      </div>

      <div style={{ paddingTop: "0", display: "flex", gap: "2vmin" }}>
        <div style={{ backgroundColor: "#e6e8e6" }} className="data_management">
          <div className="table_tittle">Part list</div>
          <table className="table ">
            <thead>
              <tr>
                {/* <th>No</th> */}
                <th>Part number</th>
                <th>Desc1</th>
                <th>Desc2</th>
                <th>Output/Cyc [pcs]</th>
                <th>Default CT [s]</th>
                <th>Default target [pcs]</th>
                <th>Act</th>
                {/* <th>Picture</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Register</td>
                <td>
                  {" "}
                  <input
                    type="text"
                    placeholder="HGR03-691A"
                    className="input input-bordered input-xs w-full max-w-xs"
                    ref={input_part_number}
                  />{" "}
                </td>
                <td>
                  {" "}
                  <input
                    type="text"
                    placeholder="PNT TORSO FR"
                    className="input input-bordered input-xs w-full max-w-xs"
                    ref={input_description1}
                  />{" "}
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Blue"
                    className="input input-bordered input-xs w-full max-w-xs"
                    ref={input_description2}
                  />
                </td>
                <td>
                  {" "}
                  <input
                    type="number"
                    placeholder="1"
                    className="input input-bordered input-xs w-full max-w-xs"
                    min="1"
                    defaultValue={1}
                    ref={input_default_output_per_cycle}
                  />
                </td>
                <td>
                  {" "}
                  <input
                    type="number"
                    placeholder="20"
                    className="input input-bordered input-xs w-full max-w-xs"
                    min="1"
                    defaultValue={15}
                    ref={input_default_ct}
                  />{" "}
                </td>
                <td>
                  {" "}
                  <input
                    type="number"
                    placeholder="1200"
                    className="input input-bordered input-xs w-full max-w-xs"
                    min={1}
                    defaultValue={500}
                    ref={input_default_target_output}
                  />{" "}
                </td>
                <td style={{}}>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => (save_load ? "" : submit_data_part_list())}
                  >
                    {save_load ? (
                      <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "Upsert"
                    )}
                  </button>
                </td>
              </tr>
              {list_part}
            </tbody>
          </table>
        </div>
        <div style={{ backgroundColor: "#d7e0db" }} className="data_management">
          <div className="table_tittle">Remark downtime</div>
          <table className="table ">
            <thead>
              <tr>
                <th>No</th>
                <th>Code</th>
                <th>Description</th>
                <th>Act</th>
                {/* <th>Picture</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Register</td>
                <td>
                  {" "}
                  <input
                    type="text"
                    placeholder="30"
                    className="input input-bordered input-xs w-full max-w-xs"
                    ref={input_dt_code}
                  />{" "}
                </td>
                <td>
                  {" "}
                  <input
                    type="text"
                    placeholder="Jig broken"
                    className="input input-bordered input-xs w-full max-w-xs"
                    ref={input_dt_description}
                  />{" "}
                </td>
                <td>
                  {/* <input type="file" placeholder='Picture' className='' accept='image/*' ref={input_image} /> */}
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => (save_load ? "" : submit_data_dt_list())}
                  >
                    {save_load ? (
                      <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "Upsert"
                    )}
                  </button>
                </td>
              </tr>
              {list_dt}
            </tbody>
          </table>
        </div>
      </div>
      <div
        style={{
          paddingTop: "0",
          display: "flex",
          gap: "2vmin",
          paddingTop: "2vmin",
        }}
      >
        <div style={{ backgroundColor: "#e6e8e6" }} className="data_management">
          <div className="table_tittle">Operator's/Labor</div>
          <table className="table ">
            <thead>
              <tr>
                <th>No</th>
                <th>ID</th>
                <th>NAME</th>
                {/* <th>Picture</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Register</td>
                <td>
                  {" "}
                  <input
                    type="text"
                    placeholder="14456"
                    className="input input-bordered input-xs w-full max-w-xs"
                    ref={input_operator_id}
                  />{" "}
                </td>
                <td>
                  {" "}
                  <input
                    type="text"
                    placeholder="Hartanto"
                    className="input input-bordered input-xs w-full max-w-xs"
                    ref={input_operator_name}
                  />{" "}
                </td>
                <td>
                  {/* <input type="file" placeholder='Picture' className='' accept='image/*' ref={input_image} /> */}
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() =>
                      save_load ? "" : submit_data_operator("Operator")
                    }
                  >
                    {save_load ? (
                      <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "Upsert"
                    )}
                  </button>
                </td>
              </tr>
              {list_operator}
            </tbody>
          </table>
        </div>
        <div style={{ backgroundColor: "#e6e8e6" }} className="data_management">
          <div className="table_tittle">Manufacturing leader</div>
          <table className="table ">
            <thead>
              <tr>
                <th>No</th>
                <th>ID</th>
                <th>NAME</th>
                {/* <th>Picture</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Register</td>
                <td>
                  {" "}
                  <input
                    type="text"
                    placeholder="14456"
                    className="input input-bordered input-xs w-full max-w-xs"
                    ref={input_leader_id}
                  />{" "}
                </td>
                <td>
                  {" "}
                  <input
                    type="text"
                    placeholder="Hartanto"
                    className="input input-bordered input-xs w-full max-w-xs"
                    ref={input_leader_name}
                  />{" "}
                </td>
                <td>
                  {/* <input type="file" placeholder='Picture' className='' accept='image/*' ref={input_image} /> */}
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() =>
                      save_load ? "" : submit_data_operator("Leader")
                    }
                  >
                    {save_load ? (
                      <div class="spinner-border text-info" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      "Upsert"
                    )}
                  </button>
                </td>
              </tr>
              {list_leader}
            </tbody>
          </table>
        </div>
      </div>
      <div
        tyle={{ paddingTop: "1vmin", display: "flex", gap: "2vmin" }}
        className="row"
      >
        <div className="col">
          <div
            style={{ backgroundColor: "#e6e8e6" }}
            className="data_management"
          >
            <div className="table_tittle">Planned downtime</div>
            <table className="table ">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Description</th>
                  <th>Duration [minutes]</th>
                  <th>Mandatory</th>
                  {/* <th>Picture</th> */}
                </tr>
              </thead>
              <tbody>
                <tr className="upsertRow">
                  <td>Register</td>
                  <td>
                    {" "}
                    <input
                      type="text"
                      placeholder="Briefing"
                      className="input input-bordered input-xs w-full max-w-xs"
                      ref={input_dt_planning_desc}
                    />{" "}
                  </td>
                  <td>
                    {" "}
                    <input
                      type="number"
                      min={1}
                      placeholder="10"
                      className="input input-bordered input-xs w-full max-w-xs"
                      ref={input_dt_planning_duration}
                    />{" "}
                  </td>
                  <td>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        ref={input_dt_planning_mandatory}
                      />
                    </div>
                  </td>
                  <td>
                    {/* <input type="file" placeholder='Picture' className='' accept='image/*' ref={input_image} /> */}
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() =>
                        save_load ? "" : submit_data_dt_planning()
                      }
                    >
                      {save_load ? (
                        <div class="spinner-border text-info" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        "Upsert"
                      )}
                    </button>
                  </td>
                </tr>
                {list_dt_planning}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col">
          <div
            style={{ backgroundColor: "#e6e8e6" }}
            className="data_management"
          >
            <div className="table_tittle">Reject code</div>
            <table className="table ">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Code</th>
                  <th>Remarks</th>
                  {/* <th>Picture</th> */}
                </tr>
              </thead>
              <tbody>
                <tr className="upsertRow">
                  <td>Register</td>
                  <td>
                    {" "}
                    <input
                      type="text"
                      min={1}
                      placeholder="11"
                      className="input input-bordered input-xs w-full max-w-xs"
                      ref={input_Reject_Code}
                    />{" "}
                  </td>
                  <td>
                    {" "}
                    <input
                      type="text"
                      placeholder="No material"
                      className="input input-bordered input-xs w-full max-w-xs"
                      ref={input_Reject_remarks}
                    />{" "}
                  </td>
                  <td>
                    {/* <input type="file" placeholder='Picture' className='' accept='image/*' ref={input_image} /> */}
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() =>
                        save_load ? "" : submit_data_remark_Reject()
                      }
                    >
                      {save_load ? (
                        <div class="spinner-border text-info" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        "Upsert"
                      )}
                    </button>
                  </td>
                </tr>
                {list_Reject_code}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Datamanagement;
