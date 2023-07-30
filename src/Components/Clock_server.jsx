import React, { useEffect, useState } from "react";
// import io from 'socket.io-client'
import { AiFillWarning } from "@react-icons/all-files/ai/AiFillWarning";
// const socket =io.connect("http://192.168.1.8:8001")

function Clock_server(props) {
  const [clockServer, setCloctServer] = useState("");
  const [shiftServer, setShiftServer] = useState("");
  const [clientConnectServer, setclientConnectServer] = useState(0);
  const [socketStatus, setSocketStatus] = useState(props.socketStatus);
  const [blink, setBlink] = useState(true);
  // console.log(`props: ${props}`);
  props = props.data;

  // if (props == null){
  //   return;
  // }
  // setCloctServer(props.clockShiftInfo.dateTime)
  // setShiftServer(props.clockShiftInfo.Shift)
  // setclientConnectServer(props.clientConnect)
  // useEffect(()=>{

  // },[])

  // useEffect(()=>{
  //   socket.on("fromServer",(data)=>{
  //     // handle_socket_data(data)
  //     try {
  //       setCloctServer(data.clockShiftInfo.dateTime)
  //       setShiftServer(data.clockShiftInfo.Shift)
  //       setclientConnectServer(data.clientConnect)
  //       // console.log(data.clockShiftInfo.dateTime);
  //     } catch (error) {

  //     }
  //  })

  //   socket.on("connect",(msg) =>{
  //       setSocketStatus("Linked")
  //   })

  //   socket.on("disconnect",(msg) =>{
  //       setSocketStatus("----")
  //   })

  //   const bl=setInterval(() => {
  //     setBlink(blink => !blink)
  //   }, 1500);
  //   return()=> clearInterval(bl)
  // },[])

  return (
    <div className="hidden">
      {props ? (
        <div
          style={{
            display: window.innerWidth < 400 ? "none" : "contents",
            zIndex: 3,
          }}
        >
          <div style={{ color: "yellow", paddingTop: "1vh" }}>
            {/* {socketStatus != "Linked"? blink? < AiFillWarning/>:'':''} */}
          </div>
          <div
            style={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "12px",
              padding: ".4rem",
              margin: "12px 12px 0 0",
              fontSize: "10px",
            }}
          >
            <div>Server Clock:{props.clockShiftInfo.dateTime}</div>
            <div>Server Shift:{props.clockShiftInfo.Shift} </div>
            <div>
              Client: {props.clientConnect}{" "}
              <span>
                Link: <span>{socketStatus}</span>
              </span>{" "}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", zIndex: 3 }}>
          <div
            style={{ marginLeft: "3rem" }}
            className="spinner-grow text-warning"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <span
            style={{ color: "red", fontSize: "20px", marginLeft: "2rem" }}
          ></span>
        </div>
      )}
    </div>
  );
}

export default Clock_server;
