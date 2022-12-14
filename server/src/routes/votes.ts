import { Request, Response, Router } from 'express';
import userMiddleware from '../middlewares/user'
import authMiddleware from '../middlewares/auth'
import User from '../entity/User';
import Post from '../entity/Post';
import Vote from '../entity/Vote';
import Comment from '../entity/Comment';
const router = Router()

const vote = async(req: Request, res: Response) => {
  const {identifier, slug, commentIdentifier, value} = req.body

  // -1 0 1 의 value만 오는지 확인
  if(![-1, 0, 1].includes(value)){
    return res.status(400).json({value: '-1, 0, 1 의 value만 올 수 있습니다.'})
  }
  try{
    const user: User = res.locals.user
    let post: Post | undefined = await Post.findOneByOrFail({identifier, slug})
    let vote: Vote | undefined | null;
    let comment: Comment | undefined

    if(commentIdentifier){
      // 댓글 식별자가 있는 경우 댓글로 vote 찾기
      comment = await Comment.findOneByOrFail({identifier: commentIdentifier})
      vote = await Vote.findOneBy({username: user.username , commentId: comment.id})
    }
    else{
      vote = await Vote.findOneBy({username: user.username, postId: post.id})
    }

    if(!vote && value === 0){
      // vote 가 없고 , value 가 0인 경우 오류 반환
      return res.status(400).json({error: 'Vote를 찾을 수 없습니다.'})
    }
    else if(!vote){
      vote = new Vote()
      vote.user = user
      vote.value = value

      if(comment) vote.comment = comment
      else vote.post = post
      await vote.save()
    }
    else if(value === 0){
      // vote가 존재하고, value가 0이면 db에서 투표를 제거한다.
      await vote.remove()
    }
    else if(vote.value !== value){
      // vote와 value가 변경된 경우, 업데이트 한다.
      vote.value = value
      await vote.save()
    }

    post = await Post.findOneOrFail({
      where: {identifier, slug},
      relations: ['comments','comments.votes','sub','votes']
    })
    
    post.setUserVote(user)
    post.comments.forEach((c)=>c.setUserVote(user))

    return res.json(post)
  }
  catch(error){
    console.log(error)
    return res.status(500).json({error: 'Something went wrong'})
  }
}

router.post('/', userMiddleware, authMiddleware, vote)

export default router