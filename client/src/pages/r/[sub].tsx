import React from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import cls from 'classnames';

export default function DetailSub() {

  const fetch = async(url: string) => {
    try{
      return await axios.get(url).then((res: any)=>res.data)
    }catch(error: any){
      throw error.response.data
    }
  }
  const router = useRouter()
  const subName = router.query.sub
  console.log(subName)
  const {data: sub, error} = useSWR(subName ? `/subs/${subName}` : null , fetch)

  const openFileInput = (str: string) => {
    
  }

  return (
    <>
    {/* Sub info and Images */}
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
      </div>}
    </>
  )
}
