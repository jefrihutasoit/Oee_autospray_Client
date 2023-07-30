import Rect, { Component, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import LoadingAnim from "../Components/LoadingAnim";
import Machinegroupmode from "../Components/Machinegroupmode";
import Mini_chart from "../Components/Mini_chart";
// import io from 'socket.io-client'
import Gantiwarnabody from "../Components/Gantiwarnabody";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AiOutlineFieldTime } from "@react-icons/all-files/ai/AiOutlineFieldTime"
import { GrDocumentPerformance } from "@react-icons/all-files/gr/GrDocumentPerformance"
import ip_Server from "../../src/ServerConfig.js"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

import { Pie, Bar } from 'react-chartjs-2';
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
let serverADR = ip_Server//"http://dckr00162752:8001"

// const socket = io.connect(serverADR)


function Groupdashboard(prop) {
    const navigate = useNavigate()
    let { group } = useParams()
    const [tmpMClist1, setTmpMcList1] = useState([])
    const [statusHistory, setStatushistory] = useState([])
    const [firstinit, setFirstinit] = useState(false)
    const [operation_number, setOperationNumber] = useState({ run: 0, stop: 0, alarm: 0, total_machine: -1 })
    const [modeOEE, setModeOEE] = useState(true);
    const [stringScale, setStringScale] = useState(" seconds")
    const [dark_mode, setDarkMode] = useState(true);
    const [machine_on_load, setMachine_on_load] = useState(false)

    // const [summary_data, setSummary_data] = useState({total_machine:3, total_run:1, total_stop:3, total_alarm:6})
    let total_operation_number = [1, 2, 3, 0]
    let number_machine = 0
    let devide_scale = 1

    if(!group) group=1

    const getMcdata = async () => {
        // console.log('load');
        setTmpMcList1([])
        setStatushistory([])
        setFirstinit(false)
        await fetch(`${serverADR}/get-machine/` + group).then(data =>
            data.json())
            .then((json) => (
                // console.log(json),
                // console.log(json[0].id_identification),
                json.map((data, index) => {
                    number_machine = 1 + index
                    // console.log(data);
                    setTmpMcList1(tmpMClist1 => [...tmpMClist1, data])
                    setStatushistory(statusHistory => [...statusHistory, { status: 'Not running', run: 0, stop: 0, alarm: 0, id_identification: data.id_identification, shift: data.shift, date: data.batch_start, A: 1, P: 2, Q: 3, OEE: 4, Schdeule: '--', Target: '--', Output: '--', CT: 0 }])
                }),
                total_operation_number = [0, 0, 0, number_machine],
                setOperationNumber(total_operation_number),
                setFirstinit(true),
                setTimeout(() => {
                    setMachine_on_load(true)
                }, 1000)
            ))
        // console.log(number_machine);
    }

    const updateObjectInArray = (id) => {
        setStatushistory(current =>
            current.map(obj => {
                // console.log(obj[0].id_identification+"  "+ id);
                if (obj.id_identification === id) {
                    return { ...obj, run: '299', alarm: '500' };
                }
                return obj;
            }),
        );
    };

    async function update_my_(json) {
        // console.log(json);
        let loop_oee_found = false
        let scaleStr = " seconds"
        let TMPstatus="Not Running"
        total_operation_number = [0, 0, 0, 0]
        let TMP_OEE = {
            P: 0, Q: 0, A: 0, Schedule: '--', Target: "--", CT: '0', OEE: 0, Output: 0
        }
        // console.log(json.Schedule);
        json.mainDashboard.map((data, index) => {
            // console.log('on map');
            let loop = 0
            try {
                if (data == null) return
                setStatushistory(current =>
                    current.map(obj => {
                        let color_code = ""
                        if (obj.id_identification == data.id_identification) {
                            let req_id = obj.id_identification
                            //cari data oee
                            loop_oee_found = false;
                            json.Schedule.map((data1) => {
                                if (!loop_oee_found) {
                                    if (data1.Machine_id_identification == req_id) {
                                        // console.log(`Data1: ${data1.Machine_id_identification} req_id: ${req_id}`);
                                        TMP_OEE.A = data1.OEE_data.Availability
                                        TMP_OEE.P = data1.OEE_data.Performance
                                        TMP_OEE.Q = data1.OEE_data.Quality
                                        TMP_OEE.OEE = data1.OEE_data.OEE
                                        TMP_OEE.Schedule = data1.Planning.Schedule
                                        TMP_OEE.Target = data1.Planning.Output
                                        TMP_OEE.CT = data1.Actual.Cycle_time
                                        TMP_OEE.Output = data1.Actual.Output
                                        TMPstatus= data1.Machine.status
                                        loop_oee_found = true
                                        return;
                                    } else {
                                        TMP_OEE.A = 0
                                        TMP_OEE.P = 0
                                        TMP_OEE.Q = 0
                                        TMP_OEE.OEE = 0
                                        TMP_OEE.Schedule = "No Schedule"
                                        TMP_OEE.Target = '--'
                                        TMP_OEE.CT = "--"
                                        TMP_OEE.Output = "--"
                                    }
                                }
                            })

                            if (data.data.status === 'Run') total_operation_number[0] += 1
                            else if (data.data.status === 'Stop') total_operation_number[1] += 1
                            else if (data.data.status === 'Alarm') total_operation_number[2] += 1
                            total_operation_number[3] += 1
                            // console.log(total_operation_number[3]);
                            if (data.data.status == 'Run') color_code = '#65f76d'
                            else if (data.data.status == 'Stop') color_code = '#e8f765'
                            else if (data.data.status == 'Alarm') color_code = '#f76f65'
                            else color_code = 'rgb(111, 45, 211)'

                        

                            //bikin scale
                            devide_scale = 1
                            if (data.data.total_run > 7200 || data.data.total_stop > 7200 || data.data.total_alarm > 7200) { devide_scale = 3600; scaleStr = " hours" }
                            else if (data.data.total_run > 120 || data.data.total_stop > 120 || data.data.total_alarm > 120) { devide_scale = 60; scaleStr = " minutes" }
                            else scaleStr = ' seconds'
                            setOperationNumber(total_operation_number)
                            return {
                                ...obj, run: (data.data.total_run / devide_scale).toFixed(2),
                                alarm: (data.data.total_alarm / devide_scale).toFixed(2), stop: (data.data.total_stop / devide_scale).toFixed(2), status: TMPstatus, color_code: color_code, scale: scaleStr, shift: data.shift, date: data.batch_start,
                                A: TMP_OEE.A, P: TMP_OEE.P, Q: TMP_OEE.Q, OEE: TMP_OEE.OEE, Schdeule: TMP_OEE.Schedule, Target: TMP_OEE.Target, Output: TMP_OEE.Output, CT: TMP_OEE.CT
                            };
                        }
                        return obj;
                    }),
                );

                console.log("Cek:"+ data.data.status);

            } catch (error) {
                console.log('error');
            }
        })
        // 
        // console.log(total_operation_number[3]);
    }
    async function get_current_session() {
        await fetch(`${serverADR}/current-session-data/` + group).then(data =>
            data.json())
            .then((json) => (
                update_my_(json)
            ))
    }

    function handle_socket_data(raw) {
        try {
            update_my_(raw)
            console.log(raw);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (machine_on_load) handle_socket_data(prop.Data_server)
    }, [prop.Data_server]);

    const data = {
        labels: ["Not operate", 'Run', 'Stop/Idle', 'Alarm'],
        datasets: [
            {
                label: 's',
                data: [operation_number[3] - operation_number[0] - operation_number[1] - operation_number[2], operation_number[0], operation_number[1], operation_number[2]],
                backgroundColor: [
                    "rgb(111, 45, 211)",
                    '#93D56A',
                    '#E3E657',
                    '#EC6A6B'
                ],
                borderWidth: 1,
            },
        ],
    };

    const option = {

        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                    font: {
                        size: (window.innerHeight / 1000 * 9) + (window.innerWidth / 1000 * 5),
                        weight: 'bolder'
                    },
                    color: prop.dark_mode ? 'white' : 'black',
                }
            },
            datalabels: {
                display: true,
                color: "white",
                formatter: Math.round(1),
                anchor: "center",
                offset: 0,
                align: "center",
                font: {
                    weight: '900',
                    size: (window.innerHeight / 1000 * 10) + (window.innerWidth / 1000 * 7),
                }
            },
        }
    };


    let group_state = 1
    useEffect(() => {
        setTimeout(() => {
            getMcdata()
            // console.log('get mc');

        }, 200);

        // socket.on("fromServer", (data) => {
        //     handle_socket_data(data)
        // })


        // ini untuk slide show
        if (prop.slideShow) {
            const tm = setInterval(() => {

                if (group_state == 6) {
                    group_state = 1
                    group = 1
                    navigate(`${serverADR}`);
                } else {
                    getMcdata();
                    navigate(`/group-dashboard/${group_state}`);
                    group_state += 1
                    group = group_state;
                }
            }, 10000);
            return () => clearTimeout(tm);
        }
    }, [])

    let tmp_name_dashboard = ""
    let tmp_name_dashboard_j = ""

    return (
        // <div style={{ backgroundColor: prop.dark_mode ? 'black' : '', height: '100%' }}>
        <div style={{height: '100%' }}>
            {/* {prop.dark_mode ? Gantiwarnabody({ color: '#ffffff' }) : ''} */}
            {/* <button className="btn btn-sm btn-outline-success" style={{ position: 'absolute', right: '3rem' }} onClick={() => get_current_session()} >Get</button> */}
            {firstinit ?
                <div className="row " >
                    <div style={{ fontWeight: 'bolder', fontSize: '2vw', display:'none' }}>
                        {
                            tmpMClist1.map((machine, i) => {
                                if (tmp_name_dashboard != machine.original_name) {
                                    tmp_name_dashboard_j += (i > 0 ? " and " : " ") + machine.original_name;
                                    tmp_name_dashboard = machine.original_name
                                }
                            })
                        }
                        <div style={{ display: 'flex' }}>
                            <span style={{ paddingLeft: '2rem', backgroundColor: 'blue', width: 'fitContent', padding: '0 3rem 5px 1rem', borderRadius: '0 2rem 2rem 0', color: 'white' }}>{tmp_name_dashboard_j} </span>
                            <span onClick={() => setModeOEE(false)} style={{ marginLeft: '1vmin', paddingLeft: '2rem', backgroundColor: 'yellow', width: 'fitContent', padding: '1.3vmin 1rem 5px 1rem', borderRadius: '0 2rem 2rem 0', color: 'white', color: 'black', cursor: 'pointer', display: 'flex' }}> <AiOutlineFieldTime /> <span style={{ fontSize: '3vmin' }}>Operation time</span> </span>
                            <span onClick={() => setModeOEE(true)} style={{ paddingLeft: '2rem', backgroundColor: '#83f7c5', width: 'fitContent', padding: '1.3vmin 3rem 5px 1rem', borderRadius: '0 2rem 2rem 0', color: 'white', color: 'black', cursor: 'pointer', display: 'flex' }}> <GrDocumentPerformance /> <span style={{ fontSize: '3vmin' }}>OEE</span> </span>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div>
                            {group == 1 ?
                                <div className="flex flex-wrap">
                                    <div className="sm:w-300">< Machinegroupmode dark_mode={prop.dark_mode} data={tmpMClist1[0]} history={statusHistory[0]} mode_OEE={modeOEE} /></div>
                                    <div className="sm:w-300">< Machinegroupmode dark_mode={prop.dark_mode} data={tmpMClist1[1]} history={statusHistory[1]} mode_OEE={modeOEE} /></div>
                                    <div className="sm:w-300">< Machinegroupmode dark_mode={prop.dark_mode} data={tmpMClist1[2]} history={statusHistory[1]} mode_OEE={modeOEE} /></div>
                                    <div className="sm:w-300">< Machinegroupmode dark_mode={prop.dark_mode} data={tmpMClist1[3]} history={statusHistory[1]} mode_OEE={modeOEE} /></div>
                                    <div className="sm:w-300">< Machinegroupmode dark_mode={prop.dark_mode} data={tmpMClist1[4]} history={statusHistory[1]} mode_OEE={modeOEE} /></div>
                                    <div className="sm:w-300">< Mini_chart dark_mode={prop.dark_mode} data={tmpMClist1[4]} history={statusHistory[1]} mode_OEE={modeOEE} /></div>
                                </div> : <LoadingAnim />}


                        </div>
                    </div>
                    <div className="col-lg-3" style={{ position: window.innerWidth > 1000 ? 'fixed' : '', right: '0', paddingTop: '9vh', display: window.innerWidth < 1000 ? 'flex' : '' }}>
                        <div className={prop.dark_mode ? "card bg-dark" : 'card'} style={{ color: prop.dark_mode ? "white" : '', height: '50vh' }}>
                            <div style={{ fontWeight: 'bolder', fontSize: '2.4vw', paddingLeft: '3rem' }}>Utilization</div>
                            <div style={{ fontSize: '4vw', fontWeight: 'bolder', paddingLeft: '3rem' }}>{100 * ((operation_number[0] + operation_number[1] + operation_number[2]) / operation_number[3]).toFixed(2)}%</div>
                            <div className="card-body">
                                <div style={{ height: '100%', widht: '100%', paddingRight: '1rem' }}>
                                    <Pie data={data} options={option} width={"100%"} />
                                </div>
                            </div>
                            {/* <div className="card-footer bg-dark" style={{ color: 'white', fontSize: '20px', marging: '25px', fontStyle: 'bolder' }}>
                                <div className="row">
                                    <div className="col">Run</div>
                                    <div className="col">{(operation_number[0] / operation_number[3] * 100).toFixed(2)}%</div>
                                </div>
                                <div className="row">
                                    <div className="col">Stop/Idle</div>
                                    <div className="col">{(operation_number[1] / operation_number[3] * 100).toFixed(2)}%</div>
                                </div>
                                <div className="row">
                                    <div className="col">Alarm</div>
                                    <div className="col">{(operation_number[2] / operation_number[3] * 100).toFixed(2)}%</div>
                                </div>
                            </div> */}
                        </div>
                        <div style={{ paddingLeft: '3vw', zIndex: '2' }}>
                            <Group_card_summary dark_mode={prop.dark_mode} data={operation_number} />
                        </div>
                    </div>
                </div>
                : <LoadingAnim />
            }

        </div>
    )
}

export default Groupdashboard