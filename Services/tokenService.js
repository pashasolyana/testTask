const jwt = require('jsonwebtoken');
require('dotenv').config();

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET,{expiresIn : '15m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET,{expiresIn : '30d'})
        return {accessToken, refreshToken}
    }

    generateAccessToken(payload) {
        try {
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET);
            return {accessToken};
        } catch (error) {
            console.log(error)
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (error) {
            return null;
        }
    }
}

module.exports = new TokenService()