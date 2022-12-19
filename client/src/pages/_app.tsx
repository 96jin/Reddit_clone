import "../styles/globals.css";
import type { AppProps } from "next/app";
import Axios from "axios";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { AuthProvider } from "../context/auth";
import { SWRConfig } from "swr";
import axios from "axios";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  // proxy  설정 해주는것과 비슷하다.
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL + "/api";
  Axios.defaults.withCredentials = true; // 모든 axios 요청 헤드에 쿠키를 넣겠다.

  const { pathname } = useRouter();
  const authRoutes = ["/register", "/login"];
  const authRoute = authRoutes.includes(pathname);

  const fetcher = async (url: string) => {
    try{
      return await axios.get(url).then((res: any)=>res.data)
    }
    catch(error: any){
      throw error.response.data
    }
  };

  return (
    <>
      <Head>
        <script defer 
          src="https://use.fontawesome.com/releases/v5.15.4/js/all.js" 
          integrity="sha384-rOA1PnstxnOBLzCLMcre8ybwbTmemjzdNlILg8O7z1lUkLXozs4DHonlDtnE7fpc" 
          crossOrigin="anonymous">
        </script>
        <title>Reddit_Clone</title>
      </Head>
      <SWRConfig value={{ fetcher }}>
        <AuthProvider>
          {!authRoute && <NavBar />}
          <div className={authRoute ? "" : "pt-12 bg-gray-100 min-h-screen"}>
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      </SWRConfig>
    </>
  );
}
