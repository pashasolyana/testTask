const Router = require('express');
const router = new Router();
const userController = require('../Controllers/userController')
const authMiddleWare = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.Middleware')

router.post('/reg', userController.registration)
router.post('/login', userController.login)
router.post('/addUser',roleMiddleware(['ADMIN']), userController.addUser)
router.post('/logout', userController.logout)
router.put('/settings', authMiddleWare, userController.changePassword)
router.get('/users',roleMiddleware(['ADMIN']), userController.getAllUsers)
router.delete('/deleteUser/:userId',authMiddleWare, userController.deleteUser)

module.exports = router