import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

const password= "mongodb+srv://admin-whatsapp-jyoti:....@cluster0.qssji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect( password , {
    useNewUrlParser: true,
    useUnifiedTopology: true
    
});

app.get("/", (req, res) => res.status(200).send("hello world"));

app.post("/messages", (req,res) => {
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