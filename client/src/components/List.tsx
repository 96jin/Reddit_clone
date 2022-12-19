import axios from "axios";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Sub } from "../types";
import Image from "next/image";
import { useAuthState } from "../context/auth";
import {Post} from '../types';
import useSWRInfinite from 'swr/infinite'
import PostCard from './PostCard';
import { useState, useEffect } from 'react';

export default function List() {
  const [observedPost, setObservedPost] = useState('')

  const { authenticated } = useAuthState();
  const router = useRouter();

  // url을 받아서 응답의 data를 반환하는 fetch 함수를 만든다.

  const address = "http://localhost:5000/api/subs/topSubs";

  // userSWRInfinite Hook 내에서 아래 변수를 받도록 설정되어있다.
  // 처음에 0과 null 이 들어감.
  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if(previousPageData && !previousPageData.length) return null
    return `/posts?page=${pageIndex}`
  }

  const {
    data,
    error,
    size: page,
    setSize: setPage,
    isValidating,
    mutate,
  } = useSWRInfinite<Post[]>(getKey);

  const isInitialLoading = !data && !error
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : []

  const { data: topSubs } = useSWR<Sub[]>(address); // 비구조화할당 , key 이름 변경
  
  const onClickCreate = async () => {
    try {
      await axios.get("/auth/me");
    } 
    catch (error) {
      console.log(error);
      router.push("/login");
    }
  };

  useEffect(() => {
    // 포스트가 없다면 return
    if(!posts || posts.length === 0) return
    
    // 포스트 배열안에 마지막 post 의 id를 가져온다.
    const id = posts[posts.length -1].identifier

    // 포스트 배열에 post가 추가돼서 마지막 post가 바뀌었다면,
    // 바뀐 post 중 마지막 post를 observedPost로 
    if(id !== observedPost){
      setObservedPost(id)
      // id를 identifier로 div 생성했었다. 그 div태그를 관찰한다.
      observeElement(document.getElementById(id))
    }
  },[posts])

  // 관찰하는 함수
  const observeElement = (element: HTMLElement | null) => {
    if(!element) return
    // 브라우저 viewport 와 설정한 요소(element)의 교차점을 관찰
    const observer = new IntersectionObserver(
      //entries는 IntersectionObserverEntry 인스턴스의 배열
      (entries)=>{
        // isIntersecting : 관찰 대상의 교차 상태 (Boolean)
        if(entries[0].isIntersecting === true){
          console.log('마지막 포스트에 도달')
          setPage(page+1)
          observer.unobserve(element)
        }
      },
      // 옵션
      {threshold: 1}
      // 관찰 엘리먼트가 전부 다 화면에 들어오면(1)
    )
    // 대상 요소의 관찰을 시작
    observer.observe(element)
  }

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* 포스트 리스트 */}
      <div className="w-full md:mr-3 md:w-8/12">
        {isInitialLoading && <p className="text-lg text-center">loading..</p>}
        {posts.map((post)=>(
          <PostCard key={post.identifier} post={post} subMutate={mutate}/>
        ))}
      </div>

      {/* 사이드바 */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="bg-white border rounded">
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
          </div>
          {/* 커뮤니티 목록 */}
          <div>
            {topSubs?.map((list) => (
              <div
                key={list.name}
                className="flex items-center px-4 py-2 text-xs border-b"
              >
                <Link href={`/r/${list.name}`}>
                  <Image
                    src={list.imageUrl}
                    alt="Sub"
                    width={24}
                    height={24}
                    className="rounded-full cursor-pointer h-6"
                  />
                </Link>
                <Link
                  href={`/r/${list.name}`}
                  className="ml-2 font-bold hover:cursor-pointer"
                >
                  /r/{list.name}
                </Link>
                <p className="ml-auto font-medium">{list.postCount}</p>
              </div>
            ))}
          </div>
          {authenticated && (
            <div className="w-full py-6 text-center">
              <Link
                href="/subs/create"
                onClick={onClickCreate}
                className="w-full p-2 px-16 text-center text-white bg-blue-500 rounded"
              >
                커뮤니티 만들기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
