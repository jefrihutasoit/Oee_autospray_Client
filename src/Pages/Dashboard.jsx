import React from 'react'
import { useEffect, useState } from 'react';
import Groupmachine from '../Components/Groupmachine';
import LoadingAnim from '../Components/LoadingAnim';
import { useNavigate } from 'react-router-dom'
import Group_card_summary from '../Components/Group_card_summary';

import ip_Server from "../../src/ServerConfig.js"

import ChartDataLabels from 'chartjs-plugin-datalabels';
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

import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import Navigation from '../Components/Navigation';
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

let serverADR = ip_Server//"http://dckr00162752:8001";


function Dashboard(prop) {
    const navigate = useNavigate()
    const [tmpMClist1, setTmpMcList1] = useState([])
    const [tmpMClist2, setTmpMcList2] = useState([])
    const [tmpMClist3, setTmpMcList3] = useState([])
    const [tmpMClist4, setTmpMcList4] = useState([])
    const [tmpMClist5, setTmpMcList5] = useState([])
    const [firstInit, setFirstinit] = useState(false)
    const [dark_mode, setDarkMode] = useState(false);
    const [alarm1, setAlarm1] = useState(false)
    const [alarm2, setAlarm2] = useState(false)
    const [alarm3, setAlarm3] = useState(false)
    const [alarm4, setAlarm4] = useState(false)
    const [alarm5, setAlarm5] = useState(false)
    const [lingGroup1, setLinkGroup1] = useState(1)
    const [lingGroup2, setLinkGroup2] = useState(2)
    const [lingGroup3, setLinkGroup3] = useState(3)
    const [lingGroup4, setLinkGroup4] = useState(4)
    const [lingGroup5, setLinkGroup5] = useState(5)
    const [operation_number, setOperationNumber] = useState(["--", "--", "--", "--"])
    const [resumeInfo, setResumeInfo] = useState(
        { not_running: 1, on_operate: 4, total_machine: 0, total_run: 0, total_alarm: 0, total_stop: 0 }

    )
    const [statusHistory, setStatushistory] = useState([])
    let tmp_total_operation_number = [0, 0, 0, 0]
    let counter = 0
    let tmp_arr = ([])
    var tmp_name = ""

    //  const [tmp_gr, setTmpgr] = useState(0)
    // var group_machine = []

    const getMcdata = async () => {
        setTmpMcList1([])
        setTmpMcList2([])
        setTmpMcList3([])
        setTmpMcList4([])
        setTmpMcList5([])
        setStatushistory([])
        setFirstinit(false)
        counter = 0
        tmp_total_operation_number = [0, 0, 0, 0]
        tmp_arr = ([])

        await fetch(`${serverADR}/get-machine/0`).then(data =>
            data.json())
            .then((json) => (
                json.map((machine, i) => {
                    // console.log(machine);
                    if (machine.group == 1) { setTmpMcList1(tmpMClist1 => [...tmpMClist1, machine]) }
                    else if (machine.group == 2) { setTmpMcList2(tmpMClist2 => [...tmpMClist2, machine]) }
                    else if (machine.group == 3) { setTmpMcList3(tmpMClist3 => [...tmpMClist3, machine]) }
                    else if (machine.group == 4) { setTmpMcList4(tmpMClist4 => [...tmpMClist4, machine]) }
                    else if (machine.group == 5) { setTmpMcList5(tmpMClist5 => [...tmpMClist5, machine]) }
                }),
                setFirstinit(true)
                // console.log(statusHistory)
            ))
    }
    let tmp_not_running = 0;
    let tmp_on_operate = 0;
    let tmp_number_machine = 0
    let tmp_number_run = 0;
    let tmp_number_stop = 0;
    let tmp_number_alarm = 0;

    async function update_data() {
        tmp_not_running = 0;
        tmp_on_operate = 0;
        tmp_number_machine = 0
        tmp_number_run = 0;
        tmp_number_stop = 0;
        tmp_number_alarm = 0;
        await fetch(`${serverADR}/current-session-data-option/current`).then(data => data.json())
            .then((json) => (
                update_my_(json)
            ))
    }

    async function update_my_(json) {
        tmp_not_running = 0;
        tmp_on_operate = 0;
        tmp_number_machine = 0
        tmp_number_run = 0;
        tmp_number_stop = 0;
        tmp_number_alarm = 0;

        json.map((data, i) => {

            if (data.data.status == 'Not operate') tmp_not_running += 1
            else tmp_on_operate += 1
            if (data.data.status == 'Run') tmp_number_run += 1
            else if (data.data.status == 'Stop') tmp_number_stop += 1
            else if (data.data.status == 'Alarm') tmp_number_alarm += 1
            tmp_number_machine = i + 1

            setTmpMcList1(current => current.map(obj => {
                if (obj.Number == data.id_identification) {
                    return { ...obj, total_run: data.data.total_run, total_stop: data.data.total_stop, total_alarm: data.data.total_alarm, status: data.data.status }
                } return obj;
            }),)
            setTmpMcList2(current => current.map(obj => {
                if (obj.Number == data.id_identification) {
                    return { ...obj, total_run: data.data.total_run, total_stop: data.data.total_stop, total_alarm: data.data.total_alarm, status: data.data.status }
                } return obj;
            }),)
            setTmpMcList3(current => current.map(obj => {
                if (obj.Number == data.id_identification) {
                    return { ...obj, total_run: data.data.total_run, total_stop: data.data.total_stop, total_alarm: data.data.total_alarm, status: data.data.status }
                } return obj;
            }),)
            setTmpMcList4(current => current.map(obj => {
                if (obj.Number == data.id_identification) {
                    return { ...obj, total_run: data.data.total_run, total_stop: data.data.total_stop, total_alarm: data.data.total_alarm, status: data.data.status }
                } return obj;
            }),)
            setTmpMcList5(current => current.map(obj => {
                if (obj.Number == data.id_identification) {
                    return { ...obj, total_run: data.data.total_run, total_stop: data.data.total_stop, total_alarm: data.data.total_alarm, status: data.data.status }
                } return obj;
            }),)

        })
        setOperationNumber([tmp_number_run, tmp_number_stop, tmp_number_alarm, tmp_number_machine])
        setResumeInfo({ not_running: tmp_not_running, on_operate: tmp_on_operate, total_machine: tmp_number_machine, total_run: tmp_number_run, total_alarm: tmp_number_alarm, total_stop: tmp_number_stop })

    }

    const change_resumme_array = (target, value) => {
        // socket.emit("from_client", "hallo jefri")
    }

    function handle_socket_data(raw) {
        try {
            update_my_(raw.mainDashboard)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        handle_socket_data(prop.Data_server)
        // console.log('loog');
    }, [prop.Data_server]);

    const data = {
        labels: ['Not operate', "Run", "Stop/Idle", "Alarm"],
        datasets: [
            {
                label: 's',
                data: [resumeInfo.not_running > 0 ? resumeInfo.not_running : null, resumeInfo.total_run, resumeInfo.total_stop, resumeInfo.total_alarm],
                backgroundColor: [
                    resumeInfo.not_running > 0 ? 'rgb(111, 45, 211)' : null,
                    '#93D56A',
                    '#E3E557',
                    '#EC6A6B'
                ],
                borderWidth: 1,
            },
        ],
        text: '20%'
    };

    const option = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'center',
                labels: {
                    font: {
                        size: (window.innerHeight / 1000 * 10) + (window.innerWidth / 1000 * 7),
                        weight: 'bold',
                        align: 'center'
                    },
                    color: prop.dark_mode ? 'white' : 'black'
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

    let tmp_data = false;
    function slide_show_handle() {
        if (tmp_data == prop.slideShow) return;
    }

    useEffect(() => {
        setDarkMode()
        getMcdata()

        const sw = setTimeout(() => {
            if (prop.slideShow) navigate(`/group-dashboard/1`)
        }, 15000);
        return () => clearTimeout(sw)

    }, [])


    let group_dark_title_color = 'yellow'
    let group_light_title_color = 'red'
    // console.log('called');
    return (
        <div style={{ backgroundColor: prop.dark_mode ? 'black' : '', paddingLeft: '0rem', height: '' }}>
            {/* {prop.slideShow ? slide_show_handle : ''} */}
            <span style={{ fontWeight: 'bolder', fontSize: '3vw', backgroundColor: 'blue', width: 'fitContent', padding: '0 3rem 5px 2rem', borderRadius: '0 2rem 2rem 3rem', color: 'white' }}>Machine overall overview</span>
            {/* <button className='btn btn-sm btn-outline-danger' onClick={()=>  change_resumme_array("on_operate",0)}>update</button> */
                // console.log(`height: ${window.innerHeight} w: ${window.innerWidth}`)
            }
            {firstInit ?
                <div className='row'>
                    <div className="col-lg-9">
                        <div onClick={() => navigate('/group-dashboard/' + lingGroup1)} className='row Group-mc-cf' style={alarm1 ? { boxShadow: '8px 8px 15px rgba(240, 195, 195, 1)', cursor: 'pointer', margin: '6px 0 6px 0', backgroundColor: prop.dark_mode ? 'black' : '' } : { cursor: 'pointer', margin: '6px 0 6px 0', backgroundColor: prop.dark_mode ? 'black' : '' }}>
                            <h1 style={{ fontSize: '1.4vw', fontWeight: 'bold', color: prop.dark_mode ? group_dark_title_color : group_light_title_color }}>{tmpMClist1[0].original_name}</h1>
                            {
                                tmpMClist1.map((machine, index) => (
                                    <div className='col-lg-2 col-md-4' key={machine._id}> <Groupmachine dark_mode={prop.dark_mode} data={tmpMClist1[index]} /> </div>
                                ))
                            }
                        </div>

                        <div onClick={() => navigate('/group-dashboard/' + lingGroup2)} className='row Group-mc-cf' style={alarm2 ? { boxShadow: '8px 8px 15px rgba(240, 195, 195, 1)', cursor: 'pointer', margin: '6px 0 6px 0', backgroundColor: prop.dark_mode ? 'black' : '' } : { cursor: 'pointer', margin: '6px 0 6px 0', backgroundColor: prop.dark_mode ? 'black' : '' }}>
                            <h1 style={{ fontSize: '1.4vw', fontWeight: 'bold', color: prop.dark_mode ? group_dark_title_color : group_light_title_color }}>{tmpMClist2[0].original_name}</h1>
                            {
                                tmpMClist2.map((machine, index) => (
                                    <div className='col-lg-2 col-md-4' key={machine._id}> <Groupmachine dark_mode={prop.dark_mode} data={tmpMClist2[index]} /> </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div style={{ position: 'fixed', color: prop.dark_mode ? 'white' : '' }}>
                            <div style={{ fontWeight: 'bolder', fontSize: '3.15vw', paddingLeft: '3rem' }}>Utilization</div>
                            <div style={{ fontSize: '8vh', fontWeight: 'bolder', paddingLeft: '3rem' }}>{100 * (resumeInfo.on_operate / resumeInfo.total_machine).toFixed(2)}%</div>
                            <div style={{ height: '30vh', width: '22vw', backgroundColor: '' }} >
                                <Doughnut data={data} options={option} />
                            </div>
                            <div style={{ position: '', bottom: '3vh' }}>
                                <Group_card_summary data={operation_number} style={{ marginLeft: '4rem' }} />
                            </div>
                        </div>
                    </div>
                </div>
                : <LoadingAnim />}
        </div>
    )
}

export default Dashboard