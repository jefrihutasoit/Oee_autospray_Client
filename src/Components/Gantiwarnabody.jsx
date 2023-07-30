import React from "react";

export default function Gantiwarnabody({ color }) {
  document.documentElement.style.setProperty("--bodyColor", color);
}
