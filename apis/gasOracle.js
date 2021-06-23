const router = require('express').Router()
const { getGasInfo } = require('../utils/variable');

/* GET home page. */
router.get('/', function(req, res, next) {
  try {
    res.status(200).send(getGasInfo());
  } catch (error) {
    console.log(error);
    res.status(404).send('respond with a error');
  }
});

module.exports = router
