const express = require('express')
const connectDB= require('./config/database')
const app = express();
const User = require('./models/user');

const cookieParser = require('cookie-parser')

const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/requests')

app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/', requestRouter)

app.use(express.json())
app.use(cookieParser())


connectDB().then(()=>{
    console.log("Database connection successfully")
    app.listen(3000, ()=>{
        console.log("Server sucessfully listening port bbb")
    })
}).catch((err)=>{
    console.log("Database can not be connected")
})
// app.get('/user',(req,res)=>{
//     res.send({firstname:"saloni",lastname:"pande"})
// })



app.delete("/user", async(req,res)=>{
    const userid= req.body.userid;
    try{
        const user= await User.findByIdAndDelete({_id:userid})
        res.send("user deleted successfully")
    }
    catch(err){
     res.status(400).send("something went wrong")
    }
})

app.patch("/user", async(req,res)=>{
    const data = req.body;
    const userid = req.body.userid
    try{
        const user = await User.findByIdAndUpdate({_id:userid},data)
        res.send("update data sucessfully")
    }
    catch(err){
        res.status(400).send("something went wrong")
    }
})

app.get('/user', async(req,res)=>{
    const userEmailID = req.body.emailId;
    
    try{
        const user = await User.find({emailId:userEmailID})
        if(user.length === 0){
            res.status(400).send("User not found")
        }else{
        res.send(user)
        }
    }catch(err){
        res.status(404).send("Something went wrong")
    }
})

app.get('/feed',async(req,res)=>{
   
    try{
       const users = await User.find({})
       res.send(users)
    }catch(err){
        res.status(404).send("Something went wrong")
    }
})


// app.delete('/user',(req,res)=>{
//     res.send("Deleted Sucessfully")
// })

// app.use('/user',(req,res,next)=>{
//   console.log("Response1");
//   next();
 
  
// },(req,res,next)=>{
//     console.log("2nd Response Call")
//    // res.end("Response2")
//    next()
// },(req,res)=>{
//     console.log("3rd Response Call")
//     res.end("Response3")
// })
// app.use('/stud',(req,res)=>{
//     res.end("heloo jnnji")
// })

