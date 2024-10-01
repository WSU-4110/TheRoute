function loginValidation() {
    var userName = document.registration.username;
    var passWord = document.registration.passid;
    var userEmail = document.registration.email;

    // Check if all validations pass
    if (!validUserName(userName)) {
        alert("Username must contain only letters.");
        userName.focus();
        return false;
    }

    if (!passWordValidation(passWord, 8, 12)) {
        alert("Password must be between 7 to 12 characters.");
        passWord.focus();
        return false;
    }

    if (!ValidateEmail(userEmail)) {
        alert("Please enter a valid email address.");
        userEmail.focus();
        return false;
    }

    // If all validations pass, you can proceed with form submission or redirection
    // For example:
    // document.registration.submit();
    window.location = "login.html"; // Redirect to login page or handle form submission

    return true; // Return true if all validations are successful
}
function validUserName(userName) { 
    var validInput = /^[A-Za-z0-9]+$/;
    if(userName.value.match(validInput)) {
        return true;
    }
    else {
        alert('Username must have alphabet characters or numbers.');
        userName.focus();
        return false;
    }
}

function passWordValidation(passWord,mx,my) {
    var passWord_len = passWord.value.length;
    if (passWord_len == 0 ||passWord_len >= my || passWord_len < mx) {
        alert("Password should not be empty / length be between "+mx+" to "+my);
        passid.focus();
        return false;
    }
    return true;
}

function ValidateEmail(userEmail) {
    var validInput = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(userEmail.value.match(validInput)) {
        return true;
    }
    else {
        alert("The email you have inputted is invalid!");
        userEmail.focus();
        return false;
    }
}