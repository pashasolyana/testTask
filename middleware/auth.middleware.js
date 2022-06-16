const tokenService = require('../services/tokenService')

module.exports = function(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader) {
            return res.status(401).json({message : 'Ошибка чтения заголовка'})
        }
        const accessToken = authHeader.split(' ')[1] 
        if(!accessToken){
            return res.status(401).json({message : 'Ошибка получения токена'})
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData) {
            return res.status(401).json({message : 'Ошибка получения данных пользователя'})
        }
        req.user = userData;
        next();
    } catch (error) {
        return res.status(401).json({error})
    }
}