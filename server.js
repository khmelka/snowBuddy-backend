const express = require('express')
const connectDB = require('./config/db')

const app = express()

connectDB()

app.use(express.json({extended: false}))

app.get('/', (req,res) => res.send("API running"))

//routes
app.use('/users', require('./routes/users'))
app.use('/auth', require('./routes/auth'))
app.use('/profile', require('./routes/profile'))
// app.use('/posts', require('./routes/posts'))

// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`))