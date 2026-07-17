const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "users.json");

if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", chunk => {
      body += chunk;
      if (body.length > 10000) request.destroy();
    });
    request.on("end", () => {
      try { resolve(JSON.parse(body)); } catch { reject(new Error("Invalid JSON")); }
    });
    request.on("error", reject);
  });
}

function isStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function passwordMatches(password, storedPassword) {
  const [salt, storedHash] = (storedPassword || "").split(":");
  if (!salt || !storedHash) return false;
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
}

function serveFile(request, response) {
  const requestedPath = request.url === "/" ? "/signUpForm.html" : request.url;
  const filePath = path.join(__dirname, decodeURIComponent(requestedPath.split("?")[0]));
  if (!filePath.startsWith(__dirname) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404); response.end("Not found"); return;
  }
  const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
  response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "POST" && request.url === "/api/users") {
      const data = await readBody(request);
      const email = String(data.email || "").trim().toLowerCase();
      const password = String(data.password || "");
      if (!data.name || !email || !isStrongPassword(password)) {
        sendJson(response, 400, { message: "Name, email, and a strong password are required (8+ characters with uppercase, lowercase, number, and special character)." });
        return;
      }

      const users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      if (users.some(user => user.email === email)) {
        sendJson(response, 409, { message: "An account with this email already exists." });
        return;
      }

      users.push({
        name: String(data.name).trim(),
        email,
        age: Number(data.age),
        gender: data.gender || "Not specified",
        passwordHash: hashPassword(password),
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
      sendJson(response, 201, { message: "Account created successfully." });
      return;
    }

    if (request.method === "POST" && request.url === "/api/login") {
      const data = await readBody(request);
      const email = String(data.email || "").trim().toLowerCase();
      const password = String(data.password || "");
      const users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      const user = users.find(item => item.email === email);

      if (!user || !passwordMatches(password, user.passwordHash)) {
        sendJson(response, 401, { message: "Incorrect email or password." });
        return;
      }

      sendJson(response, 200, { message: "Login successful.", user: { name: user.name, email: user.email } });
      return;
    }

    if (request.method === "GET") { serveFile(request, response); return; }
    response.writeHead(405); response.end("Method not allowed");
  } catch {
    sendJson(response, 400, { message: "Unable to process this request." });
  }
});

server.listen(PORT, () => console.log(`Signup app running at http://localhost:${PORT}`));




