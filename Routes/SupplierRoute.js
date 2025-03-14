const { protuctRoute } = require('../middlewares/protuctRoute');
const Product = require('../Model/Product');
const Supplier = require('../Model/Supplier')

const router = require('express').Router()

router.get('/suppliers', async (req, res) => {
    try {
        const suppliers = await Supplier.find()
        console.log(suppliers);

        res.status(200).json(suppliers)
    } catch (error) {
        console.error(error)
    }
})

router.get('/profile', protuctRoute, async (req, res) => {
    console.log('hlo');

    try {
        const user = req.user.userId
        const profile = await Supplier.findById(user).select('-password')
        res.status(200).json(profile)

    } catch (error) {
        console.error(error)
    }
})


router.put('/updateprofile', protuctRoute, async (req, res) => {
    try {
        const user = req.user.userId
        const { name, email, phone } = req.body
        const update = {}
        if (name) update.name = name
        if (email) update.email = email
        if (phone) update.phone = phone
        await Supplier.findByIdAndUpdate(user, update, { new: true })
        res.status(200).json({ message: 'Profile updated successfully' })

    } catch (error) {
        console.error(error)
    }
})
router.get('/supplierCheck', protuctRoute, async (req, res) => {
    try {
        res.status(200).json(req.supplier)
    } catch (error) {
        console.error(error);

    }
})
module.exports = router;