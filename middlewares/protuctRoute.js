const jwt = require('jsonwebtoken');
const Charity = require('../Model/Charity');
const Supplier = require('../Model/Supplier');
const User = require('../Model/User');

const protuctRoute = (req, res, next) => {
    const authToken = req.headers.authorization;
    if (authToken && authToken.startsWith('Bearer')) {
        const token = authToken.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Access denied' });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};


// Export as CommonJS module
module.exports = {
    protuctRoute
};
