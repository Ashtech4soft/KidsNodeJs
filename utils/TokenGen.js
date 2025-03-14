const jwt = require('jsonwebtoken')
const userToken = (userId, res) => {

    console.log(userId)
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })

    res.cookie('KidsUser', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
    })

    return token
}


const supplierToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
    // res.cookie('KidsSupplier', token, {
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    //     httpOnly: false,
    //     secure: true,
    //     sameSite: 'strict',
    // })
    return token
}

const CharityToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })
    res.cookie('KidsCharity', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
    })
    return token
}


module.exports = { userToken, supplierToken, CharityToken }