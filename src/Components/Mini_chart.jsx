import { useState } from "react";
import {
  CircularProgressbar,
  buildStyles,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";

function Mini_chart(props) {
  const limit_indicator = {
    low: 0.5,
    middle: 0.8,
  };
  // const [onSchedule, setonSchedule]=useState(0)

  // console.log(props.tempSumaryAVOee);

  return (
    <div
      style={{
        border: "2px solid rgba(221, 221, 221, 0.5)",
        borderRadius: "17px",
        margin: "1vh 0.3vw 1vh 0.3vw",
        // height: '40vh',
      }}
    >
      <div style={{ padding: "1rem" }}>
        <div className="">Overal</div>
        <div className="carousel w-full gap-4">
          <div
            id="slide1"
            className="carousel-item relative w-ful flex flex-col"
          >
            <div >
              <CircularProgressbar
                text={`${(props.tempSumaryAVOee * 100).toFixed(2)}%`}
                value={props.tempSumaryAVOee * 100}
                styles={buildStyles({
                  pathColor:
                    props.tempSumaryAVOee < limit_indicator.low
                      ? props.color_status.Alarm
                      : props.tempSumaryAVOee < limit_indicator.middle
                      ? props.color_status.Stop
                      : props.color_status.Run,
                })}
              />
            </div>
            <div className="text-center text-xl font-bold">Av OEE</div>
          </div>
          <div
            id="slide2"
            className="carousel-item relative w-ful flex flex-col"
          >
            <div>
              <CircularProgressbar text="30%" />
            </div>
            <div className="text-center font-bold text-xl"> Utilization</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mini_chart;
