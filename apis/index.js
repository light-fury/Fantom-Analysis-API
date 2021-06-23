const router = require('express').Router()

router.use('/tx', require('./tnxAnalyzer'))
router.use('/gasprice', require('./gasOracle'))
module.exports = router
