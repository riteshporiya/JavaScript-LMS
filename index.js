'use strict';
document.getElementById('btnRegister').addEventListener('click', (event) => {
    let userName = document.forms.register.userName.value;
    let password = document.forms.register.password.value;
    let cPassword = document.forms.register.cPassword.value;
    let type = document.forms.register.registerRadioOptions.value;
    onCustomErrorCheck();
    if(!document.forms.register.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        document.forms.register.classList.add('was-validated')
    } else {
        if(localStorage.getItem("users") == null) {
            let users = []
            users.push({id:1, userName:userName, password:password, type:type});
            localStorage.setItem('users', JSON.stringify(users));
            document.getElementById("registerAlert").classList.remove('d-none');
        }
        else {
            // check if register user exit or not by same name or type
            if (!JSON.parse(localStorage.getItem("users")).find((user) => ((user.userName == userName) && (user.type == type)))) {
                let users = JSON.parse(localStorage.getItem("users"));
                users.push({id:users.length+1, userName:userName, password:password, type:type});
                localStorage.setItem('users', JSON.stringify(users));
                document.getElementById("registerAlert").classList.remove('d-none');
            } else{
                document.getElementById("registerExitAlert").classList.remove("d-none");
            }
        }

        setTimeout(() => {
            document.getElementById("registerAlert").classList.add("d-none");
            document.getElementById("registerExitAlert").classList.add("d-none");
        }, 2000);
        document.forms.register.reset();
    }
});

document.getElementById('btnLogin').addEventListener('click', (e) => {
    let userName = document.forms.login.loginUserName.value;
    let password = document.forms.login.loginPassword.value;
    let type = document.forms.login.loginRadioOptions.value;
    let loginAlert = document.getElementById("loginAlert").classList;
    const admin = 0;
    const student = 1;
    let users = JSON.parse(localStorage.getItem('users'));

    if(!document.forms.login.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        document.forms.login.classList.add('was-validated')
    } else {
        if (users!= null) {
            let loginUser = users.find((ele) => ((ele.userName == userName) && (ele.password == password) && (ele.type  == type)) ?? ele);
            console.log(!loginUser);
           if (loginUser) {
                if (loginUser.type == admin) {
                    sessionStorage.setItem('loginUser', JSON.stringify(loginUser));
                    location.href = 'admin/index.html';
                }
                if (loginUser.type == student) {
                    sessionStorage.setItem('loginUser', JSON.stringify(loginUser));
                    location.href = 'student/index.html';
                }
           } else {
            loginAlert.remove("d-none");
           }
        } else {
            loginAlert.remove("d-none");
        }
    }
    setTimeout(() => {
        loginAlert.add("d-none");
    }, 2000);
});

function onCustomErrorCheck() {
    let userName = document.forms.register.userName.value;
    let password = document.forms.register.password.value;
    let cPassword = document.forms.register.cPassword.value;
    if (isNaN(userName)) {
        document.forms.register.userName.setCustomValidity('');
    }else {
        document.getElementById('userNameErrorMessage').innerText = 'User Name Must be a string only.';
        document.forms.register.userName.setCustomValidity('User Name Must be a string only.');
    }

    if (cPassword == password) {
        document.forms.register.cPassword.setCustomValidity('');
      } else {
        document.getElementById('cPasswordErrorMessage').innerText = 'Passwords Do Not Match';
        document.forms.register.cPassword.setCustomValidity('Passwords do not match');
    }
}