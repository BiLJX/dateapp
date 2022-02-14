import { MongoClient } from "mongodb"
import admin from "firebase-admin"
import "./src/fire"
const uri = "mongodb+srv://billjesh:Billu456@cluster0.vyegx.mongodb.net/Dateapp?retryWrites=true&w=majority";
const client = new MongoClient(uri, {

});

client.connect().then(async ()=>{
    const db = client.db("Dateapp");
    await db.collection("users").findOneAndDelete({uid: "9perekVvqQRrDzDUU4SE4AVxt7f2"});
    await admin.auth().deleteUser("9perekVvqQRrDzDUU4SE4AVxt7f2")
    console.log("done")
}).catch(err=>console.log(err))






