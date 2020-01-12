const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const app = express()


connectDB()

app.use(express.json({extended: false}))

//allow OPTIONS on all resources
app.use(cors({'origin': 'http://localhost:3000'}));

//routes
app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auth'))
app.use('/profile', require('./routes/profile'))
// app.use('/posts', require('./routes/posts'))



process.env.NODE_ENV === 'production'
 
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));