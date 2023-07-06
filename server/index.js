const express = require('express')
const connection = require('./db')
const routes = require('./routes')
const cors = require('cors')

const app = express()

connection()
app.use(express.json())
app.use(cors());

app.use('/api', routes)

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`Listening on port ${port}`))
