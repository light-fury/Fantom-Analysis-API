var { ethers } = require('ethers');
const { fork } = require('child_process');
var timeseries = require('timeseries-analysis');
const { blockArray, setGasInfo } = require('./variable');

const listenToMainnet = async () => {
  var fantomMainnet = 'https://rpcapi.fantom.network';
  var fantomNetwork = new ethers.providers.JsonRpcProvider(fantomMainnet);
  fantomNetwork.on("block", (blockNumber) => {
    const process = fork('./utils/fetchBlock.js');
    process.send({blockNumber});
    process.on('message', async (blockInfo) => {
      console.log(blockInfo)
    });
  })
}

const updateGasInfo = async () => {
  try {
    if (blockArray.length < 10) {
      setTimeout(() => {
        updateGasInfo();
      }, 1000);
      return;
    }
    let tempArray = [blockArray[0], ...blockArray, blockArray[blockArray.length - 1]]
    let sortedArray = [...blockArray]
    sortedArray.sort((first, second) => second.gasPrice - first.gasPrice)
    const totalCount = tempArray.length;
    const t = new timeseries.main(timeseries.adapter.fromDB(tempArray, {
      date:   'date',     // Name of the property containing the Date (must be compatible with new Date(date) )
      value:  'gasPrice'     // Name of the property containign the value. here we'll use the "close" price.
    }));

    var coeffs = t.ARMaxEntropy({
      data:	t.data,
      degree: totalCount - 1
    });
    var forecast= 0;	// Init the value at 0.
    for (var i = 0; i < coeffs.length; i++) {	// Loop through the coefficients
      forecast -= t.data[totalCount - i - 2][1]*coeffs[i];
    }
    forecast = Number(forecast.toFixed(0))
    if (forecast < 1) {
      forecast = 1
    }
    setGasInfo({
      average: forecast,
      fastest: t.max(),
      safeLow: t.min(),
      fast: sortedArray[1].gasPrice,
      block_time: blockArray[blockArray.length - 1].waitTime,
      // blockNum: blockArray[blockArray.length - 1].blockNumber,
      safeLowWait: sortedArray[sortedArray.length - 1].waitTime,
      avgWait: sortedArray[Number((sortedArray.length / 2).toFixed(0))].waitTime,
      fastWait: sortedArray[1].waitTime,
      fastestWait: sortedArray[0].waitTime
    });
    setTimeout(() => {
      updateGasInfo();
    }, 1000);
  } catch (error) {
    setTimeout(() => {
      updateGasInfo();
    }, 1000);
  }
}

module.exports = { listenToMainnet, updateGasInfo };
