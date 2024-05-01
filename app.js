const express = require('express')
const app = express();
const path = require('path')
const PORT = 3000;
const mongoose = require('mongoose')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
mongoose.connect(`mongodb+srv://root:py6czQnOyXhFPkng@cluster0.ybpep9u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log(`Connected to mongo DB`)
})
app.get('/', (req, res)=>{
    res.sendFile('public', 'index.html')
})
app.listen(PORT, ()=>{
    console.log(`Server work on PORT: ${PORT}`)
})