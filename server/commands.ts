import { MongoClient } from "mongodb"
const uri = "mongodb+srv://billjesh:Billu456@cluster0.vyegx.mongodb.net/Dateapp?retryWrites=true&w=majority";
const client = new MongoClient(uri, {

});

client.connect().then(()=>{
    const db = client.db("Dateapp");
    db.collection("users").updateMany({}, {$unset: {
        sex: ""
    }}, {upsert: true}).then(()=>console.log("aaaa")).catch(err=>console.log(err))
}).catch(err=>console.log(err))






