import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";

const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    // coder from pusher
  });

app.use(express.json());

const password= "mongodb+srv://admin-whatsapp-jyoti:....@cluster0.qssji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect( password , {
    useNewUrlParser: true,
    useUnifiedTopology: true
    
});

const db = mongoose.connection;

db.once("open", () => {
    console.log("DB Connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log(change);

        if (change.operationType==="insert"){
            const messageDetails = change.fullDocument;
            pusher.trigger("message", "inserted", 
            {
                name: messageDetails.user,
                message: messageDetails.message,

            });
        }
        else{
            console.log("error triggerring pusher");
        }
    });
});

app.get("/", (req, res) => res.status(200).send("hello world"));
  
app.get("/messages/sync", (req, res) => {
    Messages.find((err, data) => {
        if(err){
            res.status(500).send(err);
        }
        else{
            res.status(200).send(data);
        }
    });
});

app.post("/messages/new", (req,res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        }
        else{
            res.status(201).send(data);
        }
    });
});

app.listen(9000, () => console.log(`server up and running at: ${port}`));