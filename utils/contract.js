require('dotenv').config()
const ethers = require('ethers')

const toLowerCase = (val) => {
  if (val) return val.toLowerCase()
  else return val
}

const isValidERC20Contract = (address) => {
  return ethers.utils.isAddress(address)
}

const ContractUtils = {
  isValidERC20Contract,
  toLowerCase,
}

module.exports = ContractUtils
