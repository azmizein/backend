const db = require("../models");
const user = db.User;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const transporter = require("../helpers/transporter");
const fs = require("fs");
const handlebars = require("handlebars");


module.exports = {
  register: async (req, res) => {
    try {
      const { nim, username, email, password } = req.body;

      if (password.length < 8) throw "password min 8 character"

      const salt = await bcrypt.genSalt(10);

      const hashPass = await bcrypt.hash(password, salt);
      //   console.log(hashPass);

      await user.create({
        nim,
        username,
        email,
        password: hashPass,
      });

      const token = jwt.sign({ id: user.id }, "azmi", { expiresIn: "1h" });

      const tempEmail = fs.readFileSync("./template/email.html", "utf-8");
      const tempCompile = handlebars.compile(tempEmail);
      const tempResult = tempCompile({
        username,
        link: `http://localhost:3000/verification/${token}`,
      });

      await transporter.sendMail({
        from: "Admin",
        to: email,
        subject: "Verification User",
        html: tempResult,
      });

      res.status(200).send("Register Success");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  login: async (req, res) => {
    try {
      const { nim, password } = req.body;

      const nimExist = await user.findOne({
        where: {
          nim,
        },
        raw: true,
      });
      if (nimExist === null) throw "nim not found";

      const isValid = await bcrypt.compare(password, nimExist.password);

      if (!isValid) throw "nim or password incorrect";

      const token = jwt.sign(
        { username: nimExist.username, id: nimExist.id },
        "azmi"
      );

      res.status(200).send({
        user: {
          username: nimExist.username,
          id: nimExist.id,
        },
        token,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  keepLogin: async (req, res) => {
    try {
      const verify = jwt.verify(req.token, "azmi");
      console.log(verify);
      const result = await user.findAll({
        where: {
          id: verify.id,
        },
      });

      res.status(200).send({
        id: result[0].id,
        username: result[0].username,
      });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  verification: async (req, res) => {
    try {
      const verify = jwt.verify(req.token, "azmi");
      console.log(verify);

      await user.update(
        {
          isVerified: true,
        },
        {
          where: {
            id: verify.id,
          },
        }
      );
      res.status(200).send("Success Verification");
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
};
