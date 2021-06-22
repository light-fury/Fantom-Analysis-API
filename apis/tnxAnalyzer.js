const router = require('express').Router()
const analyzeTransaction = require('../utils/analyzer')

router.post('/analyzeTransaction', async (req, res) => {
  let tnxHash = req.body.hash
  let result = await analyzeTransaction(tnxHash)
  return res.json({
    result,
  })
})

module.exports = router
