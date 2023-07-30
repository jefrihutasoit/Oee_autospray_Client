import React from "react";

function Group_card_summary(props) {
  // console.log(props);
  let dark_mode = props.dark_mode;
  props = props.data;
  return (
    <>
      <div className="card-info-wrapper">
        <div
          className="card-info-summary"
          style={{ backgroundColor: dark_mode ? "white" : "" }}
        >
          <div className="value">{props[3]}</div>
          <div className="title">Machine</div>
        </div>
        <div className="card-info-summary" style={{ background: "#93D46A" }}>
          <div className="value">{props[0]}</div>
          <div className="title">Run</div>
        </div>
      </div>
      <div className="card-info-wrapper">
        <div className="card-info-summary" style={{ background: "#E3E557" }}>
          <div className="value">{props[1]}</div>
          <div className="title">Stop/Idle</div>
        </div>
        <div className="card-info-summary" style={{ background: "#EC6A6B" }}>
          <div className="value">{props[2]}</div>
          <div className="title">Alarm</div>
        </div>
      </div>
    </>
  );
}

export default Group_card_summary;
