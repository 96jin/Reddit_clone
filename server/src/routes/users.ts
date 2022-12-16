import { Request, Response, Router } from 'express';
import userMiddleWare from '../middlewares/user'
import User from '../entity/User';
import Post from '../entity/Post';
import Comment from '../entity/Comment';
const router = Router()

const getUsers = async(req: Request, res: Response) => {
  const {username} = req.params
  try{
    // user 정보 가져오기
    const user = await User.findOneOrFail({
      where: {username},
      select: ["username", "createdAt"],
    })

    // 유저가 쓴 포스트 정보 가져오기
    const posts = await Post.find({
      where: {username: user.username},
      relations: ['comments','votes','sub'],
    })

    // 유저가 쓴 댓글 정보 가져오기
    const comments = await Comment.find({
      where: {username: user.username},
      relations: ['post'],
    })

    if(res.locals.user){
      const {user} = res.locals
      posts.forEach((p)=>p.setUserVote(user))
      comments.forEach((c)=>c.setUserVote(user))
    }

    let userData: any[] = []
    
    // toJSON을 하는 이유
    // spread oprator 을 사용해서 새로운 객체로 복사할 때 인스턴스(클래스) 상태로 하면
    // @Expose를 이용한 getter는 들어가지 않는다. 그래서 객체로 바꾼 후 복사
    posts.forEach((p)=>userData.push({type: "Post", ...p.toJSON()}))
    comments.forEach((c)=>userData.push({type: "Comment", ...c.toJSON()}))

    // 최신순 (내림차순)
    userData.sort((a,b)=>b-a)

    return res.json({user, userData})
  }
  catch(error){
    console.log(error)
    res.status(500).json({error: 'Something went wrong'})
  }
}

router.get('/:username', userMiddleWare, getUsers)

export default router