const mongoose = require('mongoose')



const maternityProudcts = new mongoose.Schema({
    // maternityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Metrnity' },
    productName: { type: String, },
    MaternityCategory: { type: String, required: true, },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    quantity: { type: Number }
})



module.exports = mongoose.model('MetrnityProducts', maternityProudcts)


