import React from "react";
import { Post } from "../types";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import classNames from "classnames";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { useAuthState } from '../context/auth';
import { useRouter } from 'next/router';
import axios from 'axios';

const PostCard = ({ post, subMutate }: { post: Post, subMutate?: () => void }) => {
  const {
    identifier,
    slug,
    title,
    body,
    subName,
    createdAt,
    voteScore,
    userVote,
    commentCount,
    url,
    username,
    sub,
  } = post;

  const {authenticated} = useAuthState()
  const router = useRouter()
  const isInSubPage = router.pathname === '/r/[sub]'

  const vote = async(value: number) => {
    if(!authenticated) router.push('/login')

    if(value === userVote) value = 0 
    try{
      await axios.post('/votes',{
        identifier,
        slug,
        value,
      })
      if(subMutate) subMutate()
    }
    catch(error){
      console.log(error)
    }
  }
  
  return (
    <div
      key={identifier}
      className="flex mb-4 bg-white rounded"
      id={identifier}
    >
      {/* Vote Section */}
      <div className="flex-shrink-0 w-10 py-2 text-center rounded-l bg-gray-200">
        {/* Up Vote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
          onClick={() => vote(1)}
        >
          <FaAngleUp
            className={classNames("mx-auto", {
              "text-red-500": userVote === 1,
            })}
          />
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        {/* Down Vote */}
        <div
          className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
          onClick={() => vote(-1)}
        >
          <FaAngleDown
            className={classNames("mx-auto", {
              "text-blue-600": userVote === -1,
            })}
          />
        </div>
      </div>
      <div className="w-full p-2">
        <div className="flex items-center">
          {isInSubPage && (
            <>
              <Link href={`/r/${subName}`}>
                <Image
                  src={sub!.imageUrl}
                  alt="sub"
                  width={24}
                  height={24}
                  className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                  style={{height:24}}
                /></Link>
                <Link href={`/r/${subName}`}
                  className="text-xs font-bold cursor-pointer hover:underline"
                >
                  /r/{subName}
                </Link>
                <span className="mx-1 text-xs text-gray-500">•</span>
            </>
          )}
          <p className="text-xs text-gray-500">
            Posted by
            <Link href={`/u/${username}`} passHref>
              <span className="mx-1 hover:underline">/u/{username}</span>
            </Link>
            <Link href={url} passHref>
              <span className="mx-1 hover:underline">
                {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
              </span>
            </Link>
          </p>
        </div>
        <Link href={url}
          className="my-1 text-lg font-medium"
        >
          {title}
        </Link>
        {body && 
          <p className="my-1 text-sm">{body}</p>
        }
        <div className="flex">
          <Link href={url} passHref>
            <div>
              <i className="mr-1 fas fa-comment-alt fa-xs"></i>
              <span>{commentCount}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
