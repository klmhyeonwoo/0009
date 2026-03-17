import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3001;
const JWT_SECRET = "task-secret";

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Mock user
const MOCK_USER = {
  email: "test@test.com",
  password: "testtest",
  name: "김현우",
  memo: "안녕하세요. 저는 김현우입니다.",
};

// Generate 50 mock tasks
const tasks = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  title: `Task ${i + 1}`,
  memo: `This is the memo for task ${i + 1}. It contains some details about what needs to be done.`,
  status: i % 3 === 0 ? "DONE" : "TODO",
  registerDatetime: new Date(
    Date.now() - (50 - i) * 24 * 60 * 60 * 1000,
  ).toISOString(),
}));

// JWT helpers
function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Bearer auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errorMessage: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ errorMessage: "Invalid or expired token" });
  }
}

// Validation helpers
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return (
    typeof password === "string" &&
    password.length >= 8 &&
    password.length <= 24 &&
    /^[A-Za-z0-9]+$/.test(password)
  );
}

// POST /api/sign-in
app.post("/api/sign-in", (req, res) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res
      .status(400)
      .json({ errorMessage: "올바른 이메일 형식을 입력해주세요." });
  }
  if (!password || !isValidPassword(password)) {
    return res.status(400).json({
      errorMessage: "비밀번호는 8~24자의 영문자와 숫자로 이루어져야 합니다.",
    });
  }
  if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
    return res
      .status(400)
      .json({ errorMessage: "이메일 또는 비밀번호가 올바르지 않습니다." });
  }

  const payload = { email: MOCK_USER.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie("token", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({ accessToken, refreshToken });
});

// POST /api/refresh
app.post("/api/refresh", (req, res) => {
  const refreshToken = req.cookies["token"];
  if (!refreshToken) {
    return res.status(401).json({ errorMessage: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const payload = { email: decoded.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    res.cookie("token", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res
      .status(401)
      .json({ errorMessage: "Invalid or expired refresh token" });
  }
});

// GET /api/user (protected)
app.get("/api/user", authMiddleware, (req, res) => {
  return res.json({ name: MOCK_USER.name, memo: MOCK_USER.memo });
});

// GET /api/dashboard (protected)
app.get("/api/dashboard", authMiddleware, (req, res) => {
  const numOfTask = tasks.length;
  const numOfDoneTask = tasks.filter((t) => t.status === "DONE").length;
  const numOfRestTask = numOfTask - numOfDoneTask;
  return res.json({ numOfTask, numOfRestTask, numOfDoneTask });
});

// GET /api/task?page=1 (protected)
app.get("/api/task", authMiddleware, (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = tasks
    .slice(start, end)
    .map(({ id, title, memo, status }) => ({ id, title, memo, status }));
  const hasNext = end < tasks.length;
  return res.json({ data, hasNext });
});

// GET /api/task/:id (protected)
app.get("/api/task/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ errorMessage: "리소스를 찾을 수 없습니다." });
  }
  return res.json({
    title: task.title,
    memo: task.memo,
    registerDatetime: task.registerDatetime,
  });
});

// DELETE /api/task/:id (protected)
app.delete("/api/task/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ errorMessage: "리소스를 찾을 수 없습니다." });
  }
  tasks.splice(index, 1);
  return res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`KB Healthcare server running on http://localhost:${PORT}`);
});
