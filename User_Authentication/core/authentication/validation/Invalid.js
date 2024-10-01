function valid(){
    var userName = document.getElementById("username").value;
    var passWord = document.getElementById("password").value;
    if ( userName == "roy" && passWord == "password#123"){
        alert ("Login successfully");
        window.location = "home.html";
        return false;
    }
    else{
        window.location = "login.html";
        return false;
    }
 }
