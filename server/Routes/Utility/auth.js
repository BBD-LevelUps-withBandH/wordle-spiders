const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const jwtSecret = crypto.randomBytes(32).toString('hex');

function verifyToken(req, res, next) {
    // Get the token from the request headers
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        // If the token is valid, save the decoded token and continue
        req.decoded = decoded;
        next();
    });
}

function getEmailFromToken(token){
    const decoded = jwt.decode(token);

    // Access the email value from the decoded payload
    const email = decoded.email; 
    
    return email;
}

module.exports = { verifyToken, getEmailFromToken };
