const router = require('express').Router()
const mongoose = require('mongoose')
const NFTCONTRACT = mongoose.model('NFTCONTRACT')

router.get('/', async (req, res) => {
  try {
    let contracts = await NFTCONTRACT.find()
    let data = []
    contracts.map((sc) => {
      data.push({
        address: sc.address,
        name: sc.name,
        symbol: sc.symbol,
        type: sc.type,
        block: sc.block,
      })
    })
    return res.json({
      total: data.length,
      data: data,
    })
  } catch (error) {
    return res.status(400).json({
      status: 'failed',
    })
  }
})

module.exports = router
