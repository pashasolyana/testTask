const User = require('../Models/userModel')
const Role = require('../Models/roleModel')
const bcrypt = require('bcrypt');
const UserDto = require('../dtos/userDtos');
const tokenService = require('./tokenService');

class UserService {

    async registration(username, password) {
        try {
            const candidate = await User.findOne({username});
            if(candidate){
                throw Error(`Username : ${username} already exist`)
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const userRole = await Role.findOne({value : "USER"})
            const user = await User.create({
                username,
                password : hashPassword,
                roles : [userRole.value]
            });
            await user.save()
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({...userDto})
            return {...tokens, user : userDto}        
        } catch (error) {
            throw Error(error)
        }
    }

    async login(username, password) {
        try {
            const user = await User.findOne({username});
            if(!user){
                throw Error(`Username : ${username} not exist`)
            }
            const isValidPass = await bcrypt.compare(password, user.password);
            if(!isValidPass) {
                throw Error(`Passwords do not match`)
            }
            const userDto = new UserDto(user) // выкидываем все не нужное
            const tokens = tokenService.generateTokens({...userDto}) // разворачиваем объект userDto(...userDto)
            return {...tokens, user : userDto}
        } catch (error) {
            throw Error(error)
        }
    }

    async changePassword(userId, newPassword, oldPassword) {
        try {
            const user = await User.findById({_id : userId});
            if(!user){
                throw Error(`Username : ${username} not exist`)
            }
            const isValidPass = await bcrypt.compare(oldPassword, user.password);
            if(!isValidPass) {
                throw Error(`Old passwords do not match`)
            }
            const hashNewPassword = await bcrypt.hash(newPassword, 5);
            user.password = hashNewPassword
            await user.save()
        } catch (error) {
            throw Error(error)
        }
    }

    async getAllUsers(){
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            throw Error(error)
        }
    }

    async deleteUser(id) {
        try {
            return await User.deleteOne({_id : id})
        } catch (error) {
            throw Error(error)
        }
    }
    
    async addUser(username, password) {
        try {
            const candidate = await User.findOne({username});
            if(candidate){
                throw Error(`Username : ${username} already exist`)
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const userRole = await Role.findOne({value : "USER"})
            const user = await User.create({
                    username,
                    password : hashPassword,
                    roles : [userRole.value]
                });
            await user.save()
            return user;
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new UserService()