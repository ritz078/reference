import "../styles/main.scss";
import React, { useEffect } from "react";
import ReactGA from "react-ga";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => ReactGA.initialize(process.env.GA), []);

  return (
    <>
      <Head>
        <title>Reference</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
