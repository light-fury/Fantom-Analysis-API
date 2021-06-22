const router = require('express').Router()
const analyzeTransaction = require('../utils/analyzer')

router.get('/analyzeTransaction/:hash', async (req, res) => {
  let tnxHash = req.params.hash
  let result = await analyzeTransaction(tnxHash)
  return res.json({
    result,
  })
})

module.exports = router
