const upload = require('../lib/Multer');
const { protuctRoute } = require('../middlewares/protuctRoute');
const Community = require('../Model/Community');
const communityMembers = require('../Model/communityMembers');
const Messages = require('../Model/Messages');
const oderItems = require('../Model/oderItems');
const Order = require('../Model/Order');
const router = require('express').Router();


router.post('/addCommunity', protuctRoute, upload.single('file'), async (req, res) => {
    const user = req.user.userId
    try {
        const { name, description } = req.body
        const filePath = req.file ? `uploads/${req.file.filename}` : null

        const newCommunity = new Community({
            name,
            description,
            file: filePath,
            admin: user
        })
        await newCommunity.save()
        const commAdminAdd = new communityMembers({
            userId: user,
            communityId: newCommunity._id
        })
        await commAdminAdd.save()
        res.status(201).json({ message: 'New community added successfully' })
    } catch (error) {
        console.error(error)
    }
})

router.get('/getCommunities', async (req, res) => {
    try {
        const communities = await Community.find()
        console.log(communities);

        res.status(200).json(communities)
    } catch (error) {
        console.error(error)
    }
})

router.post('/joinCommunity', protuctRoute, async (req, res) => {
    const { commId } = req.body
    const userId = req.user.userId
    console.log(commId, userId);

    try {
        const commMember = await communityMembers.find({ communityId: commId })
        if (commMember.length <= 6) {
            const newMember = new communityMembers({
                userId,
                communityId: commId
            })
            await newMember.save()
            res.status(201).json({ message: 'User joined the community successfully' })
        }
        else {
            res.status(400).json({ message: 'Community is already full' })
        }


    } catch (error) {
        console.error(error)
    }
})

router.get('/getCommMembers', async (req, res) => {
    try {
        const commMembers = await communityMembers.find().populate('userId', 'name')
        console.log(commMembers);
        res.status(200).json(commMembers)
    } catch (error) {
        console.error(error)
    }
})

router.post('/leaveCommunity', protuctRoute, async (req, res) => {
    const { commId } = req.body
    const userId = req.user.userId
    try {
        const memberToRemove = await communityMembers.findOneAndDelete({
            communityId: commId,
            userId: userId
        })
        if (memberToRemove) {
            res.status(200).json({ message: 'User left the community successfully' })
        } else {
            res.status(404).json({ message: 'User not found in the community' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

router.post('/deleteCommunity', protuctRoute, async (req, res) => {
    try {
        const { commId } = req.body
        const communityToDelete = await Community.findByIdAndDelete(commId)
        if (communityToDelete) {
            await communityMembers.deleteMany({ communityId: commId })
            res.status(200).json({ message: 'Community deleted successfully' })
        } else {
            res.status(404).json({ message: 'Community not found' })
        }
    } catch (error) {
        colsole.error(error)
    }
})

router.get('/getSingleComm/:id', async (req, res) => {
    try {
        const { id: commId } = req.params
        const community = await Community.findById(commId)
        console.log(community, 'sdnfks');
        res.status(200).json(community)
    } catch (error) {
        console.error(error)
    }
})

router.post('/sendMessage', protuctRoute, async (req, res) => {
    const { commId, message } = req.body
    const userId = req.user.userId
    console.log(req.body);
    console.log(message, userId);


    try {
        const newMessage = new Messages({
            sender: userId,
            community: commId,
            content: message
        })
        await newMessage.save()
        res.status(201).json(newMessage)
    } catch (error) {
        console.error(error)
    }
})



router.get('/getMessages/:id', async (req, res) => {
    const { id: commId } = req.params;
    try {
        const message = await Messages.find({ community: commId }).populate('sender', 'name')
        // console.log(message);
        res.status(200).json(message)
    } catch (error) {
        console.error(error)
    }
})


router.delete('/removeMember/:id/:commu', protuctRoute, async (req, res) => {
    try {
        const { id: userId } = req.params
        const { commu: commId } = req.params
        console.log(userId, commId);
        console.log(req.params);


        const memberToRemove = await communityMembers.findOneAndDelete({
            communityId: commId,
            userId: userId
        })
        console.log(memberToRemove);

        if (memberToRemove) {
            res.status(200).json({ message: 'Member deleted successfully' })
        } else {
            res.status(404).json({ message: 'Member not found in the community' })
        }

    } catch (error) {
        console.error(error)
    }
})


router.get('/getOrders/:id', async (req, res) => {
    const { id: commuId } = req.params;
    try {
        const order = await oderItems.find().populate('itemId')
        const commuProduct = order.filter(odr => odr.itemId.communityId == commuId)
        res.status(200).json(commuProduct)
    } catch (error) {
        console.error(error)
    }
})
module.exports = router