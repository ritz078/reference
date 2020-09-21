import "../styles/main.scss";
import React from "react";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
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
