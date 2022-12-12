import { Request, Response, Router } from 'express';
import userMiddleware from '../middlewares/user'
import authMiddleware from '../middlewares/auth'
import Sub from '../entity/Sub';
import Post from '../entity/Post';

const router = Router()

const createPost = async(req: Request, res: Response) => {
  const {title, body, sub} = req.body
  if(title.trim() === ''){
    return res.status(400).json({title: '제목은 비워둘 수 없습니다.'})
  }
  const user = res.locals.user

  try{
    const subRecord = await Sub.findOneOrFail({where : {name: sub}})
    const post = new Post()
    post.title = title
    post.body = body
    post.sub = subRecord
    post.user = user
    
    await post.save()

    return res.json(post)
  }
  catch(error){
    console.log(error)
    return res.status(500).json({error: 'Something went wrong'})
  }
}

router.post('/', userMiddleware, authMiddleware, createPost)

export default router