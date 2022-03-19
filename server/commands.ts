import { Db, MongoClient } from "mongodb"
import admin from "firebase-admin"
import "./src/fire"
const uri = "mongodb+srv://billjesh:Billu456@cluster0.vyegx.mongodb.net/Dateapp?retryWrites=true&w=majority";
const client = new MongoClient(uri, {

});


async function deleteUser(db: Db, uid: any){
    await db.collection("users").findOneAndDelete({uid});
    await admin.auth().deleteUser(uid)
    await db.collection("daterequests").findOneAndDelete({request_sent_to: uid});
    await db.collection("daterequests").findOneAndDelete({request_sent_by: uid});
    await db.collection("user_dates").findOneAndDelete({uid});
    await db.collection("user_dates").findOneAndDelete({date_user_uid: uid});
    await db.collection("users").updateMany({}, {  $pull: { saved_users: uid } })
}

client.connect().then(async ()=>{
    const db = client.db("Dateapp");
    // await deleteUser(db, uid);
    await db.collection("messages").deleteMany({receiver_uid: "QKvVempNLwWp6To4yHzP5EFthe42", sender_uid: "b0TPuqUCI5PTibRKd6QlHAGyOYn1"})
    console.log("done");
}).catch(err=>console.log(err))






