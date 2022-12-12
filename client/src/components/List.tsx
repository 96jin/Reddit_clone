import axios from 'axios'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Sub } from '../types';
import Image from 'next/image';
import { useAuthState } from '../context/auth';

export default function List() {
  const {authenticated} = useAuthState()
  const router = useRouter()

  // url을 받아서 응답의 data를 반환하는 fetch 함수를 만든다.
  const fetcher = async (url: string) => {
    const res = await axios.get(url).then((res)=> res.data)
    return res
  }
  const address = "http://localhost:5000/api/subs/topSubs"
  const {data: topSubs} = useSWR<Sub[]>(address, fetcher) // 비구조화할당 , key 이름 변경
  console.log('topSubs', topSubs)
  const onClickCreate = async() => {
    try{
      const res = await axios.get('/auth/me')
    }catch(error){
      console.log(error)
      router.push('/login')
    }
  }

  return (
    <div className='flex max-w-5xl px-4 pt-5 mx-auto bg-blue-300'>
      {/* 포스트 리스트 */}
      <div className='w-full md:mr-3 md:w-8/12'>
        포스트 리스트
      </div>

      {/* 사이드바 */}
      <div className='hidden w-4/12 ml-3 md:block'>
        <div className='bg-white border rounded'>
          <div className='p-4 border-b'>
            <p className='text-lg font-semibold text-center'>상위 커뮤니티</p>
          </div>
          {/* 커뮤니티 목록 */}
          {topSubs?.map((list)=>(
            <div key={list.name}
            className="flex items-center px-4 py-2 text-xs border-b">
              <Link href={`/r/${list.name}`}>
                <Image
                src={list.imageUrl}
                alt='Sub'
                width={24}
                height={24}
                className='rounded-full cursor-pointer h-6'
                />
              </Link>
              <Link href={`/r/${list.name}`}
              className="ml-2 font-bold hover:cursor-pointer"
              >
                /r/{list.name}
              </Link>
              <p className='ml-auto font-medium'>{list.postCount}</p>
            </div>
          ))}
          <div>

          </div>
          {authenticated && 
            <div className='w-full py-6 text-center'>
              <Link href='/subs/create' onClick={onClickCreate} className='w-full p-2 px-16 text-center text-white bg-blue-500 rounded'>
                커뮤니티 만들기
              </Link>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
