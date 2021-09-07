const router = require('express').Router()
const { getGasInfo } = require('../utils/variable');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools/', 250);
    const gasPrice = await provider.getGasPrice()
    
    res.status(200).send({
      ...getGasInfo(),
      gasPrice: new BigNumber(gasPrice.toNumber()).dividedBy(new BigNumber('1000000000')).toNumber()
    });
  } catch (error) {
    console.log(error);
    res.status(404).send('respond with a error');
  }
});

module.exports = router
