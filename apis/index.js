const router = require('express').Router()

router.use('/tx', require('./tnxAnalyzer'))
router.use('/gasprice', require('./gasOracle'))
router.use('/pricefeed', require('./pricefeed'))
router.use('/nftcontracts', require('./nftcontract'))
module.exports = router
