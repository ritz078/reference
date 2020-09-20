import "../styles/main.scss";
import React, { useEffect } from "react";
import ReactGA from "react-ga";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => ReactGA.initialize(process.env.GA), []);

  return <Component {...pageProps} />;
}
