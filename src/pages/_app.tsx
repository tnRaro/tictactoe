import { AppProps } from "next/app";
import React, { useEffect } from "react";
import "../global.css";

const App: React.VoidFunctionComponent<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    setTimeout(async () => {
      try {
        await (CSS as any).paintWorklet.addModule("/smooth-corners.js");
        console.log("loaded");
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  return <Component {...pageProps} />;
};

export default App;
