import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import Sub from "../entity/Sub";
import { makeId } from "../utils/helper";

export const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(15)
      callback(null, name+path.extname(file.originalname)) // imagename + .png
    }
  }),
  fileFilter: (_, file: any, callback) => {
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/png"){
      callback(null, true)
    }
    else{
      callback(new Error('이미지가 아닙니다.'))
    }
  }
})

export const uploadSubImage = async(req: Request, res: Response) => {
  const sub: Sub = res.locals.sub
  try{
    const type = req.body.type
  }
  catch(error){

  }
}