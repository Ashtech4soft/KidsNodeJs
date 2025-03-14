const mongoose = require('mongoose')


const metrnitySchema = new mongoose.Schema({
    name: 'metrnity',
})


module.exports = mongoose.model('Metrnity', metrnitySchema)