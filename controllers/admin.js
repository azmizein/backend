const db = require("../models");
const admin = db.Admin;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");



module.exports = {
    // registerAdmin: async (req, res) => {
    //     try {
    //       const { username, email, password } = req.body;
    //     //   console.log(req.body)
    
    //       if (password.length < 8) throw "password min 8 character"
    
    //       const salt = await bcrypt.genSalt(10);
    
    //       const hashPass = await bcrypt.hash(password, salt);
    //     //   console.log(hashPass);
    
    //       await admin.create({
    //         username,
    //         email,
    //         password: hashPass,
    //       });
    
    //     //   const token = jwt.sign({ email: email , username:username}, "azmi");
    
    //       res.status(200).send("Register Success, Please check your email");
    //     } catch (err) {
    //       console.log(err);
    //       res.status(400).send(err);
    //     }
    //   },
    
    loginAdmin: async (req,res) => {
        try {
            const {data, password} = req.body;

            const adminExist = await admin.findOne({
                where: {
                    // email,
                    [Op.or]: {
                      email: data ? data : "",
                      username: data ? data : "",                 
                    },
                  },
                  raw:true
            });
            console.log(adminExist)
            if (adminExist === null) throw "admin not found"

            const isValid = await bcrypt.compare(password, adminExist.password);

            if (!isValid) throw "Input Data is Wrong"

            const token = jwt.sign({
                username: adminExist.username, email: adminExist.email
            }, "azmi")

            res.status(200).send({
                admin: {
                    username: adminExist.username,
                    email: adminExist.email
                },
                token
            })
        }catch(err){
            res.status(400).send(err)
            console.log(err)
        }
    },

    keepLoginAdmin: async (req, res) => {
        try{
            const verify = jwt.verify(req.token, "azmi");
            const result = await admin.findAll({
                where: {
                    [Op.or]: {
                        email: verify.email,
                        username: verify.username,                 
                    },
                },
            });
            res.status(200).send({
                email:result[0].email,
                username: result[0].username
            })
        }catch (err){
            res.status(400).send(err);
        }

    }
}