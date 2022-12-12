import { Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import Sub from "../entity/Sub";
import { makeId } from "../utils/helper";
import fs from "fs";

export const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname)); // imagename + .png
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      callback(null, true);
      // FileFilterCallback 은 error를 인자로 받거나, error와 imageAccecpt를 인자로 받는다.
    } else {
      callback(new Error("이미지가 아닙니다."));
    }
  },
});

export const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  try {
    const type = req.body.type;

    // 파일의 타입이 image, banner 가 아닐 시 업로드 된 파일 삭제
    if (type !== "image" && type !== "banner") {
      if (!req.file?.path) {
        return res.status(400).json({ error: "유효하지 않은 파일" });
      }
      // multer 에 의해 캡슐화 된 파일 객체에는 파일 경로가 있기 때문에
      // dirname/pwd가 자동으로 추가된다.

      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "잘못된 유형" });
    }

    let oldImageUrn: string = "";

    if (type === "image") {
      // 현재 urn 을 저장
      oldImageUrn = sub.imageUrn || "";
      sub.imageUrn = req.file?.filename || "";
    } else if (type === "banner") {
      oldImageUrn = sub.bannerUrn || "";
      sub.bannerUrn = req.file?.filename || "";
    }
    await sub.save();

    // 사용하지않는 이미지 파일 삭제 (unlinkSync)
    if (oldImageUrn !== "") {
      // 데이터 베이스는 파일 이름일 뿐이므로 개체 경로 접두사를 직접 추가해야한다.
      // Linux 및  Windows와 호환.
      const fullFileName = path.resolve(
        process.cwd(),
        "public",
        "images",
        oldImageUrn
      );
      fs.unlinkSync(fullFileName);
    }

    return res.json(sub);
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Somethine went wrong" });
  }
};
