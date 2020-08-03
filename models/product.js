const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    sku: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        //required: true
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
