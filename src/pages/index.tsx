import React from "react";
import dynamic from "next/dynamic";
import { Settings } from "@components/Settings";

const M = dynamic(() => import("@components/ModelLoader"), {
  ssr: false,
});

export default function () {
  return (
    <div className="wrapper">
      <div className="container">
        <M />
      </div>
      <Settings />
    </div>
  );
}
