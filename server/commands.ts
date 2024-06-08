import { Db, MongoClient } from "mongodb"
import admin from "firebase-admin"
import mongoose from "mongoose"
import "./src/fire"
import { FeedSettings } from "./src/models/FeedSettings"
import { User } from "./src/models/User"
const uri = "";
// const client = new MongoClient(uri, {

// });


async function deleteUser(db: Db, uid: any){
    await db.collection("users").findOneAndDelete({uid});
    await admin.auth().deleteUser(uid)
    await db.collection("daterequests").findOneAndDelete({request_sent_to: uid});
    await db.collection("daterequests").findOneAndDelete({request_sent_by: uid});
    await db.collection("user_dates").findOneAndDelete({uid});
    await db.collection("user_dates").findOneAndDelete({date_user_uid: uid});
    await db.collection("users").updateMany({}, {  $pull: { saved_users: uid } })
}

mongoose.connect(uri).then(async ()=>{
    const users = await User.find({});
    for await(let user of users){
        const feedsettings = new FeedSettings({uid: user.uid});
        await feedsettings.save()
    }
    console.log("done")
})

// client.connect().then(async ()=>{
//     const db = client.db("Dateapp");
//     // await deleteUser(db, uid);
//     await db.collection("feedsettings").insertOne()
//     console.log("done");
// }).catch(err=>console.log(err))






