import util from "util"
import multer from "multer"
import admin from "firebase-admin"
import sharp from "sharp"
import { uuid } from "./idgen"
const storage = multer.memoryStorage() ;
const st = admin.storage();


interface CropInfoClient {
  x: string,
  y: string,
  width: string,
  height: string
}

interface CropInfo {
  left: number,
  top: number,
  width: number,
  height: number
}

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
      //if (mimeTypes.includes(file.mimetype)) {
        return cb(null, true);
      //}
      //cb('File type not allowed', false);
  }
}).any();


function getUrl(fileName: any){
  const file = st.bucket().file(fileName)
  const url = file.publicUrl()
  return url
}

async function removeFile(dir: string){
  try{
    await st.bucket().deleteFiles({prefix: dir})
  }catch(err){
    return err
  }
}


export async function uploadFile(buffer: Buffer, dir: string, replace = true): Promise<string>{
  replace && await removeFile(dir)
  const filename = replace?dir+uuid():dir;
  const blob = st.bucket().file(filename);
  const blobStream = blob.createWriteStream();
  return new Promise(async (res, rej)=>{
    blobStream.on("error", (err)=> {
      console.log(err)
      rej("")
    })
    blobStream.on("finish", async ()=>{
      await st.bucket().file(filename).makePublic();
      const public_url = getUrl(filename)
      res(public_url)
    })
    blobStream.end(buffer)
  })
}

export async function cropPicture(buffer: Buffer, vals: CropInfoClient, resize: number[] = [1200, 2133]){
  const cropInfo: CropInfo = {
    left: parseFloat(vals.x ?? "0"),
    top: parseFloat(vals.y ?? "0"),
    width: parseFloat(vals.width ?? "0"),
    height: parseFloat(vals.height ?? "0"),
  }
  const meta = await sharp(buffer).metadata();
  if(!meta.height || !meta.width) throw new Error("invalid metadata");
  cropInfo.top = Math.round((cropInfo.top / 100) * meta.height);
  cropInfo.left = Math.round((cropInfo.left / 100) * meta.width);
  cropInfo.width = Math.round((cropInfo.width / 100) * meta.width);
  cropInfo.height = Math.round((cropInfo.height / 100) * meta.height);
  const imgBuffer = await sharp(buffer).extract(cropInfo).resize(resize[0], resize[1]).jpeg().toBuffer();
  return imgBuffer;
}

export { upload }