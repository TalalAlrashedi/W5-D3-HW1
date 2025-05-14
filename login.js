const apiUrl = "https://68225dacb342dce8004e0d7c.mockapi.io";
let username = document.getElementById("username-input");
let password = document.getElementById("password-input");
let submitButton = document.getElementById("submit");

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  login();
});

async function login() {
  console.log(username, password);
  try {
    const res = await fetch(`${apiUrl}/login`);
    const users = await res.json();
    const userExist = users.find(
      (u) => u.username === username.value && u.password === password.value
    );
    console.log(userExist);
    if (userExist) {
      localStorage.setItem("currentUser", JSON.stringify(userExist));
      appendAlert("تم تسجيل الدخول مرحبا بك مجددا", "success");
      setTimeout(() => {
        
        window.location.href = "/index.html";
      }, 2000);
    } else {
      appendAlert("اسم المستخدم او كلمة المرور غير صحيح", "danger");
      return;
    }
  } catch (err) {
    console.log("error login", err);
  }
}
