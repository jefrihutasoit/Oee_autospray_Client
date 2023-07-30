import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react'
import { TiDelete } from "@react-icons/all-files/ti/TiDelete"


let serverADR = "http://192.168.1.8:8001";
function Machine_management() {
    const input_part_number = useRef()
    const input_description = useRef()
    const input_matrix = useRef()
    const input_type = useRef()
    const input_output_percycle = useRef()
    const input_standard_cycle_time = useRef()
    const input_image = useRef()
    const [list_part, setPartlist] = useState([]);
    const [save_load, setSaveload] = useState(false)

    async function submit_data() {
        setSaveload(true)
        // console.log(`Nama image: ${input_image.current.data}`);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{
                "part_number": input_part_number.current.value,
                "description": input_description.current.value,
                "type": input_type.current.value,
                "matriks": input_matrix.current.value,
                "output_percycle": input_output_percycle.current.value,
                "standard_cycle_time": input_standard_cycle_time.current.value,
            }])
        };
        // alert(data + " " + mesin_dipilih.current.value)
        try {
            await fetch(serverADR + "/register-parts", requestOptions)
                .then(response => response.json())
                .then(
                    // setCurrentstatus(data)
                    // alert(data)
                    setTimeout(() => { get_part_list() }, 1500)

                )
        } catch (error) {
            alert('error');
            setSaveload(false)
        }
    }
    async function drop_data(data) {
        // await fetch(serverADR+'/drop/'+data).
        await fetch(serverADR + "/drop-parts/" + data, { method: 'delete' }).then(res => res.json())
            .then(setTimeout(() => { get_part_list() }, 800))
    }

    async function get_part_list() {
        setPartlist([])
        await fetch(`${serverADR}/get-machine/0`).then(res => res.json())
            .then(data => {
                data.map((data, index) => {
                    setPartlist(list_part => [...list_part,
                    <tr key={data._id}>
                        <td>{index + 1}</td>
                        <td>{data.original_name}</td>
                        <td>{data.Number}</td>
                        <td>{data.image}</td>
                        <td>{data.group}</td>
                        <td style={{ color: 'red' }}><TiDelete style={{ cursor: 'pointer' }} value={data._id} onClick={() => drop_data(data._id)} /></td>
                    </tr>])
                })
            })
        setSaveload(false)
    }

    useEffect(() => {
        // console.log('load');
        get_part_list();
    }, [])

    return (
        <div style={{ width: '70%', padding: '12vmin 2vmin 0 12vmin' }}>
            <div>Machine management</div>
            <div style={{ paddingTop: '5vmin' }}>
                <table className='table '>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Name</th>
                            <th>Number</th>
                            <th>Image</th>
                            <th>Group</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Input</td>
                            <td> <input type="text" placeholder='Machining' className='form-control' ref={input_part_number} /> </td>
                            <td> <input type="text" placeholder='CPN02' className='form-control' ref={input_description} /> </td>
                            <td> <input type="file" accept='' className='form-control' ref={input_matrix} /> </td>
                            <td> <input type="number" placeholder='2' className='form-control' ref={input_output_percycle} /> </td>

                            <td style={{ display: 'flex', width: '50%', gap: '1vmin' }}>
                                {/* <input type="file" placeholder='Picture' className='form-control' accept='image/*' ref={input_image} /> */}
                                <button className='btn btn-sm btn-outline-success' onClick={() => save_load ? '' : submit_data()}>
                                    {save_load ?
                                        <div class="spinner-border text-info" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div> : 'Add'
                                    }
                                </button>
                            </td>
                        </tr>
                        {list_part}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Machine_management
