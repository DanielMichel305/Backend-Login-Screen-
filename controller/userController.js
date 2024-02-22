const UserModel = require('../models/usermodel');
var path = require('path');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


require('dotenv').config();

const app = express();

app.use(cors());

const NodeEmail = process.env.email;
const NodePass = process.env.AppPassword;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: NodeEmail,
    pass: NodePass  
  }
});


// UserController
class UserController  {
  getAllUsers(req, res)  {
    UserModel.getAllUsers((err, users) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(users);
    });
  }

  getUserById(req, res)  {
    const userId = req.params.id;
    UserModel.getUserById(userId, (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    });
  }

  static login(req, res){
    const username = req.body.username;
    const password = req.body.password;
    const data = {
      loginStatus: false,
      message: ""
    };

    UserModel.getUserById(username, (user)=>{

      if(!user){       
        console.log("Username Not Found!");
        res.status(409).send("User doesn't exist!");

      }
      else{
        UserModel.comparePasswords(password, user.password, (result)=>{
          if(result){
            console.log("LoginSuccess!");
            data.loginStatus = true;
            data.message = "Login Success!";
          }
          else{
           
            data.loginStatus = false;
            data.message = "Incorrect username or password!";

          }
          res.send(data);

        });

      }

    });


  }

  static async signup(req, res){
    const{username, password, email} = req.body;
    const activationToken = crypto.randomBytes(10).toString('hex');
    const data = {
      success: false,
      message: ""
    };
    console.log(process.env.email);
    UserModel.checkIfUserExists(username, email, function(exists){
      if(exists){
        
        data.message = "Username or Email already associated with another account";
        data.success = false;
        return;
      }
      else{
        UserModel.addUser({username, password, email});
        UserModel.addToken(username, activationToken, (err) =>{ 
          if(err){
            console.log(err);
            data.message = "Failed To Generate Activation Token";
            data.success = false;
          } 
        });
        data.message = "Account Created Succesfully";
        data.success = true;
        
        const mailOptions = {
          from: process.env.email,
          to: email,
          subject: 'Account Verification',
          text: `Click the following link to verify your account: http://localhost:8080/activateAccount/${activationToken}`
        };

        try {
          transporter.sendMail(mailOptions);
          console.error('Verification email sent');
          //res.send('Verification email sent');
        } catch (error) {
          console.error('Error sending verification email:', error);
          ////Send ERROr
        }

      }
      console.log("/${activationToken}");
      res.send(data);
  
    });
   
  }

  static async activateAccount(req, res){
    const token = req.params.token;

    UserModel.getUserByToken(token, function(err, username){
      if(err) console.log(err);

      if(!username){
        res.send("User Not Found"); ////Redo This to improve error handling
        return;
      }
      else{
        UserModel.activateAccount(username);////Add Error Handling 
        UserModel.deleteToken(token);

      }


    });


  }

  

}



module.exports = UserController;    







