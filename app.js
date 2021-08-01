require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const { ethers } = require('ethers')
var cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const mongoose = require('mongoose')
require('./models/price')

const { setGasInfo } = require('./utils/variable')
const { fetchBlock } = require('./utils/fetchBlock')
const { updateGasInfo } = require('./utils/gasStation')
const updatePrice = require('./utils/priceTracker')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors())
app.options('*', cors())

app.use(require('./apis'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const listenToMainnet = async () => {
  var fantomMainnet = 'https://rpcapi.fantom.network'
  var fantomNetwork = new ethers.providers.JsonRpcProvider(fantomMainnet)
  try {
    const number = await fantomNetwork.getBlockNumber()
    await fetchBlock(number)
  } catch (error) {
    //
  }
  setTimeout(async () => {
    await listenToMainnet()
  }, 100)
}

const listenToBlock = async () => {
  var fantomMainnet = 'https://rpcapi.fantom.network'
  var fantomNetwork = new ethers.providers.JsonRpcProvider(fantomMainnet)
  try {
    const number = await fantomNetwork.getBlockNumber()
    setGasInfo({
      blockNum: number,
    })
  } catch (error) {
    //
  }
  setTimeout(async () => {
    await listenToBlock()
  }, 100)
}

// module.exports = app

const connect = () => {
  const uri = process.env.DB_URL
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function () {
    console.log('oapi server has been connected to db')
    listenToMainnet()
    listenToBlock()
    updateGasInfo()
    updatePrice()
    const port = 5100
    app.listen(port, () => {
      console.log('oapi main server has been started')
    })
  })
}

connect()
