import React from "react";

function Groupmachine(props) {
  // console.log("group:"+JSON.stringify(props));
  // return ;
  // time= new Date()
  let dark_mode = props.dark_mode;
  props = props.data;
  var Style_ = "";
  if (props.status == "Run") Style_ = "#33cc00";
  else if (props.status == "Stop") Style_ = "#ffcc00";
  else if (props.status == "Alarm") {
    Style_ = "#ff0000";
  } else {
    Style_ = "rgb(111, 45, 211)";
  }
  return (
    <div
      className={props.status == "Alarm" ? "Simple-machine-box" : ""}
      style={{
        margin: "5px",
        borderRadius: "1rem",
        border: "5px solid rgba(221, 221, 221, 0.8)",
        minWidth: "fit-content",
      }}
    >
      <div className="row">
        {/* <div className="col-3" style={{ backgroundColor: '' }}>
                    <div style={{ paddingRight: '0', justifyContent: 'center', position: 'relative', top: '50%', left: '50%', msTransform: "translate(-50%, -50%)", transform: "translate(-50%, -50%)" }}>
                        <img style={{ maxWidht: '4vw', maxHeight: '6vh' }} src="/assets/machinelogo/coldForging1.png" alt="no image" />
                    </div>
                </div> */}
        <div
          className="col-6"
          style={{ padding: "auto", backgroundColor: "", position: "relative" }}
        >
          <div
            style={{
              paddingLeft: "1rem",
              backgroundColor: "",
              textAlign: "end",
              fontWeight: "bolder",
              fontSize: "4vmin",
              marginTop: "1.5vh",
              marginBottom: "auto",
              color: dark_mode ? "white" : "",
            }}
          >
            {props.Number}
          </div>
        </div>
        <div className="col-6" style={{ backgroundColor: "" }}>
          <div
            style={{
              backgroundColor: Style_,
              borderRadius: "0.5rem",
              height: "100%",
              minHeight: "6vh",
            }}
          >
            <div
              style={{
                display: "flex",
                fontWeight: "bolder",
                fontSize: "2vmin",
                paddingTop: "2vh",
              }}
            >
              <div
                style={{
                  color: props.status == "Not operate" ? "white" : "black",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {props.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Groupmachine;
