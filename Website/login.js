const form = document.querySelector("#login-form");
const message = document.querySelector("#form-message");
const submitButton = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  submitButton.disabled = true;
  submitButton.textContent = "Checking...";

  try {
    const response = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    message.textContent = `Welcome back, ${result.user.name}!`;
    message.classList.add("success");
    submitButton.textContent = "Logged in ✓";
    form.reset();
  } catch (error) {
    message.textContent = error.message || "Could not log in. Is the server running?";
    message.classList.remove("success");
    submitButton.disabled = false;
    submitButton.innerHTML = 'Log in <span aria-hidden="true">→</span>';
  }
});
