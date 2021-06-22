require('dotenv').config()
const ethers = require('ethers')

const InterfaceID = require('../abis/interface')

const provider = new ethers.providers.JsonRpcProvider(
  process.env.MAINNET_RPC,
  parseInt(process.env.MAINNET_CHAINID),
)

const INTERFACEID_1155 = 0xd9b67a26
const INTERFACEID_721 = 0x5b5e139f

const getContractType = async (contractAddress) => {
  try {
    let sc = new ethers.Contract(contractAddress, InterfaceID, provider)
    let is721 = await sc.supportsInterface(INTERFACEID_721)
    if (is721) {
      return 721
    } else {
      let is1155 = await sc.supportsInterface(INTERFACEID_1155)
      if (is1155) return 1155
      else {
        return false
      }
    }
  } catch (error) {
    return false
  }
}

module.exports = getContractType
