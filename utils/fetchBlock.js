var { ethers } = require('ethers');
const { addToBlock } = require('./variable');

const fetchBlock = async (blockNumber) => {
  var fantomMainnet = 'https://rpcapi.fantom.network';
  var fantomNetwork = new ethers.providers.JsonRpcProvider(fantomMainnet);
  try {
    const blockInfo = await fantomNetwork.getBlockWithTransactions(blockNumber);
    let gasPrice = 0;
    if (blockInfo && blockInfo.transactions.length > 0) {
      blockInfo.transactions.every(item => {
        gasPrice += item.gasPrice;
      })
      gasPrice /= blockInfo.transactions.length;
      gasPrice /= 1000000000;
      const prevBlockInfo = await fantomNetwork.getBlockWithTransactions(blockNumber - 1);
      addToBlock({
        gasPrice,
        gasUsed: blockInfo.gasUsed.toNumber(),
        blockNumber: blockNumber,
        blockTime: blockInfo.timestamp,
        waitTime: prevBlockInfo? (blockInfo.timestamp - prevBlockInfo.timestamp) : 0,
        date: new Date(blockInfo.timestamp * 1000)
      });
    }
    return true;
  } catch (error) {
    console.log('Fetch Error: ', error);
    return false;
  }
}
// receive message from master process
// process.on('message', async (message) => {
//   await fetchBlock(message.blockNumber);
// });

module.exports = {
  fetchBlock
}