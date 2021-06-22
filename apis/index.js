const router = require('express').Router()

router.use('/transaction', require('./tnxAnalyzer'))

module.exports = router
