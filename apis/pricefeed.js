require('dotenv').config()
const router = require('express').Router()
const mongoose = require('mongoose')
const PriceStore = mongoose.model('PriceStore')

const { toLowerCase } = require('../utils/contract')
const ContractUtils = require('../utils/contract')
const WrappedFTM = process.env.WFTM_ADDRESS

router.get('/:address', async (req, res) => {
  try {
    let address = ContractUtils.toLowerCase(req.params.address)
    if (address == 'ftm' || address == 'wftm' || address == 'fantom')
      address = toLowerCase(WrappedFTM)
    if (!ContractUtils.isValidERC20Contract(address))
      return res.status(400).json({
        data: 'failed',
      })
    let priceFeed = await PriceStore.findOne({ address: address })
    if (priceFeed)
      return res.status(200).json({ price: priceFeed.price, address: address })
    else {
      let priceStore = new PriceStore()
      priceStore.address = address
      priceStore.price = 0
      let _priceStore = await priceStore.save()
      return res.status(200).json({
        price: _priceStore.price,
        address: _priceStore.address,
        data: 'Price for this token will be available in 2 mins.',
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      data: 'failed',
    })
  }
})

module.exports = router
