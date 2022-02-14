import util from "util"
import multer from "multer"
import admin from "firebase-admin"
import sharp from "sharp"
import { uuid } from "./idgen"
const storage = multer.memoryStorage() ;
const st = admin.storage();

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


export async function uploadFile(file: any, dir: string, image_size?: number[]): Promise<string>{
  await removeFile(dir)
  const filename = dir+uuid();
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
    let buffer: Buffer;
    if(image_size){
      buffer = await sharp(file.buffer).resize(image_size[0], image_size[1]).jpeg({quality: 90}).toBuffer()
    }else{
      buffer = await sharp(file.buffer).resize(843, 1500).jpeg({quality: 90}).toBuffer()
    }
    blobStream.end(buffer)
  })
}

export { upload }