import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Axios from 'axios'
import { useRouter } from 'next/router'
import NavBar from '../components/NavBar'
import { AuthProvider } from '../context/auth'

export default function App({ Component, pageProps }: AppProps) {
  // proxy  설정 해주는것과 비슷하다.
  Axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL+"/api"
  Axios.defaults.withCredentials = true // 모든 axios 요청 헤드에 쿠키를 넣겠다.

  const {pathname} = useRouter()
  const authRoutes = ['/register','/login']
  const authRoute = authRoutes.includes(pathname)

  return (
  <AuthProvider>
    {!authRoute && <NavBar/>}
    <div className={authRoute ? "" : "pt-16"}>
      <Component {...pageProps} />
    </div>
  </AuthProvider>
  )
}
