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


export async function uploadFile(buffer: Buffer, dir: string): Promise<string>{
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
    blobStream.end(buffer)
  })
}

export { upload }