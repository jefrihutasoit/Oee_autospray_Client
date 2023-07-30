import React, { useRef, useState } from 'react'
import ip_Server from "../../src/ServerConfig.js"
import * as moment from 'moment'
import { AiOutlineCheck } from '@react-icons/all-files/ai/AiOutlineCheck'
import { useParams } from 'react-router-dom'
let serverADR = ip_Server//"http://localhost:8001";


function Wizzard_schedule() {
    let { MC } = useParams()
    const input_operator_id = useRef()
    const input_leader_id = useRef()
    const input_product_number = useRef()
    const input_product_target = useRef({
        current: {
            value: 0
        }
    })
    const [input_product_cavity, setinput_product_cavity] = useState()
    const [input_product_CT, setinput_product_CT] = useState()
    const [input_product_Desc1, setinput_product_Desc1] = useState()
    const [input_product_Desc2, setinput_product_Desc2] = useState()
    const [input_planning_dt, setinput_planning_dt] = useState()
    const input_shift = useRef()
    const [prodNumber, setProductNumber] = useState()

    const [name_operator_validated, seTname_operator_validated] = useState('')
    const [name_leader_validated, seTname_leader_validated] = useState('')
    const [namaLeader, setNamaLeader] = useState()
    const [stageSetup, setStagesetup] = useState(1)
    const [visiblePersoneInfo, setvisiblePersoneInfo] = useState('contents');
    const [visibleProductInfo, setvisibleProducrnfo] = useState('none');
    const [visibleProductInfoDetail, setvisibleProducrnfoDetail] = useState('none');
    const [visibleDTinfo, setvisibleDTinfo] = useState('none');
    const [visibleFinalform, setvisibleFinalform] = useState('none');
    const [visibledate_start_manual, setvisibledate_start_manual] = useState('none');
    const [totalPlanningDT, setTotalPlanningDT] = useState(0)
    const [onSubmitSchedule, setonSubmitSchedule] = useState(false)

    const [enableBtnValidate, setEnableBtnValidate] = useState(true)

    const [list_dt_planning, setDtPlanlist] = useState([]);
    // const [labourValidated, setLabourValidated] = useState(false)

    const labour_validate = async (Role) => {
        try {
            let url = `${serverADR}/get-${Role}/${Role === 'leader' ? input_leader_id.current.value : input_operator_id.current.value}`
            await fetch(url)
                .then(response => response.json())
                .then(data =>
                    Role === 'leader' ?
                        data.data === null ? seTname_leader_validated('') : (seTname_leader_validated(data.data.Name), setNamaLeader(data.data.Name))
                        :
                        data.data === null ? seTname_operator_validated('') : seTname_operator_validated(data.data.Name)
                )
        } catch (error) {
            // alert('error ' + error);

        }
    }
    const product_validate = async (Role) => {
        setEnableBtnValidate(false)
        //router.get('/get-part/:part_number', get_part)
        try {
            let url = `${serverADR}/get-part/${input_product_number.current.value}`
            //  alert(url)
            await fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(JSON.stringify(data))
                    data.data === null ? console.log('') :
                        input_product_target.current.value = data.data.default_target_output
                    setinput_product_cavity(data.data.output_percycle)
                    setinput_product_CT(data.data.default_ct)
                    setinput_product_Desc1(data.data.description1)
                    setinput_product_Desc2(data.data.description2)
                    seTname_leader_validated('True')
                    setvisibleProducrnfoDetail('contents')
                    setEnableBtnValidate(true)
                    setProductNumber(input_product_number.current.value)
                    // alert(data.data)
                }
                )
        } catch (error) {
            //alert('error ' + error);
            setEnableBtnValidate(true)
        }

    }

    let tmDTplanning = 0
    const changevalDT = event => {
        // tmDTplanning = totalPlanningDT
        // tmDTplanning = parseFloat(tmDTplanning)
        // console.log(event.target.value);
        if (event.target.checked) { tmDTplanning = tmDTplanning + parseFloat(event.target.value) }
        else { tmDTplanning = tmDTplanning - parseFloat(event.target.value) }

        if (tmDTplanning <= 0) tmDTplanning = 0;
        console.log(tmDTplanning);
        setTotalPlanningDT(tmDTplanning)

    }

    async function get_dt_planning_list() {
        setDtPlanlist([])
        await fetch(serverADR + "/get-dt-planning-list").then(res => res.json())
            .then(data => {
                data.map((data, index) => {
                    setDtPlanlist(list_dt_planning => [...list_dt_planning,
                    <tr key={data._id}>
                        <td>{index + 1}</td>
                        <td>{data.dt_description}</td>
                        <td>{data.dt_duration}</td>
                        <td>
                            <div className="form-control">
                                <label className="cursor-pointer label">
                                    {/* <span className="label-text">Remember me</span> */}
                                    <input type="checkbox" className="checkbox checkbox-warning checkbox-xs" onChange={changevalDT} value={data.dt_duration} />
                                </label>
                            </div>
                        </td>
                    </tr>])
                })
            })
        // setSaveload(false)
    }

    const setDateManualStart = () => {
        if (visibledate_start_manual === 'none') setvisibledate_start_manual('contents')
        else setvisibledate_start_manual('none');
        //alert(visibledate_start_manual)
    }

    const excecuteCreateSchedule = async () => {
        setonSubmitSchedule(true)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Machine: { id_identification: MC },
                Time_data: {
                    batch_start: moment(),//.format("DD-MM-YYYY HH:mm:ss"),
                    batch_end: moment().add(((input_product_target.current.value * input_product_CT) + (totalPlanningDT * 60)), 'seconds'),//.format("DD-MM-YYYY HH:mm:ss"),
                    shift: input_shift.current.value
                },
                Planning: {
                    Schedule: input_product_Desc1,
                    Part_number: input_product_number.current.value,
                    Output: input_product_target.current.value,
                    Cycle_time: input_product_CT,
                    Down_time_in_seconds: totalPlanningDT * 60,
                    Operating_time: (input_product_target.current.value * input_product_CT) + (totalPlanningDT * 60),
                    Relative_DT: 0
                },
                Labour: {
                    Operator: {
                        ID: input_operator_id.current.value,
                        Name: name_operator_validated
                    },
                    Leader: {
                        ID: input_leader_id.current.value,
                        Name: namaLeader
                    }
                },
                OEE_data: {},
                Actual: {},
                Operation_info: {},
                Active: true
            })
        };
        try {
            await fetch(`${serverADR}/register_schedule`, requestOptions)
                .then(res => res.json())
                .then(data => {
                    // alert(JSON.stringify(data))
                    // alert(data + 'jefri')
                    // alert(JSON.stringify(data))
                    setTimeout(() => {
                        setonSubmitSchedule(false);//pindah halaman
                        //http://localhost:3000/Operator_form_schedule/CHN01
                        // window.location.replace('http://10.35.118.38:3000/Operator_form_schedule/' + MC);
                        var server_tmp = serverADR.replace("8001","3006")
                        alert(server_tmp+'/Operator_form_schedule/' + MC)
                        window.location.replace(server_tmp+'/Operator_form_schedule/' + MC);
                    }, 1000);
                })
        } catch (error) {
            setonSubmitSchedule(false)
            // alert(error)
        }

        // console.log(requestOptions.body)
    }

    let tmpStage = stageSetup
    const change_stage = (Dir) => {
        if (Dir == 'Next') tmpStage += 1
        else tmpStage -= 1

        if (tmpStage == 1) {
            setvisiblePersoneInfo('contents')
            setvisibleProducrnfo('none')
            setvisibleProducrnfoDetail('none')
            setvisibleDTinfo('none')
            setvisibleFinalform('none')
        } else if (tmpStage == 2) {
            setvisiblePersoneInfo('none')
            setvisibleProducrnfo('contents')
            seTname_leader_validated('')
            setvisibleDTinfo('none')
            get_dt_planning_list()
        } else if (tmpStage === 3) {
            setvisibleProducrnfo('none')
            setvisibleDTinfo('contents')
            setvisibleFinalform('none')
            seTname_leader_validated('True')
        } else if (tmpStage == 4) {
            setvisibleDTinfo('none')
            setvisibleFinalform('contents')
            seTname_leader_validated('')
        }

        if (tmpStage <= 1) tmpStage = 1
        else if (tmpStage > 4) tmpStage = 4
        setStagesetup(tmpStage)
        // alert(stageSetup)
    }


    return (
        // <div style={{ margin: '0', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <div>
            <div className="card text-3xl" style={{ padding: '1vmin 10vmin 1vmin 10vmin', borderRadius: '3vmin  0 3vmin 0' }}>
                <h1>Schedule Wizard <cite>pilih schedule</cite></h1>

                <div className='Personel-info' style={{ display: visiblePersoneInfo }}>
                    <h3 style={{ paddingTop: '3vmin' }} className='font-bold'>Informasi personel</h3>
                    <div>
                        <label htmlFor="">Mfg Leader</label>
                        <div className="input-group mb-3">
                            <input type="number" className="form-control" placeholder="ID Mfg Leader" aria-label="Recipient's username" aria-describedby="button-addon2" ref={input_leader_id} onChange={() => seTname_leader_validated('')}></input>
                            <button className="btn btn-secondary" type="button" id="button-addon2" onClick={() => labour_validate('leader')}>Validasi</button>
                        </div>
                        <div>
                            {name_leader_validated}
                        </div>
                        <label htmlFor="">Operator</label>
                        <div className="input-group mb-3">
                            <input type="number" className="form-control" placeholder="ID Operator" aria-label="Recipient's username" aria-describedby="button-addon2" ref={input_operator_id} onChange={() => seTname_operator_validated('')}></input>
                            <button className="btn btn-secondary" type="button" id="button-addon2" onClick={() => labour_validate('operator')}>Validasi</button>
                        </div>
                        <div>
                            {name_operator_validated}
                        </div>
                    </div>
                </div>

                <div className='Personel-info' style={{ display: visibleProductInfo }}>
                    <h3 style={{ paddingTop: '3vmin' }} className='font-bold'>Informasi product</h3>
                    <div>
                        <label htmlFor="">Part number</label>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="11124-987288" ref={input_product_number} onChange={() => seTname_leader_validated('')}></input>
                            {enableBtnValidate ? <button className="btn btn-secondary" type="button" id="button-addon2" onClick={() => product_validate()} >Validasi</button> :
                                <button className="btn btn-secondary" type="button" id="button-addon2" onClick={() => product_validate()} disabled>Validasi</button>
                            }
                        </div>
                        <div className='product-information-description' style={{ display: visibleProductInfoDetail }}>
                            <table className='table' style={{ color: 'dark' }}>
                                <tbody>
                                    <tr>
                                        <td>Description1</td>
                                        <td>{input_product_Desc1}</td>
                                    </tr>
                                    <tr>
                                        <td>Description2</td>
                                        <td>{input_product_Desc2}</td>
                                    </tr>
                                    <tr>
                                        <td>Cavity</td>
                                        <td>{input_product_cavity}</td>
                                    </tr>
                                    <tr>
                                        <td>Ideal CT</td>
                                        <td>{input_product_CT}</td>
                                    </tr>
                                    <tr>
                                        <td>Target output</td>
                                        <td><input type="number" ref={input_product_target} /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className='pickUpDownTime' style={{ display: visibleDTinfo }}>
                    <h3 style={{ paddingTop: '3vmin' }} className='font-bold pb-4'>Perencanaan Down time [menit]</h3>
                    <div className="input-group mb-3">
                        <input type="number" className="form-control" ref={input_planning_dt} value={totalPlanningDT}></input>
                    </div>

                    <div className='flex justify-between gap-3'>
                    <div className='text-5xl'>
                        <div className="">
                        <table className='table relative' >
                            <thead>
                                <tr className='text-3xl'>
                                    <th>NO</th>
                                    <th>Description</th>
                                    <th>Duration[mins]</th>
                                    <th>Pickup</th>
                                </tr>
                            </thead>
                            <tbody style={{overflow:'auto', height:'50vh'}}>
                                {list_dt_planning}
                            </tbody>
                        </table>

                        </div>
                    </div>
                    <div>
                        <p className='text-9xl font-bold text-primary'>{totalPlanningDT}</p>
                        <p className='pl-4'>minutes</p>
                    </div>
                    </div>
                </div>

                <div className="" style={{ display: visibleFinalform }}>
                    <h3 style={{ paddingTop: '2vmin', paddingBottom: '2vmin' }}>Finalisasi schedule</h3>
                    <cite style={{ color: 'green', paddingBottom: '2vmin' }}>Yey, Langkah terakhir</cite>
                    <div className='grid grid-cols-2 gap-2'>
                    <div className=''>
                            <p>Labour/Product info</p>
                            <table className='table table-sm'>
                                <tbody>
                                    <tr>
                                        <td>Mfg Leader</td>
                                        <td>:{namaLeader}</td>
                                    </tr>
                                    <tr>
                                        <td>Operator</td>
                                        <td>:{name_operator_validated}</td>
                                    </tr>
                                    <tr>
                                        <td>Product number:</td>
                                        <td>:{prodNumber}</td>
                                    </tr>
                                    <tr>
                                        <td>Prod Desc1</td>
                                        <td>:{input_product_Desc1}</td>
                                    </tr>
                                    <tr>
                                        <td>Prod Desc2</td>
                                        <td>:{input_product_Desc2}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className=''>
                            <p>Targets</p>
                            <table className='table table-sm'>
                                <tbody>
                                    <tr>
                                        <td>Product Output</td>
                                        <td>:{input_product_target.current.value}</td>
                                    </tr>
                                    <tr>
                                        <td>CT</td>
                                        <td>:{input_product_CT}s</td>
                                    </tr>
                                    <tr>
                                        <td>Planning DT</td>
                                        <td>:{totalPlanningDT}mins</td>
                                    </tr>
                                    <tr>
                                        <td>Shift</td>
                                        <td>
                                            <select name="" id="" ref={input_shift}>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Start time</td>
                                        <td>
                                            <div>
                                                <input type="checkbox" id='start_langsung' defaultChecked onChange={() => setDateManualStart()} /> <label htmlFor="start_langsung">Start immediatelly</label>
                                            </div>
                                            <div style={{ display: visibledate_start_manual }} >
                                                <input id='date_start_manual' type="datetime-local" defaultValue={`${moment().format('y-MM-DD')}T${moment().add(2, 'minutes').format('HH:mm')}`} />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div>
                                <label className='btn btn-sm btn-success' style={{ position: 'absolute', right: '6vmin' }} htmlFor="validateModal">Validate</label>

                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '4vmin' }}>
                    <button className='btn btn-lg  btn-error' onClick={() => change_stage('Prev')}> Prev [{stageSetup}]</button>
                    {
                        name_leader_validated === '' ? '' : name_operator_validated === '' ? '' :
                            <div>
                                <button className='btn btn-lg btn-success' onClick={() => change_stage('Next')}>Next</button>
                            </div>
                    }
                </div>

                {/*modal untuk validate  */}
                <input type="checkbox" id="validateModal" className="modal-toggle" />
                <label htmlFor="validateModal" className="modal cursor-pointer  bg-light">
                    <label className="modal-box relative" htmlFor="">
                        <h3 className="text-lg font-bold">Konfirmasi schedule</h3>
                        <div style={{}}>
                            <table className='table bg-light'>
                                <tbody>
                                    {
                                        input_product_target.current.value > 0 ?
                                            <tr>
                                                <td>Total working hours</td>
                                                <td>{new Date((((input_product_target.current.value * input_product_CT) / input_product_cavity) + (totalPlanningDT * 60)) * 1000).toISOString().slice(11, 19)}</td>
                                            </tr> : ''
                                    }
                                </tbody>
                            </table>
                            <div style={{ justifyContent: 'end', display: 'flex' }}>{
                                onSubmitSchedule ? <label className='btn btn-square loading btn-warning'></label> : <label className='btn btn-circle btn-primary' onClick={() => excecuteCreateSchedule()} htmlFor="validateModal"><AiOutlineCheck /></label>
                            }
                                <label htmlFor="" className='align-middle' style={{ padding: '1.3vmin 0 0 1vmin' }}>Start sekarang</label>
                            </div>
                        </div>
                    </label>
                </label>
            </div >
        </div >
    )
}

export default Wizzard_schedule