const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.use(bodyParser.json())
app.use(cors())
app.options('*', cors())

app.use(require('./apis'))

const port = 5100

app.listen(port, () => {
  console.log('started')
})
