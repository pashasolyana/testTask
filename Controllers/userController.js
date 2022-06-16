const userService = require("../Services/userService");
const Role = require('../Models/roleModel')
class UserController {
    async registration(req, res) {
        try{
            const {username, password} = req.body;
            if(!username) {
                return res.status(400).json({message : 'Username is empty'})
            }
            if(!password) {
                return res.status(400).json({message : 'password is empty'})
            }
            const userInfo = await userService.registration(username, password);
            res.cookie('refreshToken', userInfo.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly : true});
            return res.json(userInfo)
        }catch(error){
            console.log(error)
            return res.status(400).json({message : error})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            if(!username) {
                return res.status(400).json({message : 'Username is empty'})
            }
            if(!password) {
                return res.status(400).json({message : 'password is empty'})
            }
            const userInfo = await userService.login(username, password);
            res.cookie('refreshToken', userInfo.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly : true});
            return res.json(userInfo)
        } catch (error) {
            console.log(error)
            return res.status(400).json({message : error})
        }
    }

    async logout(req, res) {
        res.clearCookie('refreshToken');
    }

    async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const {newPassword, oldPassword} = req.body;
            if(!newPassword) {
                return res.status(400).json({message : 'newPassword is empty'})
            }
            if(!oldPassword) {
                return res.status(400).json({message : 'oldPassword is empty'})
            }
            if(newPassword == oldPassword) {
                return res.status(401).json({message : 'Passwords must be different'})
            }
            await userService.changePassword(userId, newPassword,oldPassword)
            return res.status(200).json({message : 'Password was changed'})
        } catch (error) {
            console.log(error)
            return res.status(400).json({message : error})
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers()
            res.send(users)
        } catch (error) {
            console.log(error)
            return res.status(400).json({message : error})
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params.userId;
            if(userId == req.user.id) {
                await userService.deleteUser(userId);
                return res.status(200).json({message : 'User was deleted'})
            }else {
                return res.status(401).json({message : 'U can delete only your account'})
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({message : error})
        }
    }

    async addUser(req, res) {
        try {
            const {username, password} = req.body;
            const user = await userService.addUser(username, password);
            if(user) {
                return res.status(200).json({message : 'User was add'})
            }
        } catch (error) {
            console.log(error)
            return res.status(400).json({message : error})
        }

    }
}

module.exports = new UserController()