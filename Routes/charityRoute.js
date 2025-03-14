const upload = require('../lib/Multer');
const { protuctRoute } = require('../middlewares/protuctRoute');
const Charity = require('../Model/Charity');
const charityItems = require('../Model/charityItems');

const router = require('express').Router();

router.get('/charityCheck', protuctRoute, (req, res) => {
    try {
        res.status(200).json(req.charity)
    } catch (error) {
        console.error(error);

    }
})

router.get('/charitys', async (req, res) => {
    try {
        const charitys = await Charity.find()
        res.status(200).json(charitys)
    } catch (error) {
        console.error(error)
    }
})

router.post('/addCharityPRoduct', protuctRoute, upload.single('file'), async (req, res) => {
    const userId = req.user.userId
    const { name, description, condition, charityId } = req.body

    const filePath = req.file ? `uploads/${req.file.filename}` : null

    try {
        const newCharity = new charityItems({
            userId,
            name,
            description,
            condition,
            image: filePath,
            charity: charityId

        })
        await newCharity.save()
        res.status(200).json({ message: 'Product added successfully' })

    } catch (error) {
        console.error(error)
    }
})

router.get('/charityItems', async (req, res) => {
    try {
        const charityItem = await charityItems.find()
        res.status(200).json(charityItem)
    } catch (error) {
        console.error(error)
    }
})

router.get('/productsByCharity', protuctRoute, async (req, res) => {
    console.log(req.user);
    const charityId = req.user.userId

    try {
        const charityItem = await charityItems.find({ charityId })
        res.status(200).json(charityItem)
    } catch (error) {
        console.error(error)
    }
})

router.get('/fetchSingleCharity', protuctRoute, async (req, res) => {
    const charity = req.user.userId
    console.log(req.user);

    try {
        const singleCharity = await Charity.findById(charity)
        res.status(200).json(singleCharity)

    } catch (error) {
        console.error(error);

    }
})

router.delete('/deleteCharityProduct/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const delproduct = await charityItems.deleteOne({ _id: id });
        res.status(200).json(delproduct);
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;