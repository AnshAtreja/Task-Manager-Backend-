const jwt = require('jsonwebtoken');

const JWT_SECRET = 'open_in_app_secret_key'; 

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.userId = decodedToken.userId;
        next();
    });
};

module.exports = authenticateUser;
