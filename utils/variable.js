
let blockArray = [];

let gasData = {
  average: 0,
  fast: 0,
  fastest: 0,
  safeLow: 0,
  block_time: 0,
  blockNum: 0,
  safeLowWait: 0,
  avgWait: 0,
  fastWait: 0,
  fastestWait: 0
};

const addToBlock = (item) => {
  blockArray.push(item);
  if (blockArray.length > 1000) {
    blockArray.shift();
  }
}

const setGasInfo = (item) => {
  gasData = {
    ...gasData,
    ...item
  }
}

const getGasInfo = () => gasData

module.exports = {
  blockArray,
  gasData,
  addToBlock,
  setGasInfo,
  getGasInfo
}