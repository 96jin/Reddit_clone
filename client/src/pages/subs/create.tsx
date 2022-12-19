import axios from 'axios'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import InputGroup from '../../components/InputGroup'

const Create: React.FC = () => {
  const [name , setName] = useState('')
  const [title, setTitle] = useState('')
  const [description , setDescription] = useState('')
  const [errors, setErrors] = useState<any>({})

  const router = useRouter()

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault()
    try{
      const res = await axios.post('/subs', {name, title, description},{ withCredentials : true })  
      // 요청 헤더에 쿠키를 넣어주기 위해 withCredentials : true 를 준다.
      console.log(res.data)
      router.push(`/r/${res.data.name}`)
    }catch(error: any){
      console.log(error)
      setErrors(error.response.data)
    }
  }

  return (
    <div className='flex flex-col justify-center pt-16'>
      <div className="w-10/12 mx-auto md:w-96 bg-white rounded p-4">
        <h1 className='mb-2 text-lg font-medium'>
          커뮤니티 만들기
        </h1>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className='my-6'>
            <p className='font-medium'>Name</p>
            <p className='mb-2 text-xs text-gray-400'>커뮤니티 이름은 변경할 수 없습니다.</p>
            <InputGroup
            placeholder='이름'
            value={name}
            setValue={setName}
            error={errors.name}
            />
          </div>
          <div className='my-6'>
            <p className='font-medium'>Title</p>
            <p className='mb-2 text-xs text-gray-400'>주제를 나타냅니다. 언제든지 변경할 수 있습니다.</p>
            <InputGroup
            placeholder='주제'
            value={title}
            setValue={setTitle}
            error={errors.title}
            />
          </div>
          <div className='my-6'>
            <p className='font-medium'>Description</p>
            <p className='mb-2 text-xs text-gray-400'>해당 커뮤니티에 대한 설명입니다.</p>
            <InputGroup
            placeholder='설명'
            value={description}
            setValue={setDescription}
            error={errors.description}
            />
          </div>
          <div className='flex justify-end'>
            <button className='px-4 py-1 text-sm font-semibold rounded text-white bg-blue-500 border'>
              커뮤니티 만들기
            </button>
          </div>
        </form>
      </div>
    </div> 
  )
}

export default Create

// build 될 때 , 요청할때 마다 실행
export const getServerSideProps: GetServerSideProps = async ({req,res}) => {
  try {
    const cookie = req.headers.cookie;
    if(!cookie) throw  new Error("Missing auth token cookie")

    // 헤더에 쿠키를 담아서 보낸다.
    // 하지만 app.tsx에서 withCredentials = true 를 줬으므로 따로 헤더에 쿠키를 넣을 필요 없이 모든 요청에서 헤드에 쿠키를 담는다.
    await axios.get('/auth/me',{headers: {cookie}})

    return {props: {}}
  }catch(error){
    // 백엔드에서 요청에서 던져준 쿠키를 이용해 인증처리 할 때 에러가 나면 /login페이지로 이동
    // 307 : Temporary Redirect / nextjs 에서 리다이렉트 하는법
    res.writeHead(307, {Location: "/login"}).end()
    return {props: {}}
  }
}