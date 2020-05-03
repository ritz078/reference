import React from "react";
import dynamic from "next/dynamic";

const M = dynamic(() => import("../components/ModelLoader"), {
  ssr: false,
});

export default function () {
  return (
    <div className="container">
      <M></M>
    </div>
  );
}
