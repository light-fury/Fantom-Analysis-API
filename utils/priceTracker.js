require('dotenv').config()
const ethers = require('ethers')
const mongoose = require('mongoose')

const PriceStore = mongoose.model('PriceStore')

const FMINTABI = require('../abis/fantommint')
const FMINTADDRESS = process.env.FANTOMMINT_ADDRESS

const provider = new ethers.providers.JsonRpcProvider(
  process.env.MAINNET_RPC,
  parseInt(process.env.MAINNET_CHAINID),
)

const FantomMintSC = new ethers.Contract(FMINTADDRESS, FMINTABI, provider)

const updatePrice = async () => {
  try {
    let stores = await PriceStore.find({})
    stores.map(async (store) => {
      let address = store.address
      let price = await FantomMintSC.getPrice(address)
      price = ethers.utils.formatEther(price)
      await PriceStore.updateOne({ address: address }, { price: price })
    })
  } catch (error) {}
  setTimeout(async () => {
    await updatePrice()
  }, 1000 * 60 * 2)
}

module.exports = updatePrice
