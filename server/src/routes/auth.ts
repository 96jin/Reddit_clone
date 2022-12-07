import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import User from './../entity/User';

const register = async(req: Request ,res: Response) => {
  const { email, username, password } = req.body
  try{
    let errors: any = {}
    const emailUser = await User.findOneBy({email})
    const usernameUser = await User.findOneBy({username})

    if(emailUser) errors.email = '이미 해당 이메일 주소가 사용되었습니다.'
    if(usernameUser) errors.username = '이미 이 사용자 이름이 사용되었슺니다.'

    if(Object.keys(errors).length > 0){
      return res.status(400).json(errors)
    }

    const user = new User()
    user.email = email
    user.username = username
    user.password = password
    errors = await validate(user)

  }catch(error){

  }
  console.log('email', email)
}

const router = Router()
router.post('/register', register)

export default router;