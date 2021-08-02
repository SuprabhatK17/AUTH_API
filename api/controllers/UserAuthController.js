/**
 * UserAuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

//const UserAuth = require("../models/UserAuth");


const bcrypt = require('bcryptjs')




module.exports = {


    // function for create user 

    async signUpUser(req, res) {

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password,salt);

        const UserExist = await UserAuth.findOne({
            userName:req.body.userName
        })
        if(UserExist)return res.send('user name already exist');

        try {

            const signUpUserr = await UserAuth.create({

                userName: req.body.userName,
                password: hashPass

            })
            res.ok(signUpUserr)
        } catch (err) {
            res.status(400).send(err);

        }
    },

    // find All function
    async findUser(req, res) {

        try {
            const users = await UserAuth.find();
            return res.ok(users)
        } catch (err) {

            return res.sererError(err);

        }

    },

    // find by id function
    async findUserById(req, res) {

        try {

            const user = await UserAuth.findOne({
                id: req.params.id
            });

            if(!user){
                return res.send('not found')
            }else{
                return res.ok(user);

            }

        } catch (err) {
            return res.serverError(err);
        }

    },

    // update broker data
    async updateUser(req, res) {

        try {

            let params = req.allParams();
            let attributes = {};

            if (params.userName) {
                attributes.userName = params.userName;
            }
            if (params.password) {
                attributes.password = params.password;
            }
            

            // using inbuilt update method
            const result = await UserAuth.update({
                id: req.params.id
            }, attributes);

            if(!result){
                return res.send('not found')
            }else{
                return res.ok(result);
            }
            

        } catch (err) {
            return res.serverError(err);
        }

    },

    // delete function
    async deleteUser(req, res) {

        try {
            const result = await UserAuth.destroy({
                id: req.params.id
            });
            if(!result){
                return res.send('not found');
            }else{
                return res.ok(result);
            }
            

        } catch (err) {
            return res.notFound(err);
        }

    },





    // login

    async logInUser(req,res){
        const UserExist = await UserAuth.findOne({
            userName:req.body.userName,
            //password:req.body.password
        })
        if(!UserExist) return res.send('email or password is invalid');

        const validPass = await bcrypt.compare(req.body.password,UserExist.password);
        if(!validPass)return res.send('email / password invalid');

        res.send('logged in!');

    }


};

