import React from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Comment, Post } from "../../types";
import PostCard from "../../components/PostCard";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";

const UserPage = () => {
  const router = useRouter();
  const { username } = router.query;

  const { data, error } = useSWR(username ? `/users/${username}` : null);
  if (!data) return <div>Loading...</div>;
  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* 유저 포스트 댓글 리스트 */}
      <div className="w-full md:mr-3 md:w-8/12">
        {data.userData.map((data: any) => {
          if (data.type === "Post") {
            const post: Post = data;
            return <PostCard key={post.identifier} post={post} />;
          } else {
            const comment: Comment = data;
            return (
              <div
                key={comment.identifier}
                className="flex my-4 bg-white rounded"
              >
                <div className="flex-shrink-0 w-10 py-10 text-center border-r rounded-l">
                  <i className="text-gray-500 fas fa-comment-alt fa-xs"></i>
                </div>
                <div className="w-full p2">
                  <p className="mb-2 pt-1.5 ml-1 text-xs text-gray-500">
                    <Link
                      href={`/u/${comment.username}`}
                      className="cursor-pointer hover:underline"
                    >
                      {comment.username}
                    </Link>
                    <span> commented on</span>
                    <Link
                      href={`${comment.post?.url}`}
                      className="font-semibold cursor-pointer hover:underline"
                    >
                      {comment.post?.title}
                    </Link>
                    <span className="mx-1">•</span>
                    <Link
                      href={`/r/${comment.post?.subName}`}
                      className="text-black cursor-pointer hover:underline"
                    >
                      /r/{comment.post?.subName}
                    </Link>
                  </p>
                  <hr />
                  <p className="p-1">{comment.body}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      {/* 유저 정보 */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="flex justify-center items-center p-3 bg-gray-400 rounded-t">
          <Image
            src="https://www.gravatar.com/avatar/0000?d=mp&f=y"
            alt="user profile"
            className="border border-white rounded-full"
            width={24}
            height={24}
            style={{ height: 24 }}
          />
          <p className="pl-2 text-md">{data.user.username}</p>
        </div>
        <div className="p-3 text-center bg-white">
          <p>{dayjs(data.user.createdAt).format("YYYY.MM.DD")} 가입</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
