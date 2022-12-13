import { Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import Sub from "../entity/Sub";
import Post from "../entity/Post";
import Comment from "../entity/Comment";

const router = Router();

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;
  if (title.trim() === "") {
    return res.status(400).json({ title: "제목은 비워둘 수 없습니다." });
  }
  const user = res.locals.user;

  try {
    const subRecord = await Sub.findOneOrFail({ where: { name: sub } });
    const post = new Post();
    post.title = title;
    post.body = body;
    post.sub = subRecord;
    post.user = user;

    await post.save();

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  try {
    const post = await Post.findOneOrFail({
      where: { identifier, slug },
      relations: ["sub", "votes"],
    });
    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }
    return res.json(post)
  } 
  catch (error) {
    console.log(error)
    return res.status(400).json({error: '게시물을 찾을 수 없습니다.'})
  }
};

const createPostComment = async(req: Request, res: Response) => {
  const {identifier, slug} = req.params
  const {body} = req.body

  try{
    const post = await Post.findOneByOrFail({identifier, slug})
    const comment = new Comment()
    comment.body = body
    comment.username = res.locals.user.username
    comment.post = post

    if(res.locals.user){
      post.setUserVote(res.locals.user)
    }

    await comment.save()
    return res.json(comment)
  }
  catch(error){
    console.log(error)
    return res.status(404).json({error: '게시물을 찾을 수 없습니다.'})
  }
}

router.get("/:identifier/:slug", userMiddleware, getPost);
router.post("/", userMiddleware, authMiddleware, createPost);
router.post('/:identifier/:slug/comments', userMiddleware, createPostComment)

export default router;
