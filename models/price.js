const mongoose = require('mongoose')

const PriceStore = mongoose.Schema({
  address: {
    type: String,
    required: true,
    index: {
      unique: true,
    },
  },
  price: { type: Number, default: 0 },
})

mongoose.model('PriceStore', PriceStore)
