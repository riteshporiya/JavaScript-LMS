"use strict";
const admin = 0;
const student = 1;
function checkLogin() {
  let loginUser = JSON.parse(sessionStorage.getItem("loginUser"));
  if (loginUser) {
    if (loginUser.type != admin) {
      //redirect to login page
      location.href = "../index.html";
    } else {
      document.getElementById("loginUserName").innerText =
        "Welcome, " + loginUser.userName;
      getStudents();
      displayCourses();
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
let assignCourses = JSON.parse(localStorage.getItem("assignCourses"));
let users = JSON.parse(localStorage.getItem("users"));
function getStudents() {
  let assignCourses = JSON.parse(localStorage.getItem("assignCourses"));
  document.getElementById("students").innerHTML = "";
  if (users != null) {
    let students = users.filter((ele) => ele.type == student ?? ele);
    let courses = JSON.parse(localStorage.getItem("courses"));
    students.forEach((student) => {
      document.getElementById("students").innerHTML += `
            <div id="accordion${student.id}">
                <div class="card">
                    <div class="card-header text-start" data-bs-toggle="collapse" href="#collapse${student.id}">
                            ${student.userName}
                    </div>
                    <div id="collapse${student.id}" class="collapse" data-bs-parent="#accordion${student.id}">
                        <div class="card-body">
                            <table class="table table-bordered w-50" id="table-${student.id}">
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>`;
                                //check student that has been added on assignCourse Array
                                let hasAssignStudent;
                                console.log(hasAssignStudent, ' ',assignCourses);
                                if (assignCourses) {
                                  console.log('dd');
                                  if (!hasAssignStudent) {
                                    console.log('in;;');
                                    hasAssignStudent = assignCourses.find(
                                      (ele) => ele.student.id == student.id
                                    );
                                  }
                                }

                                let hasAssignCourse;
                                if (courses != null) {
                                  courses.forEach((course) => {
                                    //check if student has assign courses or not
                                    if (hasAssignStudent) {
                                      hasAssignCourse = hasAssignStudent.courses.some(
                                        (ele) => ele.id == course.id
                                      );
                                    }
                                    document.getElementById(`table-${student.id}`).innerHTML += `
                                      <tbody>
                                          <tr>
                                              <td class="w-80">${course.courseName}</td>
                                              <td>
                                                  <button type="button" onclick="addCourse('${student.id}', '${course.id}'); "class="btn btn-primary btn-sm btn-block ${hasAssignCourse ? "d-none" : ""}">Add</button>
                                                  <button type="button" onclick="removeCourse('${student.id}', '${course.id}');" class="btn btn-danger btn-sm btn-block ${!hasAssignCourse ? "d-none" : ""}">Remove</button>
                                              </td>
                                          </tr>
                                      </tbody>
                                    `;
                                  });
                                }
                          `</table
                        </div>
                    </div>
                </div>
          </div>
        `;
    });
  }
}

function displayCourses() {
  let courses = JSON.parse(localStorage.getItem("courses"));
  let displayCoursesId = document.getElementById("displayCourses");
  displayCoursesId.innerHTML = "";
  if (courses) {
    courses.forEach((course) => {
      displayCoursesId.innerHTML+= `
          <div class="col-4">
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
  }
}

function addCourse(studentId, courseId) {
  let assignCourses = JSON.parse(localStorage.getItem("assignCourses"));
  if (users != null) {
    let students = users.filter((ele) => ele.type == student ?? ele);
    let courses = JSON.parse(localStorage.getItem("courses"));
    if (assignCourses == null) {
      let assignCourses = [];
      let coursesArray = [];
      coursesArray.push(
        courses.find((course) => course.id == courseId ?? course)
      );
      assignCourses.push({
        student: students.find((student) => student.id == studentId ?? student),
        courses: coursesArray,
      });
      localStorage.setItem("assignCourses", JSON.stringify(assignCourses));
    } else if (assignCourses != null) {
      console.log(assignCourses, ' ll');
      if (assignCourses != null) {
        assignCourses.forEach((assignCourse) => {
          if (assignCourse.student.id == studentId) {
            //existing student then only course added
            assignCourse.courses.push(
              courses.find((course) => course.id == courseId ?? course)
            );
            localStorage.setItem("assignCourses", JSON.stringify(assignCourses));
          }
        });
      }
      if (!assignCourses.find((ele) => ele.student.id == studentId ?? ele)) {
        //new student added
        let coursesArray = [];
        coursesArray.push(
          courses.find((course) => course.id == courseId ?? course)
        );
        assignCourses.push({
          student: students.find(
            (student) => student.id == studentId ?? student
          ),
          courses: coursesArray,
        });
      }
      localStorage.setItem("assignCourses", JSON.stringify(assignCourses));
    }
  }
  getStudents();
}

function removeCourse(studentId, courseId) {
  let assignCourses = JSON.parse(localStorage.getItem("assignCourses"));
  let findStudentCourses = assignCourses.find(
    (ele) => ele.student.id == studentId
  ).courses;
  findStudentCourses.splice(
    findStudentCourses.findIndex((c) => c.id == courseId),
    1
  );
  localStorage.setItem("assignCourses", JSON.stringify(assignCourses));
  getStudents();
}

document.getElementById("btnCourse").addEventListener("click", (event) => {
  let courseName = document.forms.course.courseName.value;
  let courseType = document.forms.course.courseType.value;
  let courseDescription = document.forms.course.courseDescription.value;
  let courseImage = document.forms.course.courseImage.value;
  if (!document.forms.course.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
    document.forms.course.classList.add("was-validated");
  } else {
    if (localStorage.getItem("courses") == null) {
      let courses = [];
      courses.push({
        id: 1,
        courseName: courseName,
        courseType: courseType,
        courseImage: courseImage,
        courseDescription: courseDescription,
      });
      localStorage.setItem("courses", JSON.stringify(courses));
      document.getElementById("courseAlert").classList.remove("d-none");
    } else {
      // check if course exit or not
      if (
        !JSON.parse(localStorage.getItem("courses")).find(
          (course) =>
            course.courseName.toLowerCase() == courseName.toLowerCase() && course.courseType.toLowerCase() == courseType.toLowerCase()
        )
      ) {
        let courses = JSON.parse(localStorage.getItem("courses"));
        courses.push({
          id: courses.length + 1,
          courseName: courseName,
          courseType: courseType,
          courseImage: courseImage,
          courseDescription: courseDescription,
        });
        localStorage.setItem("courses", JSON.stringify(courses));
        document.getElementById("courseAlert").classList.remove("d-none");
      } else {
        document.getElementById("courseExitAlert").classList.remove("d-none");
      }
    }

    document.forms.course.reset();
    getStudents();
    displayCourses();

    setTimeout(() => {
      document.getElementById("courseAlert").classList.add("d-none");
      document.getElementById("courseExitAlert").classList.add("d-none");
    }, 2000);
  }
});
