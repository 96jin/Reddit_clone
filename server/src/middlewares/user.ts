import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../entity/User";

export default async ( req: Request, res: Response, next: NextFunction) => {
  try{
    const token = req.cookies.Token
    // console.log('token at user.ts' , token)
    if(!token) return next()
    
    const {email}: any = jwt.verify(token, process.env.JWT_SECRET!)
    // console.log(email)
    const user = await User.findOneBy({email})

    if(!user) throw new Error('Unauthenticated')

    // 유저 정보를 res.locals.user에 넣어주기
    res.locals.user = user
    return next()
  }
  catch(error){
    console.log(error)
    return res.status(400).json({error: "Somethine went wrong"})
  }
}
