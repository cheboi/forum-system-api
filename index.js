const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const randomIDGen = () => Math.random().toString(36).substring(2, 10);
const users = [];
const List = [];

app.get("/api", (req, res) => {
  res.json({
    message: "Testing World",
  });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  // checks if the user exists
  let result = users.filter(
    (user) => user.email === email && user.password === password
  );

  if (result.length !== 1) {
    return res.json({
      error_message: "Incorrect credentials",
    });
  }
  res.json({
    message: "Login successfully",
    id: result[0].id,
  });
});

app.post("/api/register", async (req, res) => {
  const { email, username, password } = req.body;
  const id = randomIDGen();
  const result = users.filter((user) => {
    user.email === email && user.password === password;
  });

  if (result.length === 0) {
    const newUser = { id, email, username, password };
    users.push(newUser);
    return res.json({
      message: "Account created successfully",
    });
  }
  res.json({
    error_message: "User already exists",
  });
});

app.post("/api/create/forum", async (req, res) => {
  const { title, userId } = req.body;
  console.log({ title });
  let threadId = randomIDGen();
  List.unshift({
    id: threadId,
    title: title,
    replies: [],
    likes: [],
  });

  res.json({
    message: "Thread created successfully!",
    forums: List,
  });
});

app.get("/api/all/threads", (req, res) => {
  res.json({
    forums: List,
  });
});

app.post("/api/thread/like", (req, res) => {
  const { threadId, userId } = req.body;
  const result = List.filter((thread) => thread.id === threadId);
  const threadLikes = result[0].likes;

  const authenticateReaction = threadLikes.filter((user) => user === userId);

  if (authenticateReaction.length === 0) {
    threadLikes.push(userId);
    return res.json({
      message: "You have reacted to the post!",
    });
  }
  res.json({
    err_message: "You can only react once!",
  });
});

app.post("/api/thread/replies", async (req, res) => {
  const { id } = req.body;
  const result = List.filter((thread) => thread.id === id);
  res.json({
    replies: result[0].replies,
    title: result[0].title,
  });
});

app.post("/api/create/reply", (req, res) => {
  const { id, userId, reply } = req.body;
  const result = List.filter((thread) => thread.id === id);
  const username = users.filter((user) => user.id === userId);
  result[0].replies.unshift({ name: username[0].username, text: reply });

  res.json({
    message: "Response added successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
