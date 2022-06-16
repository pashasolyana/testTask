const tokenService = require('../services/tokenService')

module.exports = function(role) {
    return function(req, res, next){
        try{
            const authHeader = req.headers.authorization;
            if(!authHeader) {
                return res.status(401).json({message : 'Ошибка чтения заголовка'})
            }
            const accessToken = authHeader.split(' ')[1] 
            if(!accessToken){
                return res.status(401).json({message : 'Ошибка получения токена'})
            }
            const {role : userRoles} = tokenService.validateAccessToken(accessToken);
            let hasRole = false;
            userRoles.forEach(role => {
                if(role.includes(role)) {
                    hasRole = true
                }
            });
            if(!hasRole) {
                return res.status(403).json({message : "У вас нет доступа"})
            }
            next();
        }catch(error) {
            console.log(error);
            return res.status(403).json({message : "Пользователь не авторизован"})
        }
    }
}
