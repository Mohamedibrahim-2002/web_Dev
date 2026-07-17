const form = document.querySelector("#signup-form");
const message = document.querySelector("#form-message");
const submitButton = form.querySelector("button[type='submit']");
const passwordInput = document.querySelector("#password");
const passwordRules = document.querySelectorAll(".password-checklist li");

passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
  passwordRules.forEach(rule => rule.classList.toggle("met", checks[rule.dataset.rule]));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.age = Number(data.age);

  submitButton.disabled = true;
  submitButton.textContent = "Saving...";

  try {
    const response = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    message.textContent = result.message;
    message.classList.add("success");
    submitButton.textContent = "Account created ✓";
    form.reset();
    setTimeout(() => { submitButton.disabled = false; submitButton.innerHTML = 'Create account <span aria-hidden="true">→</span>'; }, 2200);
  } catch (error) {
    message.textContent = error.message || "Could not save your account. Is the server running?";
    message.classList.remove("success");
    submitButton.disabled = false;
    submitButton.innerHTML = 'Create account <span aria-hidden="true">→</span>';
  }
});

