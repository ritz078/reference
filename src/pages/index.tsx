import React from "react";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@components/ModelLoader/ModelLoader"), {
  ssr: false,
});

export default function App() {
  return (
    <div className="wrapper">
      {/*<Settings />*/}
      <div className="container">
        <Scene />
      </div>
    </div>
  );
}
