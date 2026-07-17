const form = document.querySelector("#signup-form");
const message = document.querySelector("#form-message");
const submitButton = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const user = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim().toLowerCase(),
    age: Number(formData.get("age")),
    gender: formData.get("gender") || "Not specified"
  };

  submitButton.disabled = true;
  submitButton.textContent = "Saving...";

  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    if (!response.ok) throw new Error("Could not save user");

    message.textContent = "Account created and saved successfully.";
    message.classList.add("success");
    submitButton.textContent = "Account created ✓";
    form.reset();

    setTimeout(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Create account <span aria-hidden="true">→</span>';
    }, 2200);
  } catch (error) {
    message.textContent = "Could not save your account. Is the server running?";
    message.classList.remove("success");
    submitButton.disabled = false;
    submitButton.innerHTML = 'Create account <span aria-hidden="true">→</span>';
  }
});
