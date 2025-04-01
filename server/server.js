const express = require("express");
const mongoose=require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const authRouter= require('./routes/auth/auth-routes')

mongoose.connect("mongodb+srv://Jasmine:MyUserPassword@cluster1.ksqolek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1")
               .then(()=>console.log("mongodb connected"))
               .catch((e)=>console.log(e));

const app = express();
const PORT = process.env.PORT || 5000

app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','DELETE','PUT','PATCH'],
    allowHeaders: [
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials:true
}));


app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter)



app.listen(PORT,()=>{
    console.log(`server is listening on ${PORT}`);
    
})