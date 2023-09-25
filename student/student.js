"use strict";
const admin = 0;
const student = 1;
let loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
let assignCourse = JSON.parse(localStorage.getItem("assignCourses"));
function checkLogin() {
  if (loginUser) {
    if (loginUser.type != student) {
      //redirect to login page
      location.href = "../index.html";
    } else {
      document.getElementById("loginUserName").innerText =
        "Welcome, " + loginUser.userName;
      getCourses();
    }
  } else {
    //redirect to login page
    location.href = "../index.html";
  }
}

function logout() {
  sessionStorage.removeItem("loginUser");
  location.reload();
}

function getCourses() {
  let studentCourses = assignCourse.find(
    (ele) => ele.student.id == loginUser.id ?? ele
  );
  document.getElementById("viewCourses").innerHTML = "";
  if (studentCourses) {
    document.getElementById("viewCourses").innerHTML += `
        <div class="container">
            <div class="row" id="row">`
                studentCourses.courses.forEach((course) => {
                    document.getElementById("row").innerHTML +=
                        `<div class="col-4">
                            <div class="card">
                                <img src="${course.courseImage}" class="card-img-top"
                                alt="image" /><hr>
                                <div class="card-body">
                                <h5 class="card-title">${course.courseName}</h5>
                                <span>(${course.courseType})</span>
                                <p class="card-text">${course.courseDescription}</p>
                            </div>
                        </div>
                    </div>`;
                });
            ` </div>
        </div>`;
  }
}
