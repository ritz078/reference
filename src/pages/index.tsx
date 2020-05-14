import React from "react";
import dynamic from "next/dynamic";
import { Settings } from "@components/Settings";

const Scene = dynamic(() => import("@components/ModelLoader"), {
  ssr: false,
});

export default function () {
  return (
    <div className="wrapper">
      <Settings />
      <div className="container">
        <Scene />
      </div>
    </div>
  );
}
