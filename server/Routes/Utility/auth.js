

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

module.exports =  verifyGoogleToken;
