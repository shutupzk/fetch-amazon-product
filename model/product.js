const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
    {
        asin: String,
        title: String,
        productDimensions: String,
        category: { type: Array },
        rank: { type: Array },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        deleted_at: { type: Date }
    },
    {
        versionKey: false
    }
)

const Product = mongoose.model('product', schema, 'product')

exports.Product = Product