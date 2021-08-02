const mongoose = require('mongoose')

const NFTCONTRACT = mongoose.Schema({
  address: { type: String, required: true },
  name: { type: String },
  symbol: { type: String },
  type: { type: Number },
  blockNumber: { type: Number },
  txHash: { type: String },
})

NFTCONTRACT.index({ address: 1 }, { unique: true })

mongoose.model('NFTCONTRACT', NFTCONTRACT)
