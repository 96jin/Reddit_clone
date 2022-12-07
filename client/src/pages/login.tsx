import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import InputGroup from '../components/InputGroup'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<any>({})

  const router = useRouter()
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/login',{
        email,
        password,
      },
      {
        withCredentials: true,
      })
      console.log('res', res);
      router.push('/')
    } catch (error: any) {
      console.log('error', error)
      setErrors(error?.response?.data || {})
    }
  }
  return (
    <div className='bg-white'>
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className='w-10/12 mx-auto md:w-96'>
          <h1 className='mb-2 text-lg font-medium'>로그인</h1>
          <form onSubmit={(e)=>handleSubmit(e)}>
            <InputGroup 
            placeholder='Email'
            value={email} 
            error={errors.email} 
            setValue={setEmail}
            />
            <InputGroup 
            placeholder='Password'
            value={password} 
            error={errors.password} 
            setValue={setPassword}
            />
            <button className='w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded'>
              로그인
            </button>
          </form>
          <small>
            회원이 아니신가요?
            <Link href='/register' className='ml-1 text-blue-500 uppercase'>
              회원 가입
            </Link>
          </small>
        </div>
      </div>
    </div>
  )
}

export default Login