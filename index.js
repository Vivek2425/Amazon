const express = require("express");
const app = express();
const path = require('path');
app.use(express.json());
const static  = app.use(express.static('public'))
app.get("/",(req,res)=>{
    res.send("Hello world");
})
app.get("/login",(req,res)=>{
    const filePath = path.join(__dirname, 'public/login.html');
    res.sendFile(filePath);
})
app.post('/auth', (req, res) => {
    // const { email, password } = req.body;
    console.log(req.body.email)
    // You can now process the email and password data
    // For authentication, you might want to validate the user's credentials
    // against a database or some other authentication mechanism.
  
    // For now, let's just send a simple response with the received data:
    res.json({ email, password });
  });
app.listen(8000,()=>{
    console.log("http://localhost:8000")
})