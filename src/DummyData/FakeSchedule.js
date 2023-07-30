export default {
  Machine: {
    id_identification: "--",
    original_name: "--",
    status: "--",
  },
  Machine_id_identification: "--",
  Time_data: {
    batch_start: {
      $date: {
        $numberLong: "--",
      },
    },
    batch_end: {
      $date: {
        $numberLong: "--",
      },
    },
    shift: "1",
  },
  Planning: {
    Schedule: "No Schedule",
    Part_number: "--",
    Output: "--",
    Cycle_time: "--",
    Down_time_in_seconds: "--",
    Operating_time: "--",
    Relative_DT: "--",
  },
  Actual: {
    Output: "",
    Output_reject: "",
    Cycle_time: "",
    Down_time_in_seconds: "",
    Operating_time: "",
  },
  Labour: {
    Operator: {
      ID: "",
      Name: "",
    },
    Leader: {
      ID: "",
      Name: "",
    },
  },
  OEE_data: {
    Performance: 0,
    Availability: 0,
    Quality: 0,
    OEE: 0,
  },
  Downtime_list: {},
  Active: true,
  __v: 0,
};
