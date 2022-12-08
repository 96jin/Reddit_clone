import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import User from "./../entity/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import userMiddleware from '../middlewares/user'
import authMiddleware from '../middlewares/auth'

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, cur: any) => {
    // Object.entries 를 쓰면 객체를 인자로 받고, 해당 객체의 key, value를 배열로 반환한다.
    prev[cur.property] = Object.entries(cur.constraints)[0][1];
    return prev;
  }, {});
};

const me = async (req: Request, res: Response) => {
  return res.json(res.locals.user)
}

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    let errors: any = {};
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    if (emailUser) errors.email = "이미 해당 이메일 주소가 사용되었습니다.";
    if (usernameUser) errors.username = "이미 이 사용자 이름이 사용되었슺니다.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;
    // 엔터티에 정해놓은 조건으로 user데이터의 유효성 검사를 해준다.
    errors = await validate(user);
    // validate 하면 target, value, property, children, constrains 요소를 가진 객체의 배열을 반환한다.
    // console.log(errors)
    // console.log(Object.entries(errors[0].constraints))
    if (errors.length > 0) {
      // console.log(mapError(errors))
      res.status(400).json(mapError(errors));
      return;
    }

    // 유저 정보를 user 테이블에 저장.
    await user.save();
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let errors: any = {};
    if (isEmpty(email)) errors.email = "이메일은 비워둘 수 없습니다.";
    if (isEmpty(password)) errors.password = "비밀번호는 비워둘 수 없습니다.";
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // DB에서 유저 찾기
    const user = await User.findOneBy({ email });
    
    // 유저가 없다면 에러 보내기
    if (!user)
      return res.status(404).json({ email: "등록되어있지 않은 메일입니다." });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res
        .status(401)
        .json({ password: "비밀번호가 일치하지 않습니다." });

    // 비밀번호가 일치하면 토큰 생성, ! 을 붙이는 이유는 변수가 지금 undefined나 null이 될 수 없다는 것을 의미
    const token = jwt.sign({ email }, process.env.JWT_SECRET!);

    // 쿠키 저장
    // var setCookie = cookie.serialize('foo','bar');
    res.set("Set-Cookie", cookie.serialize("token", token,{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60* 60* 24* 7 , // 1week
      path: '/'
    }));

    return res.json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const router = Router();
router.get('/me', userMiddleware, authMiddleware, me)
router.post("/register", register);
router.post("/login", login);

export default router;
