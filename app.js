const mySql = require('mysql');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
var path = require('path');

var fs  = require('fs');
var bodyParser = require('body-parser');

const UserController = require('./controller/userController');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));



app.post('/login', (req, res) => {
  
  const { username, password } = req.body;
  UserController.login(req, res);

});


app.post('/signup', (req, res) =>{

  UserController.signup(req,res);

});

app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, 'views', 'signin.html'));
  
});
app.get('/signup',(req, res)=>{

  res.sendFile(path.join(__dirname, 'views', 'signup.html'));

});

app.get('/signin', (req, res) => {

  res.sendFile(path.join(__dirname, 'views', 'signin.html'));
    
});

app.get('/activateAccount/:token', (req,res) =>{

  UserController.activateAccount(req, res);
 
  res.sendFile(path.join(__dirname, 'views', 'ActivateAccount.html'));////Change Page To Static One Denoting Account Activation
  

});

app.listen(8080, () => {
  console.log(`Server is running at http://localhost:8080`);
});



