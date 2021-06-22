require('dotenv').config()
const { default: axios } = require('axios')
const ethers = require('ethers')

const ftmscan_key = process.env.FTMSCAN_KEY
const provider = new ethers.providers.JsonRpcProvider(
  process.env.MAINNET_RPC1,
  parseInt(process.env.MAINNET_CHAINID),
)

const getTnxReceipt = async (hash) => {
  try {
    let receipt = await provider.getTransaction(hash)
    return receipt
  } catch (error) {
    return null
  }
}
const analyzeTransaction = async (hash) => {
  let tnxInfo = await getTnxReceipt(hash)
  if (!tnxInfo) return null
  let info = []
  //   return for new smart contract deployment
  if (!tnxInfo.to) {
    return info.push({
      type: 'contract deployment',
      deployer: tnxInfo.from,
      contract: tnxInfo.creates,
      gasPrice: parseFloat(tnxInfo.gasPrice.toString()),
      gasLimit: parseFloat(tnxInfo.gasLimit.toString()),
    })
  }

  let blockNo = tnxInfo.blockNumber
  let from = tnxInfo.from
  let to = tnxInfo.to
  let value = parseFloat(tnxInfo.value.toString()) / Math.pow(10, 18)
  if (value > 0) {
    info.push({
      type: 'ftm transfer',
      from,
      to,
      value,
      gasPrice: parseFloat(tnxInfo.gasPrice.toString()),
      gasLimit: parseFloat(tnxInfo.gasLimit.toString()),
    })
  }
  //   check nft tnx
  try {
    const request_nft = `https://api.ftmscan.com/api?module=account&action=tokennfttx&address=${from}&startblock=${blockNo}&endblock=${blockNo}&sort=asc&apikey=${ftmscan_key}`
    let result = await axios.get(request_nft)
    let tnxs = result.data.result
    if (tnxs.length > 0) {
      let tnx = tnxs[0]
      info.push({
        type: 'nft transfer',
        from: tnx.from,
        to: tnx.to,
        contractAddress: tnx.contractAddress,
        tokenID: tnx.tokenID,
        tokenName: tnx.tokenName,
        gasPrice: parseFloat(tnxInfo.gasPrice.toString()),
        gasLimit: parseFloat(tnxInfo.gasLimit.toString()),
      })
    }
  } catch (error) {}

  try {
    const request_erc20 = `https://api.ftmscan.com/api?module=account&action=tokentx&address=${from}&startblock=${blockNo}&endblock=${blockNo}&sort=asc&apikey=${ftmscan_key}`
    let result = await axios.get(request_erc20)
    let tnxs = result.data.result
    if (tnxs.length > 0) {
      tnxs.map((tnx) => {
        info.push({
          type: 'erc20 transfer',
          from: tnx.from,
          to: tnx.to,
          contractAddress: tnx.contractAddress,
          value: parseFloat(tnx.value) / Math.pow(10, 18),
          tokenName: tnx.tokenName,
        })
      })
    }
  } catch (error) {}
  return info
}

module.exports = analyzeTransaction
