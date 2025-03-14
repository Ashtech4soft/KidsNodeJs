const router = require('express').Router()
const upload = require('../lib/Multer');
const { protuctRoute } = require('../middlewares/protuctRoute');
const Cart = require('../Model/Cart');
const Category = require('../Model/Category');
const Order = require('../Model/Order');
const orderItems = require('../Model/oderItems');
const Product = require('../Model/Product');
const Review = require('../Model/Review');

const Razorpay = require('razorpay');
const Payment = require('../Model/Payment');
const maternity = require('../Model/maternity');
const maternityOrders = require('../Model/maternityOrders');
require('dotenv').config();

router.post('/addProduct', protuctRoute, upload.single('file'), async (req, res) => {
    const { name, price, category, supplierId, communityId, description } = req.body;
    console.log(name, price, category, supplierId);
    const filePath = req.file ? `uploads/${req.file.filename}` : null;

    try {
        const newProduct = new Product({
            name,
            price,
            category,
            supplierId,
            communityId,
            description,
            productImage: filePath,
        })

        await newProduct.save()
        res.status(201).json({ message: 'Product added successfully' })

    } catch (error) {
        console.error(error);

    }
})

router.get('/fetchAllProduct', async (req, res) => {
    try {
        const allProduct = await Product.find().populate('communityId', 'name')
        console.log(allProduct);

        res.status(200).json(allProduct)
    } catch (error) {
        console.log(error);

    }
})


router.put('/updateProductDetails', protuctRoute, upload.single('file'), async (req, res) => {

    const { name, price, category, supplierId, communityId, description, productId } = req.body;
    const filePath = req.file ? `uploads/${req.file.filename}` : null;
    try {
        const update = {}
        if (name) update.name = name
        if (price) update.price = price
        if (category) update.category = category
        if (supplierId) update.supplierId = supplierId
        if (communityId) update.communityId = communityId
        if (description) update.description = description
        if (filePath) update.productImage = filePath
        const product = await Product.findByIdAndUpdate({ _id: productId }, update, { new: true })
        res.status(200).json(product)
    } catch (error) {
        console.log(error);
    }

})

router.delete('/deleteProduct/:id', protuctRoute, async (req, res) => {
    const { id: productId } = req.params;
    try {
        const product = await Product.findByIdAndDelete({ _id: productId })
        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting product" });
    }
})

router.post('/addReview', protuctRoute, async (req, res) => {
    const userId = req.user.userId
    try {

        const { ProductId, rating, comment } = req.body;
        const newReview = {
            userId,
            productId: ProductId,
            rating,
            review: comment
        }

        const prdReview = new Review(newReview)
        await prdReview.save()
        res.status(201).json({ message: 'Review added successfully' })

    } catch (error) {
        console.error(error);
    }
})

router.get('/fetchPrdReview/:id', async (req, res) => {
    try {
        const { id: productId } = req.params;

        const reviews = await Review.find({ productId: productId }).populate('userId', 'name')
        console.log(reviews);

        res.status(200).json(reviews)
    } catch (error) {
        console.error(error);
    }
})

router.get('/fetchReviews', async (req, res) => {
    try {

        const reviews = await Review.find().populate('userId', 'name')
        console.log(reviews);

        res.status(200).json(reviews)
    } catch (error) {
        console.error(error);
    }
})

router.post('/addToCart', protuctRoute, async (req, res) => {
    const userId = req.user.userId
    const { product, quantity = 1 } = req.body

    console.log(product);

    try {

        let cartP = await Cart.findOne({ userId })
        if (!cartP) {
            cartP = new Cart({ userId: userId, products: [{ productId: product, quantity }] })
        }
        else {
            const existingProduct = cartP.products.find(prd => prd.productId.toString() === product)
            console.log(existingProduct);

            if (existingProduct) {
                existingProduct.quantity += quantity
            }
            else {
                cartP.products.push({ productId: product, quantity: quantity })
            }
        }
        await cartP.save()

    }
    catch (error) {
        console.error(error)
    }
})


router.get('/fetchCart', protuctRoute, async (req, res) => {
    try {
        const userId = req.user.userId
        const cart = await Cart.findOne({ userId }).populate('products.productId', 'name price productImage')
        console.log(cart);
        res.status(200).json(cart)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.put('/decrease/:id', protuctRoute, async (req, res) => {
    const { id: productId } = req.params
    const userId = req.user.userId
    try {
        const quantityDecrease = await Cart.findOneAndUpdate({ userId: userId, "products.productId": productId }, { $inc: { "products.$.quantity": -1 } }, { new: true })
        res.status(200).json('decreased')
    } catch (error) {
        console.log(error);

    }
})

router.delete('/remove/:id', protuctRoute, async (req, res) => {
    const { id: productId } = req.params;
    const userId = req.user.userId;

    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: userId },
            { $pull: { products: { productId: productId } } },
            { new: true }
        );

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})



router.get('/fetchProductBySupplier', protuctRoute, async (req, res) => {
    try {
        const supplier = req.user.userId
        const products = await Product.find({ supplierId: supplier })
        console.log(products);

        res.status(200).json(products)
    } catch (error) {
        console.error(error);
    }
})

router.get('/communityProduct/:id', protuctRoute, async (req, res) => {
    try {
        // const supplier = req.user.userId
        const { id: commId } = req.params;
        const products = await Product.find({ communityId: commId })
        console.log(products);

        res.status(200).json(products)
    } catch (error) {
        console.error(error);
    }
})

router.post('/newCategory', upload.single('image'), async (req, res) => {
    try {
        const { name, description } = req.body;

        const newCategory = new Category({
            category_name: name,
            description: description,
            image: `uploads/${req.file.filename}`
        })

        await newCategory.save()
        res.status(201).json({ message: 'New category added successfully' })

    } catch (error) {
        console.error(error);
    }
})

router.post('/delCategory/:id', async (req, res) => {
    try {
        const { id: categoryId } = req.params;
        const newCategory = await Category.findByIdAndDelete(categoryId)
        await newCategory.save()
        res.status(201).json({ message: 'New category added successfully' })

    } catch (error) {
        console.error(error);
    }
})

router.get('/fetchAllCategory', async (req, res) => {
    try {
        const allCategory = await Category.find()
        console.log(allCategory);

        res.status(200).json(allCategory)
    } catch (error) {
        console.error(error);

    }
})




//? ordering

const instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
})

router.post('/createOrder', protuctRoute, async (req, res) => {
    const userId = req.user.userId
    const { totalPrice, cartItems } = req.body
    const options = {
        amount: totalPrice * 100,
        currency: "INR",
        receipt: `receipt_order_${userId}`,
    }
})

router.post('/payment', protuctRoute, async (req, res) => {
    const userId = req.user.userId
    const { totalPrice } = req.body


    const options = {
        amount: totalPrice * 100,
        currency: "INR",
        receipt: `receipt_order_${userId}`,
    }
    try {
        const orderpay = await instance.orders.create(options)
        res.status(200).json({ message: 'Payment successful', order: orderpay })
    } catch (error) {
        console.error(error);
    }
})

router.post('/order', protuctRoute, async (req, res) => {
    const userId = req.user.userId
    const { totalPrice, cartItems, orderId } = req.body
    console.log(req.body);

    try {

        const Ordering = new Order({
            userId,
        })
        await Ordering.save()

        const orderedItem = Array.isArray(cartItems)
            ? cartItems.map(product => ({
                orderId: Ordering._id,
                itemId: product.productId._id,
                userId,
                orderQty: product.quantity,
                price: product.productId.price * product.quantity
            }))
            : {
                orderId: Ordering._id,
                itemId: cartItems.productId ? cartItems.productId._id : cartItems._id,
                userId,
                orderQty: 1,
                price: cartItems.price
            }


        await orderItems.insertMany(orderedItem)

        const paymentdata = new Payment({
            userId,
            orderId: Ordering._id,
            amount: totalPrice,
            razorpayPaymentId: orderId,
            paidTo: 'Admin',
        })
        await paymentdata.save()

        res.status(201).json({ message: 'Order placed successfully' })
    } catch (error) {
        console.error(error);
    }
})

router.post('/maternityorder', protuctRoute, async (req, res) => {
    const userId = req.user.userId
    const { totalPrice, quantities, orderId, prsize } = req.body
    console.log(req.body);

    try {



        const orderedItems = Object.entries(quantities).map(([productId, quantity]) => ({
            orderId,
            itemId: productId,
            userId,
            orderQty: quantity,
            price: totalPrice  // Get price from product details
        }));

        // Store the order in the database
        await maternityOrders.insertMany(orderedItems);

        const paymentdata = new Payment({
            userId,
            orderId,
            amount: totalPrice,
            razorpayPaymentId: orderId,
            paidTo: 'Admin',
        })
        await paymentdata.save()

        res.status(201).json({ message: 'Order placed successfully' })
    } catch (error) {
        console.error(error);
    }
})


router.get('/fetchOrderByUser', protuctRoute, async (req, res) => {
    const userId = req.user.userId
    try {
        const orders = await orderItems.find({ userId }).populate('itemId', 'name productImage price')
        res.status(200).json(orders)

    } catch (error) {
        console.error(error);
    }
})

router.get('/fetchMaternityOrderByUser', protuctRoute, async (req, res) => {
    const userId = req.user.userId
    console.log(userId);

    try {
        const orders = await maternityOrders.find({ userId: userId }).populate('itemId', 'productName image price ')
        console.log(orders);
        res.status(200).json(orders)

    } catch (error) {
        console.error(error);
    }
})

router.get('/fetchAllMaternityorders', async (req, res) => {
    try {
        const orders = await maternityOrders.find().populate('itemId', 'productName image price ')
        console.log(orders);
        res.status(200).json(orders)
    } catch {
        console.error(error)
    }

})

router.get('/shopByCategory/:cate', async (req, res) => {
    const { cate } = req.params;
    console.log('cate', cate);

    try {
        const products = await Product.find({ category: cate })
        console.log(products);
        res.status(200).json(products)
    }
    catch (error) {
        console.error(error);
    }
})

router.get('/fetchorders', protuctRoute, async (req, res) => {
    try {
        const orders = await orderItems.find().populate('itemId', 'name productImage price communityId supplierId')
        console.log(orders);
        res.status(200).json(orders)
    } catch (error) {
        console.error(error);
    }
})

router.get('/fetchPayments', protuctRoute, async (req, res) => {
    try {
        const payments = await Payment.find().populate('userId', 'name email')
        console.log(payments);
        res.status(200).json(payments)
    } catch (error) {
        console.error(error);
    }
})

router.get('/fetchUserrPayments', protuctRoute, async (req, res) => {
    const userId = req.user.userId
    try {
        const payments = await Payment.find({ userId: userId })
        console.log(payments);
        res.status(200).json(payments)
    } catch (error) {
        console.error(error);
    }
})


router.get('/getSingleProduct/:id', async (req, res) => {
    const { id: prdId } = req.params;
    console.log('id', prdId);
    try {
        const product = await Product.findById(prdId)
        console.log(product);
        res.status(200).json(product)
    } catch (error) {
        console.error(error);
    }
})


router.put('/updateOrderStatus/:id', protuctRoute, async (req, res) => {
    const { id: orderId } = req.params
    const { status } = req.body;
    console.log(req.body);
    console.log(req.params.id);
    console.log(status)
    try {
        const StatusUpdate = await orderItems.findOneAndUpdate({ _id: orderId }, { status: status }, { new: true })
        console.log(StatusUpdate);
        res.status(200).json(StatusUpdate)
    } catch (error) {
        console.error(error);

    }
})
router.put('/updateMaternityOrderStatus/:id', protuctRoute, async (req, res) => {
    const { id: orderId } = req.params
    const { status } = req.body;
    console.log(req.params.id);
    console.log(status)
    try {
        const StatusUpdate = await maternityOrders.findOneAndUpdate({ _id: orderId }, { status: status }, { new: true })
        // const StatusUpdate = await maternityOrders.find()
        console.log(StatusUpdate);
        // res.status(200).json(StatusUpdate)
    } catch (error) {
        console.error(error);

    }
})


router.post('/addmaternityProducts', protuctRoute, upload.single('file'), async (req, res) => {

    const { name, price, description, category, maternityCategory } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;
    try {
        const newMaternityProduct = new maternity({
            productName: name,
            price: price,
            description: description,
            image: image,
            category: category,
            MaternityCategory: maternityCategory
        })
        await newMaternityProduct.save()
        res.status(201).json({ message: 'New maternity product added successfully' })
    } catch (error) {
        console.error(error);
    }
})

router.get('/fetchmaternityProducts', async (req, res) => {

    try {
        const fetchMaternityProduct = await maternity.find()
        console.log(fetchMaternityProduct);
        res.status(200).json(fetchMaternityProduct)
    } catch (error) {
        console.error(error);
    }
})

router.get('/maternityProductsbyCategory/:cate', async (req, res) => {
    const { cate: category } = req.params;
    console.log(req.params);

    try {
        const fetchMaternityProduct = await maternity.find({ MaternityCategory: category })
        console.log(fetchMaternityProduct);
        res.status(200).json(fetchMaternityProduct)
    } catch (error) {
        console.error(error);
    }
})



module.exports = router