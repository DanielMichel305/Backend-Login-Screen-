

document.getElementById('signUpBtn').onclick=function(event) {

    event.preventDefault();

    var username = document.getElementById('userinput').value;
    var email = document.getElementById('emailInput').value;
    var password = document.getElementById("passinput").value;

    if (username.trim() === '' || password.trim() === '' || email.trim() === '' ) {      
        window.alert('Username, Email and/or password cannot be Less than 5 or more 20 characters.');
 
        event.preventDefault();
        return;
    }
    else if(password !== document.getElementById('confirmPassInput').value){
        window.alert('Passwords not matching!');
 
        event.preventDefault();
        return;
    }

    fetch('/signup', {  
        method: 'POST',
        body: JSON.stringify({ username, email, password}),
       headers: {
           'Content-Type' : 'application/json'
       }
       
    })
    .then(response=>response.json())
    .then(data => {
        if(data.success === true){
           window.alert("Account Created!");
           //Redirect
           window.location.href = '/activateAccount';
           
        }
        else{
           window.alert("Wrong credentials, Try again:(");
        }
    })
    .catch(error => {
        console.log('Error:', error);
    });


   
};