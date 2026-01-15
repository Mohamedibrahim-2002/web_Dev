//   console.log("hello Ibu");

var aidropBtn = document.getElementById("airdropBtn");
// console.log(aidropBtn.innerText);

var form1 = document.forms[0];
// console.log(form1.innerHTML);

var successMsg = document.querySelector("div.successMsg");
// console.log(successMsg.innerHTML);

var finalBtn = document.getElementById("finalBtn");
// console.log(finalBtn);

aidropBtn.addEventListener("click", function () {
  if (form1.style.display === "block") {
    form1.style.display = "none";
    aidropBtn.style.display = "block";
  } else {
    form1.style.display = "block";
    aidropBtn.style.display = "none";
  }
});

form1.addEventListener("submit", (event) => {
  event.preventDefault();

  if (successMsg.style.display === "block") {
    successMsg.style.display = "none";
  } else {
    successMsg.style.display = "block";
    form1.style.display = "none";
    aidropBtn.style.display = "none";
  }
});
