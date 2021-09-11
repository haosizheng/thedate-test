import "@fontsource/eb-garamond";
import type { AppProps } from "next/app";
import '../styles/globals.css';
import AppProviders from "@/components/AppProviders";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
    <Component {...pageProps} />
    </AppProviders>
  );
}
