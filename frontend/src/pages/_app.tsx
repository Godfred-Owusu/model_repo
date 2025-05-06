import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "./app/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />;
      <Toaster richColors closeButton position="top-right" />
    </Provider>
  );
}
