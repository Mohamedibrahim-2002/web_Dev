console.log("hello");

var userName = document.getElementById("userName");
var email = document.getElementById("email");
var btn = document.getElementById("btn");
var form = document.querySelector("form");

console.log(userName, email, btn, form);

btn.addEventListener("click", (events) => {
  events.preventDefault();
});
