import type { AppProps } from "next/app";
import "backpack.css";

import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
