const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config({
  override: true,
  path: path.join(__dirname, 'db.env')
});

const jwtSecret = crypto.randomBytes(32).toString('hex');

function verifyToken(req, res, next) {
    // Get the token from the request headers
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const accessToken = req.headers.authorization.split(' ')[1];

    // Verify the token
    jwt.verify(accessToken, jwtSecret, (err, decoded) => {
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

async function verifyGoogleToken(req, res, next) {
    // Get the JWT token from the request headers
    const accessToken = req.headers.authorization.split(' ')[1];
    
    if (!accessToken) {
        console.log("no token!");
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Verify the token using Google's API
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
      const data = await response.json();
      let email = await data.email;
  
      if (response.ok && data.audience === process.env.CLIENT_ID) {
        // Token is valid
        req.decodedToken = data;
        console.log("authorized!");
        req.email = email;
        next();
      } else {
        // Token is invalid
        console.log("unauthorized!");
        return res.status(401).json({ message: 'Invalid token' });
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

module.exports = { verifyToken, getEmailFromToken, verifyGoogleToken };
