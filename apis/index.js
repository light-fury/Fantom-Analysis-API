const router = require('express').Router()

router.use('/tx', require('./tnxAnalyzer'))
module.exports = router
