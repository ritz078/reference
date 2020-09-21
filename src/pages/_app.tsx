import "../styles/main.scss";
import React, { useEffect } from "react";
import ReactGA from "react-ga";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    ReactGA.initialize(process.env.GA);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <>
      <Head>
        <title>Reference</title>
        <meta
          name="description"
          content="An online tool to help you sketch human figures."
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
