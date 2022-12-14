import { NextFunction, Request, Response, Router } from "express";
import userMiddleware from "../middlewares/user";
import authMiddleware from "../middlewares/auth";
import { isEmpty } from "class-validator";
import { getRepository } from "typeorm";
import Sub from "../entity/Sub";
import { AppDataSource } from "../data-source";
import User from "../entity/User";
import Post from "../entity/Post";
import { upload, uploadSubImage } from "../middlewares/upload";

const createSub = async (req: Request, res: Response, next: NextFunction) => {
  const { name, title, description } = req.body;
  
  try {
    let errors: any = {};
    if (isEmpty(name)) return (errors.name = "이름은 비워둘 수 없습니다.");
    if (isEmpty(title)) return (errors.title = "제목은 비워둘 수 없습니다.");

    const sub = await AppDataSource.getRepository(Sub)
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name ", { name: name.toLowerCase() }) // :name 하면 뒤에 name 객체에 해당하는 value 가져옴
      .getOne();

    if (sub) errors.name = "서브가 이미 존재합니다.";

    if (Object.keys(errors).length > 0) throw errors;
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }

  try {
    const user: User = res.locals.user;

    const sub = new Sub();
    sub.name = name;
    sub.title = title;
    sub.description = description;
    sub.user = user;

    await sub.save();
    console.log(sub);
    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const topSubs = async (req: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s.imageUrn , 
      'https://www.gravatar.com/avatar?d=mp&f=y')`;

    const subs = await AppDataSource.createQueryBuilder()
      .select(
        `s.title, s.name, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`
      )
      .from(Sub, "s")
      .leftJoin(Post, "p", "s.name = p.subName")
      .groupBy('s.title, s.name, "imageUrl"')
      .orderBy('"postCount"', "DESC")
      .limit(5)
      .execute();
    return res.json(subs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getSub = async (req: Request, res: Response) => {
  const { subName } = req.params;
  try {
    const sub = await Sub.findOneByOrFail({ name: subName });

    // 포스트를 생성한 후에 해당 sub에 속하는 포스트 정보들을 넣어주기
    const posts = await Post.find({
      where: { subName },
      order: { createdAt: "DESC" },
      relations: ["comments", "votes"],
    });
    sub.posts = posts;
    if (res.locals.user) {
      sub.posts.forEach((p) => p.setUserVote(res.locals.user));
    }
    res.json(sub);
  } 
  catch (error) {
    return res.status(404).json({ error: "서브를 찾을 수 없음" });
  }
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;

  try {
    const sub = await Sub.findOneOrFail({
      where: { name: req.params.subName },
    });
    if (sub.username !== user.username) {
      return res
        .status(403)
        .json({ error: "이 커뮤니티를 소유하고 있지 않습니다." });
    }
    res.locals.sub = sub;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "문제가 발생했습니다." });
  }
};

const router = Router();

// 만들어준 미들웨어를 createSub 핸들러에서 사용해주기 위해서
router.post("/", userMiddleware, authMiddleware, createSub);
router.post(
  "/:subName/upload",
  userMiddleware,
  authMiddleware,
  ownSub,
  upload.single("file"),
  uploadSubImage
);
router.get("/topSubs", topSubs);
router.get("/:subName", userMiddleware, getSub);
export default router;
