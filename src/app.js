const express = require('express')
const app = express()

app.use('/user',(req,res)=>{
    res.end("Hello")
})

app.use('/stud',(req,res)=>{
    res.end("student")
})

app.listen(3000, ()=>{
    console.log("Server sucessfully listening port bbb")
})