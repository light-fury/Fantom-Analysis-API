const router = require('express').Router()

router.use('/tx', require('./tnxAnalyzer'))
router.use('/gasprice', require('./gasOracle'))
router.use('/pricefeed', require('./pricefeed'))
module.exports = router
