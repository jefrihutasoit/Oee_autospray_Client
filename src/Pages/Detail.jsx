import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react';
import * as moment from 'moment'
import { AiOutlineFilePdf } from '@react-icons/all-files/ai/AiOutlineFilePdf'
import jsPDF from 'jspdf';
import ip_Server from "../../src/ServerConfig.js"
import { FaFileCsv } from '@react-icons/all-files/fa/FaFileCsv'
// import Schedule_dummy from "../DummyData/FakeSchedule.js"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    scales,
    elements
} from 'chart.js';

import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import FakeSchedule from '../DummyData/FakeSchedule.js';



let serverADR = ip_Server//"http://dckr00162752:8001";
function Detail(props) {
    let { machine_req } = useParams()
    const [listOptionMC, setlistMcOption] = useState([])
    const [firstinit, setFirstinit] = useState(false)
    const start_date_filer = useRef()
    const end_date_filter = useRef()
    const machine_selected = useRef()
    const [operationHistory, setOperationHistory] = useState([])
    const [shiftlyHistory, setShiftlyHistory] = useState([])
    const [loadingdata, setLoadingdata] = useState(true)
    const [totalOperation, setTotaloperation] = useState({ run: 0, stop: 0, alarm: 0 })
    const [peakOperation, setPeakOperation] = useState({ run: 0, stop: 0, alarm: 0 })
    const [machineInfo, setmachineInfo] = useState([])
    const [defaultDateTimeEnd, seTdefaultDateTimeEnd] = useState("")
    const [defaultDateTimeStart, seTdefaultDateTimeStart] = useState("")
    const [dark_mode, setDarkMode] = useState(props.dark_mode);
    const [ScheduleOeeLive, setScheduleOEELive] = useState(FakeSchedule)
    const [ScheduleISLoaded, SetScheduleISLoaded] = useState(false)
    const [livEDownTime_list, setlivEDownTime_list] = useState([])
    const [reJectCodeList, setRejectCodeList] = useState([])
    const [isNoSchedule, setNoSchedule] = useState(true)
    let tmp_totalOperation = ({ run: 0, stop: 0, alarm: 0 })
    let tmp_peakOperation = ({ run: 0, stop: 0, alarm: 0 })
    let tmp_history_operation_data = []

    //data oee
    const [oeeData, setOEEdata] = useState({ P: 20, Q: 50.5, A: 70, OEE: 70 })

    async function init_first() {
        setlistMcOption([])
        await fetch(`${serverADR}/get-machine/0`).then(data => data.json())
            .then((machines) => {
                machines.map((machine, i) => (
                    setlistMcOption(listOptionMC => [...listOptionMC,
                    machine_req === machine.id_identification ? (
                        <option key={machine._id} value={machine.id_identification} defaultChecked>{machine.original_name + " " + machine.Number} </option>) : (
                        <option key={machine._id} value={machine.id_identification}>{machine.original_name + " " + machine.Number} </option>)
                    ])
                ))
                setFirstinit(true)
                setLoadingdata(false)
            })
    }

    const get_history = async (e) => {
        setlivEDownTime_list([])
        setRejectCodeList([])
        // setScheduleOEELive([])
        let tmp_filter_start = ""
        let tmp_filter_end = ""
        let tmp_mc_req = machine_req
        tmp_history_operation_data = []
        setLoadingdata(true)

        //menentukan delapan jam kedepan


        tmp_filter_end = end_date_filter.current.value
        tmp_filter_start = start_date_filer.current.value

        try {
            tmp_mc_req = e.target.value
            setScheduleOEELive(FakeSchedule)
        } catch (error) {
            tmp_mc_req = machine_selected.current.value
            //
            // console.log("manual load :" + start_date_filer.current.value + "--"+ end_date_filter.current.value);
        }
        // alert("hallo:" + tmp_mc_req)
        try {
            await fetch(`${serverADR}/get-history/${tmp_mc_req}/${tmp_filter_start}/${tmp_filter_end}`).then(data => data.json()
                .then((histories) => {
                    setmachineInfo(
                        <div style={{}} key={histories.machine_info[0]._id}>
                            <div className="row">
                                <div className="col-5" >Name</div>
                                <div className="col-7">:{histories.machine_info[0].original_name}</div>
                            </div>
                            <div className="row">
                                <div className="col-5" >Number</div>
                                <div className="col-7">:{histories.machine_info[0].Number}</div>
                            </div>
                        </div>
                    )
                    //  console.log(histories.machine_info);
                    setOperationHistory([])
                    setShiftlyHistory([])
                    histories.history.map((data, i) => (
                        function_tmp_history_operation_data(data.status, data.duration_on_second),
                        // ------
                        data.status == "Run" ? tmp_totalOperation.run += data.duration_on_second
                            : data.status == "Stop" ? tmp_totalOperation.stop += data.duration_on_second
                                : data.status == 'Alarm' ? tmp_totalOperation.alarm += data.duration_on_second : '',

                        data.status == "Run" ? tmp_peakOperation.run < data.duration_on_second ? tmp_peakOperation.run = data.duration_on_second : ''
                            : data.status == "Stop" ? tmp_peakOperation.stop < data.duration_on_second ? tmp_peakOperation.stop = data.duration_on_second : ''
                                : data.status == 'Alarm' ? tmp_peakOperation.alarm < data.duration_on_second ? tmp_peakOperation.alarm = data.duration_on_second : '' : '',

                        //-------
                        // console.log(data.start_time.$date.$numberLong /1000),
                        // console.log("time:"+ moment(data.start_time).format("Y-M-D h:m:s")),
                        setOperationHistory(operationHistory => [...operationHistory,
                        <tr key={i.toString()}>
                            <td style={{ borderRadius: '12px', margin: '3px 0px 3px 0px', borderStyle: 'groove', backgroundColor: data.status == "Run" ? 'green' : data.status == "Stop" ? 'yellow' : data.status == 'Alarm' ? 'red' : 'grey', color: 'black' }}>{data.status}</td>
                            <td>{data.shift}</td>
                            <td>{moment(data.start_time).format("Y-M-D h:m:s")}</td>
                            <td>{moment(data.end_time).format("Y-M-D h:m:s")}</td>
                            <td>{new Date(data.duration_on_second * 1000).toISOString().slice(11, 19)}</td>
                            <td>{data.work_condition}</td>
                        </tr>
                        ])
                    ))
                    // console.log(tmp_history_operation_data);
                    // tmp_history_operation_data.map((ele)=> console.log(ele.))
                    histories.history_shift.map((data, i) => (
                        setShiftlyHistory(shiftlyHistory => [...shiftlyHistory,
                        <tr key={i}>
                            <td>{data.shift}</td>
                            <td>{moment(data.batch_start).format("Y-M-D h:m:s")}</td>
                            <td>{new Date(data.data.total_run * 1000).toISOString().slice(11, 19)}</td>
                            <td>{new Date(data.data.total_stop * 1000).toISOString().slice(11, 19)}</td>
                            <td>{new Date(data.data.total_alarm * 1000).toISOString().slice(11, 19)}</td>
                            {/* <td>{data.data.total_run}</td>
                        <td>{data.data.total_stop}</td>
                        <td>{data.data.total_alarm}</td> */}
                        </tr>
                        ])
                    ))
                }
                ))

        } catch (error) {

        }
        setTotaloperation(tmp_totalOperation)
        setPeakOperation(tmp_peakOperation)
        setTimeout(() => {
            setLoadingdata(false)
        }, 1);
    }

    function function_tmp_history_operation_data(id, value) {
        // console.log(`histoPush:${tmp_history_operation_data}`);
        if (tmp_history_operation_data[id]) {
            tmp_history_operation_data[id] += value  //push(value);
        }
        else {
            // tmp_history_operation_data[id] = {};
            tmp_history_operation_data[id] = value
        }
    }

    const data_total_operation = {
        labels: ["Run", "Stop/Idle", "Alarm"],
        datasets: [
            {
                labes: 'Total data',
                data: [totalOperation.run, totalOperation.stop, totalOperation.alarm],
                backgroundColor: [
                    '#93D56A',
                    '#E3E657',
                    '#EC6A6B'
                ],
                borderWidth: 1,
            }
        ]
    }
    const data_peak_operation = {
        labels: ["Run", "Stop/Idle", "Alarm"],
        datasets: [
            {
                label: 'Total data (seconds)',
                data: [peakOperation.run, peakOperation.stop, peakOperation.alarm],
                backgroundColor: [
                    '#93D56A',
                    '#E3E657',
                    '#EC6A6B'
                ],
                borderWidth: 1,
            }
        ]
    }

    const data_peak_operation_option = {
        esponsive: true,
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: 20,
                        weight: 'bolder'
                    },
                    color: 'black'
                }
            },
            datalabels: {
                display: true,
                align: 'end',
                font: {
                    size: (window.innerHeight / 1000 * 10) + (window.innerWidth / 1000 * 7),//30,
                    weight: 'bolder'
                },
                color: 'black'
            }
        },
        scales: {
            y: {
                display: false,
                ticks: {
                    font: {
                        size: 20,
                        weight: 'bolder'
                    },
                    color: 'black'
                }
            },
            x: {
                ticks: {
                    color: 'black',
                    font: {
                        size: (window.innerHeight / 1000 * 9) + (window.innerWidth / 1000 * 8),//20,
                        weight: 'bolder'
                    }
                }
            }
        }
    }
    const data_total_operation_option = {
        maintainAspectRatio: false,
        // responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'left',
                align: 'center',
                labels: {
                    font: {
                        size: (window.innerHeight / 1000 * 10) + (window.innerWidth / 1000 * 7),//30,
                        weight: 'bolder'
                    },
                    color: 'black'
                }
            },
            datalabels: {
                display: true,
                font: {
                    size: (window.innerHeight / 1000 * 12) + (window.innerWidth / 1000 * 8),//30,
                    weight: 'bolder'
                },
                color: 'black'
            }
        }
    }


    // data oee

    const option_oee = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            datalabels: {
                display: false,
                color: ["red", 'black'],
                formatter: Math.round(1),
                anchor: "start",
                offset: -9,
                align: "end",
                font: {
                    weight: '900',
                    size: window.innerWidth / 1000 * 6 + window.innerHeight / 1000 * 4
                }
            },
            legend: {
                display: false
            },
        },
    };
    const data_oee = {
        labels: ['OEE'],
        datasets: [
            {
                label: "",
                data: ScheduleISLoaded ? [(ScheduleOeeLive.OEE_data.OEE * 100), 100 - (ScheduleOeeLive.OEE_data.OEE * 100)] : [0, 100],//[History_data.run, History_data.stop, History_data.alarm],
                backgroundColor: [
                    oeeData.OEE < 50 ? '#e34040' : oeeData.OEE < 70 ? '#e3d840' : '#93D56A',
                    '#ffffff',
                ],
                borderWidth: 0,
            },
        ],
    };
    const data_availability = {
        labels: ['A'],
        datasets: [
            {
                label: "",
                data: ScheduleISLoaded ? [(ScheduleOeeLive.OEE_data.Availability * 100), 100 - (ScheduleOeeLive.OEE_data.Availability * 100)] : [0, 100],//  [oeeData.A, 100 - oeeData.A],//[History_data.run, History_data.stop, History_data.alarm],
                backgroundColor: [
                    '#618eff',
                    '#ffffff',
                ],
                borderWidth: 0,
            },
        ],
    };
    const data_performance = {
        labels: ['P'],
        datasets: [
            {
                label: "",
                data: ScheduleISLoaded ? [(ScheduleOeeLive.OEE_data.Performance * 100), 100 - (ScheduleOeeLive.OEE_data.Performance * 100)] : [0, 100],//[History_data.run, History_data.stop, History_data.alarm],
                backgroundColor: [
                    '#ffe261',
                    '#ffffff',
                ],
                borderWidth: 0,
            },
        ],
    };
    const data_quality = {
        labels: ['Q'],
        datasets: [
            {
                label: "",
                data: ScheduleISLoaded ? [(ScheduleOeeLive.OEE_data.Quality * 100), 100 - (ScheduleOeeLive.OEE_data.Quality * 100)] : [0, 100],//[History_data.run, History_data.stop, History_data.alarm],
                backgroundColor: [
                    '#61ff8b',
                    '#ffffff',
                ],
                borderWidth: 0,
            },
        ],
    };



    useEffect(() => {
        let MC_Select = 0
        let loop_oee_found = false
        // try {
        //     MC_Select = machine_req
        // } catch (error) {
        //     MC_Select = machine_selected.current.value
        // }
        try {
            props.Data_server.Schedule.forEach(element => {
                // console.log(cnt);
                // console.log(`Selected ${machine_selected.current.value} elemet: ${element.Machine.id_identification}`);
                if (!loop_oee_found) {
                    if (machine_selected.current.value == element.Machine.id_identification) {
                        // console.log("sama");
                        // console.log(`Machine ${element.Machine.id_identification}`);
                        loop_oee_found = true
                        setScheduleOEELive(element)
                        SetScheduleISLoaded(true)
                        setNoSchedule(false)
                        setlivEDownTime_list(
                            element.Downtime_list.map((data_dt, no) => (
                                <tr key={data_dt._id}>
                                    <td>{no + 1} </td>
                                    <td>{data_dt.dt_code < 0 ?'--':data_dt.dt_code}</td>
                                    <td className={data_dt.dt_code > 0?'':'blink'}>{ data_dt.dt_code > 0 ?data_dt.dt_description:'Wait confirmation'}</td>
                                    <td>{moment(data_dt.time_issue).format("DD-MM HH:mm:ss")}</td>
                                    <td>{new Date((data_dt.duration * 1000)).toISOString().slice(11, 19)}</td>
                                </tr>
                            ))
                        )
                        setRejectCodeList(
                            element.RejectHistory.map((data_reject, no) => (
                                <tr key={data_reject._id}>
                                    <td>{no + 1}</td>
                                    <td>{data_reject.Code}</td>
                                    <td>{data_reject.Remarks}</td>
                                    <td>{data_reject.Quantity}</td>
                                    <td>{moment(data_reject.Date).format('dddd-MM HH:mm')}</td>
                                </tr>
                                // console.log('loop');
                            ))
                        )
                    } else {
                        setScheduleOEELive(FakeSchedule)
                        setNoSchedule(true)

                        // console.log(`tidak sama  ${machine_selected.current.value}  ${element.Machine.id_identification}`);
                        // console.log(element);
                    }
                }
            });
        } catch (error) {
            // console.log('error get');
        }

    }, [props.Data_server])
    useEffect(() => {
        setTimeout(() => {
            init_first()
            if (machine_req) {
                get_history({ target: { value: machine_req } })
            }
        }, 1);
        seTdefaultDateTimeStart(`${moment().subtract(1, 'days').format('y-MM-DD')}T${moment().format('HH:mm')}`)
        seTdefaultDateTimeEnd(`${moment().format('y-MM-DD')}T${moment().add(1, 'hours').format('HH:mm')}`)
        //  
        // console.log('call effect');
        // console.log("-----Dummy-----");
        // console.log(Schedule_dummy);
        // console.log("---Dummy------");
        // console.log(ScheduleOeeLive);
        //   console.log(`time:${moment().format('H:m')}`);
    }, [])

    var PDFinstance = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a2'
    })

    async function renderPDF() {
        setLoadingdata(true)
        var content2 = document.getElementById('operationHistoryContent')
        var content1 = document.getElementById('shiftlyHistoryContent')
        PDFinstance.html(content2, {
            callback: function (pdfRes) {
                // console.log("in processing");
                pdfRes.save("Detail render PDF.pdf")
                setLoadingdata(false)
            }
        })
    }

    return (
        // <div id='wrapDetail' style={{ color: props.dark_mode ? 'white' : '', backgroundColor: props.dark_mode ? 'black' : 'white' }}>
        <div id='wrapDetail'>
            <div style={{ display: 'flex' }}>
                <div style={{ fontWeight: 'bolder', fontSize: '33px', display: 'flex' }} >
                    <span style={{ paddingLeft: '2rem', marginBottom: '0.4rem', backgroundColor: 'blue', width: 'fitContent', padding: '0 3rem 5px 1rem', borderRadius: '0 2rem 2rem 0', color: 'white' }}>Machine History</span>
                    {loadingdata ? (
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginLeft: '3rem' }} className="spinner-grow text-warning" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <span style={{ color: 'red', fontSize: '20px', marginLeft: '2rem' }}>Loading...</span>
                        </div>)
                        : ''
                    }
                </div>
            </div>
            <div className='flex bg-info pt-3 justify-between'>
                <div className='flex gap-2 pl-12 pb-4'>
                    <div >Machine</div>
                    <div>
                        <select name="" id="" className='select select-bordered select-xs w-full max-w-xs' onChange={get_history} ref={machine_selected} >
                            {listOptionMC}
                        </select>
                    </div>
                </div>
                <div  className='flex gap-2 '>
                    <div>Range</div>
                    <input type="datetime-local" ref={start_date_filer} defaultValue={defaultDateTimeStart} className='input input-bordered input-xs w-full max-w-xs'/>
                    <input type="datetime-local" ref={end_date_filter} defaultValue={defaultDateTimeEnd}  className='input input-bordered input-xs w-full max-w-xs'/>
                    <button onClick={() => get_history()} className='btn btn-sm btn-outline-danger mr-5' >find</button>
                </div>
            </div>
            <div style={{ top: '2rem', position: 'relative' }}>
                <div style={{ padding: '3vmin' }}>
                    {/* {isNoSchedule ? "" : */}
                    <div style={{ display: 'flex', visibility: isNoSchedule ? 'hidden' : 'visible' }}>
                        <p>Live</p>
                        <div style={{ marginLeft: '3vmin', marginBottom: '1vmin' }} className="spinner-grow text-warning" role="status">
                        </div>
                    </div>
                    {/* } */}
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1vmin' }}>
                                <div >
                                    <img src="/assets/machinelogo/coldForging1.png" alt="image not found" style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '1vmin' }} />
                                </div>
                                <div className= {ScheduleOeeLive.Machine.status=='Run'?'':ScheduleOeeLive.Machine.status=='--'?'':'blink'} style={{ backgroundColor: ScheduleISLoaded ? ScheduleOeeLive.Machine.status =='Run'? '#03fc90':ScheduleOeeLive.Machine.status =='Alarm'?'#fc0307':ScheduleOeeLive.Machine.status =='Stop'?'#fcfc03':'#cccccc':'#cccccc', width: '100%', borderRadius: '3vmin' }}>
                                    <div style={{ position: 'relative', top: '45%', left: '40%', fontSize:'40px', fontWeight:'bold' }}>
                                        {ScheduleISLoaded ? ScheduleOeeLive.Machine.status : ''}
                                    </div>
                                </div>
                            </div>
                            <div>
                                Down time
                                <div className='fixed_header_downtime'>
                                    <table className='table bg-light'>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Code</th>
                                                <th>Description</th>
                                                <th>T.issue</th>
                                                <th>Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {livEDownTime_list}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div>
                                Reject parts
                                <div className='fixed_header_downtime'>
                                    <table className='table bg-light'>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Code</th>
                                                <th>Reason</th>
                                                <th>Qty</th>
                                                <th>T.issue</th>
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {reJectCodeList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-6">
                            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '3vmin', backgroundColor: '#f5f4eb', borderRadius: '2vmin' }}>
                                <div style={{ paddingTop: '2vmin' }}>
                                    <Doughnut data={data_oee} options={option_oee} height="200%" width='200%'>  </Doughnut>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ color: 'purple', fontSize: '10vmin', fontWeight: 'bold', position: 'relative', top: '10%', left: '10%', transform: 'translate(-50%, -50%)', margin: '0' }}>
                                        <span style={{ fontSize: '2vmin' }}>OEE=</span>
                                        <div style={{ fontSize: '7vmin' }}>
                                            {ScheduleISLoaded ? (ScheduleOeeLive.OEE_data.OEE * 100).toFixed(1) : 0}%

                                        </div>
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1vmin', justifyContent: 'space-between', paddingTop: '2vmin', backgroundColor: '#d6d6d6', borderRadius: '1vmin', padding: '1vmin 4vmin 0 4vmin', marginTop: '1vmin' }}>
                                <div style={{}}>
                                    <div>
                                        <Doughnut data={data_availability} options={option_oee} height="190%" width='100%'>  </Doughnut>
                                    </div>
                                    <div style={{}}>
                                        <span style={{ color: 'blue', fontSize: '3vmin', fontWeight: 'bold', position: 'relative', top: '50%', left: '10%', transform: 'translate(-50%, -50%)', margin: '0' }}><span style={{ fontSize: '2vmin' }}>AV=</span> {ScheduleISLoaded ? (ScheduleOeeLive.OEE_data.Availability * 100).toFixed(2) : 0}%</span>
                                    </div>
                                </div>
                                <div style={{}}>
                                    <div>
                                        <Doughnut data={data_performance} options={option_oee} height="190%" width='100%'>  </Doughnut>

                                    </div>
                                    <div>
                                        <span style={{ color: 'red', fontSize: '3vmin', fontWeight: 'bold', position: 'relative', top: '50%', left: '10%', transform: 'translate(-50%, -50%)', margin: '0' }}><span style={{ fontSize: '2vmin' }}>P=</span>  {ScheduleISLoaded ? (ScheduleOeeLive.OEE_data.Performance * 100).toFixed(2) : 0}%</span>
                                    </div>
                                </div>
                                <div style={{}}>
                                    <div>
                                        <Doughnut data={data_quality} options={option_oee} height="190%" width='100%'>  </Doughnut>
                                    </div>
                                    <div>
                                        <span style={{ color: '#7afa96', fontSize: '3vmin', fontWeight: 'bold', position: 'relative', top: '50%', left: '10%', transform: 'translate(-50%, -50%)', margin: '0' }}><span style={{ fontSize: '2vmin' }}>Q=</span>  {ScheduleISLoaded ? (ScheduleOeeLive.OEE_data.Quality * 100).toFixed(2) : 0}%</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ paddingTop: '3vmin' }}>
                                <p>Output progress</p>
                                <div style={{ height: '3vmin' }}>
                                    <div className="progress" style={{ height: '100%' }}>
                                        <div className="progress-bar bg-danger" role="progressbar" style={{ width: ScheduleISLoaded ? (`${(ScheduleOeeLive.Actual.Output / ScheduleOeeLive.Planning.Output * 100).toFixed(2)}%`) : '0%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{ScheduleISLoaded ? `${(ScheduleOeeLive.Actual.Output / ScheduleOeeLive.Planning.Output * 100).toFixed(2)}%` : '0%'}</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ paddingTop: '1.4vmin', paddingBottom: '6vmin' }}>
                                <p>Working time</p>
                                <div style={{ height: '3vmin' }}>
                                    <div className="progress" style={{ height: '100%' }}>
                                        <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${ScheduleISLoaded ? (ScheduleOeeLive.Actual.Operating_time / (ScheduleOeeLive.Planning.Down_time_in_seconds + (ScheduleOeeLive.Planning.Cycle_time * ScheduleOeeLive.Planning.Output)) * 100).toFixed(2) : '0'}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{ScheduleISLoaded ? (ScheduleOeeLive.Actual.Operating_time / (ScheduleOeeLive.Planning.Down_time_in_seconds + (ScheduleOeeLive.Planning.Cycle_time * ScheduleOeeLive.Planning.Output)) * 100).toFixed(2) : '0'}%</div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6" style={{ fontWeight: 'bolder' }}>
                            <div style={{ paddingTop: '0px', display: '', gap: '1vmin', fontSize: '1.6vmin' }}>
                                <div style={{ borderRadius: '10px', margin: '2px' }} className='bg-light'>
                                    <div style={{ padding: '0.5vmin' }}>
                                        <table className='table table-sm'>
                                            <tbody>
                                                <tr>
                                                    <td>Schedule</td>
                                                    {
                                                        ScheduleISLoaded ?
                                                            <td>{ScheduleOeeLive.Planning.Schedule}</td> : ''
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Part number</td>
                                                    {
                                                        ScheduleISLoaded ?
                                                            <td>{ScheduleOeeLive.Planning.Part_number}</td> : ''
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Operator name</td>
                                                    {
                                                        ScheduleISLoaded ?
                                                            <td>{ScheduleOeeLive.Labour.Operator.Name}</td> : ''
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Leader manf</td>
                                                    {
                                                        ScheduleISLoaded ?
                                                            <td>{ScheduleOeeLive.Labour.Leader.Name}</td> : ''
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Shift</td>
                                                    {
                                                        ScheduleISLoaded ?
                                                            <td>{ScheduleOeeLive.Time_data.shift}</td> : ''
                                                    }
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div style={{ borderRadius: '10px', margin: '2px' }} className='bg-light'>
                                    <div style={{ padding: '0.5vmin' }}>
                                        <table className='table table-sm'>
                                            <tbody>

                                                <tr>
                                                    <td>Target output</td>
                                                    {
                                                        ScheduleISLoaded ?
                                                            <td>{ScheduleOeeLive.Planning.Output}</td> : 'n/a'
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Ideal CT</td>
                                                    {
                                                        ScheduleISLoaded ?
                                                            <td>{ScheduleOeeLive.Planning.Cycle_time}s</td>
                                                            : 'n/a'
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Start schedule</td>
                                                    {
                                                        ScheduleISLoaded ?
                                                            <td>{moment(ScheduleOeeLive.Time_data.batch_start).format('HH:mm D-M-YYYY')}</td> : 'n/a'
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Estimate finish</td>
                                                    {
                                                        ScheduleISLoaded ?
                                                            <td>{moment(ScheduleOeeLive.Time_data.batch_end).format('HH:mm D-M-YYYY')}</td> : ''
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Downtime planning</td>
                                                    {
                                                        ScheduleISLoaded ? <td>{(ScheduleOeeLive.Planning.Down_time_in_seconds / 60).toFixed(2)} mins</td> : ''
                                                    }
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div style={{ borderRadius: '10px', margin: '2px' }} className='bg-light'>
                                    <div style={{ padding: '0.5vmin' }}>
                                        <table className='table table-sm'>
                                            <tbody>
                                                <tr>
                                                    <td>Actual output</td>
                                                    {
                                                        ScheduleISLoaded ? <td>{ScheduleOeeLive.Actual.Output}</td> : ''
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Total reject</td>
                                                    {
                                                        ScheduleISLoaded ? <td>{ScheduleOeeLive.Actual.Output_reject}</td> : ''
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Actual CT</td>
                                                    {
                                                        ScheduleISLoaded ? <td>{ScheduleOeeLive.Actual.Cycle_time}</td> : ''
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Operating time</td>
                                                    {
                                                        ScheduleISLoaded ? <td>{new Date((ScheduleOeeLive.Actual.Operating_time * 1000)).toISOString().slice(11, 19)}</td> : ''
                                                    }
                                                </tr>
                                                <tr>
                                                    <td>Down time</td>
                                                    {
                                                        ScheduleISLoaded ? <td>{new Date((ScheduleOeeLive.Actual.Down_time_in_seconds * 1000)).toISOString().slice(11, 19)}</td> : ''
                                                    }
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ padding: '3vmin' }}>
                    <p>History</p>
                    <p style={{ backgroundColor: props.dark_mode ? 'white' : 'black', height: '1px' }}></p>
                </div>
            </div>
            <div className='' style={{ position: 'fixed', bottom: '3rem', right: '3rem', display: 'flex', }}>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1"></input>
                    <label className="form-check-label" htmlFor="exampleRadios1" >
                        <AiOutlineFilePdf style={{ color: 'red' }} /> <span> pdf</span>
                    </label>
                </div>
                <div className="form-check" style={{ paddingLeft: '2rem' }}>
                    <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2"></input>
                    <label className="form-check-label" htmlFor="exampleRadios2">
                        <FaFileCsv style={{ color: 'green' }} /> <span style={{ paddingRight: '1rem' }}>csv</span>
                    </label>
                </div>
                <div><button className='btn btn-sm btn-outline-danger' onClick={() => renderPDF()} disabled>Download</button></div>
            </div>
        </div>
    )
}

export default Detail