const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const DATA_FILE = path.join(__dirname, "users.json");

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

function serveFile(request, response) {
  const requestedPath = request.url === "/" ? "/signUpForm.html" : request.url;
  const filePath = path.join(__dirname, decodeURIComponent(requestedPath.split("?")[0]));

  if (!filePath.startsWith(__dirname) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
  response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  if (request.method === "POST" && request.url === "/api/users") {
    let body = "";

    request.on("data", chunk => {
      body += chunk;
      if (body.length > 10000) request.destroy();
    });

    request.on("end", () => {
      try {
        const user = JSON.parse(body);
        const users = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        users.push({ ...user, id: Date.now().toString(), createdAt: new Date().toISOString() });
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
        sendJson(response, 201, { message: "User saved successfully." });
      } catch {
        sendJson(response, 400, { message: "Invalid user data." });
      }
    });
    return;
  }

  if (request.method === "GET" && request.url === "/api/users") {
    sendJson(response, 200, JSON.parse(fs.readFileSync(DATA_FILE, "utf8")));
    return;
  }

  if (request.method === "GET") {
    serveFile(request, response);
    return;
  }

  response.writeHead(405);
  response.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Signup app running at http://localhost:${PORT}`);
});
