import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import cls from 'classnames';
import Image from 'next/image';
import { useAuthState } from '../../context/auth';

export default function DetailSub() {

  const [ownSub, setOwnSub] = useState(false)
  const {authenticated, user} = useAuthState()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetch = async(url: string) => {
    try{
      return await axios.get(url).then((res: any)=>res.data)
    }catch(error: any){
      throw error.response.data
    }
  }
  const router = useRouter()
  const subName = router.query.sub
  console.log('subName',subName)
  const {data: sub, error} = useSWR(subName ? `/subs/${subName}` : null , fetch)
  console.log('sub', sub)
  
  // 자신의 커뮤니티일때만 클릭
  const openFileInput = (type: string) => {
    if(!ownSub) return
    const fileInput = fileInputRef.current
    if(fileInput){
      fileInput.name = type
      fileInput.click()
      // div에 Image 태그 클릭했을 때 input 클릭되게 함.
    }
  }

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files === null) return
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', fileInputRef.current!.name)

    try{
      await axios.post(`/subs/${sub.name}/upload`, formData, {
        headers: {"Context-Type": "multipart/form-data"},
      })
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if(!sub) return
    setOwnSub(authenticated && user!.username === sub.username)
  },[sub])

  return (
    <>
    <input 
    type="file"
    hidden={true}
    ref={fileInputRef}
    onChange={uploadImage}
    />
    {sub && 
      <div>
        {/* Banner Image */}
        <div className={cls("bg-gray-400")}>
          {sub.bannerUrl ? (
            <div className='h-56'
            style={{
              backgroundImage: `url(${sub.bannerUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
            onClick={()=>openFileInput("banner")}
            ></div>
          ):
            <div className='h-20 bg-gray-400'></div>
          }
        </div>
        {/* Sub meta data */}
        <div className='h-20 bg-white'>
          <div className='relative flex max-w-5xl px-5 mx-auto'>
            <div className='absolute' style={{top: -15}}>
              {sub.imageUrl && (
                <Image
                  src={sub.imageUrl}
                  alt=''
                  width={70}
                  height={70}
                  onClick={()=>openFileInput('image')}
                  className={cls("rounded-full", {
                    "cursor-pointer" : ownSub,
                  })}
                />
              )}
            </div>
            <div className='pt-1 pl-24'>
              <div className='flex items-center'>
                <h1 className='mb-1 text-3xl font-bold'>{sub.title}</h1>
              </div>
              <p className='text-sm font-bold text-gray-400'>
                /r/{sub.name}
              </p>
            </div>
          </div>
        </div>
        {/* Posts & Sidebar */}
        <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
          포스트
        </div> 
      </div>}
    </>
  )
}
