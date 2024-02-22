document.addEventListener('DOMContentLoaded', function() {
    

document.getElementById('CreateAccBtn').onclick=function(){

window.location.href = '/signup';

};



document.getElementById('signinBtn').onclick=function(event) {

    event.preventDefault();
     var username = document.getElementById('userinput').value;
     var password = document.getElementById("passinput").value;
     
     if (username.trim() === '' || password.trim() === '') {
      
        window.alert('Username and password cannot be empty.');
      
        event.preventDefault();
        return;
    }


     fetch('/login', {  
         method: 'POST',
         body: JSON.stringify({ username, password }),
        headers: {
            'Content-Type' : 'application/json'
        }
     })
     .then(response=>response.json())
     .then(data => {
         if(data.loginStatus === true){
            window.alert("Login Success!");
            //Redirect
         }
         else{
            window.alert("Wrong credentials, Try again:(");
         }
     })
     .catch(error => {
         console.error('Error:', error);
     });


    
};

});







