const mySql = require('mysql');
const bcrypt = require('bcrypt');

var con = mySql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "daniool",
    database: "nodedb"
  });

  con.connect(function(err){

    if(err) {
        console.log(err);
        return;
    }

});

class UserModel  {

    static getAllUsers(callback)  {
    con.query("SELECT * FROM users", function(err, result, fields){
        if(err) console.log(err);
        console.log(result);

  });
}

    static  getUserById(username, callback)  {
    const query = 'SELECT * FROM users WHERE username = ?';
    con.query(query, [username],  function(err, result){
    if(err) console.log(err);
    callback(result[0]);
    });
   
}

    static checkIfUserExists(username, email, callback){
          
        con.query('SELECT * FROM users WHERE username = ? AND email = ?', [username, email], function(err, result){
            if(err) console.log(err);               
            if(result.length>0){
                callback(true);                   
            }
            else callback(false);
               
                
        });           
            
    }

    static getUserByToken(token, callback){
        con.query('Select * FROM user_activation where token = ?', token, function(err, result){
            if(err){ 
                console.log(err);
                return;
            }
            if(result.length === 0){
                
                callback(null, null);
            }
            else {
                callback(null, result[0].username);
            }

        });
        
    }

    static addUser(userdata, callback){
        userdata.password = bcrypt.hashSync(userdata.password, 10);                   
        con.query('Insert into users values (?,?,?,0) ', [userdata.username,userdata.password, userdata.email], function(err,result){
            if(err) console.log(err);
                
        });      

    }

    static activateAccount(username, callback){
        con.query('UPDATE users SET account_activated = true WHERE username = ?' , username, callback);
    }

    static addToken(username, token, callback) {
          con.query('INSERT INTO user_activation VALUES (?, ?)',
          [username, token], callback);
      }
      
    static deleteToken(token, callback){
        con.query('Delete from user_activation Where token = ?' , token, callback)
    }  


    static comparePasswords(plainPassword, hashedPassword, callback) {
    bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
      if (err) throw err;
      callback(result);
    });
}


}

   



module.exports = UserModel;