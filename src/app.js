const express = require('express')
const connectDB= require('./config/database')
const app = express();
const User = require('./models/user')

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

app.use(express.json())
app.post('/signup',async(req,res)=>{
    
    console.log(req.body)
    const user = new User(req.body)
    //const user = new User(userObj)
    try{
    await user.save()
      res.send("Data sucessfully saved")
    }catch(err){
      res.status(400).send("Error Saving the user:" +err.message);
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

