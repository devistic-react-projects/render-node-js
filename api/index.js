const express = require("express");
const { body, validationResult } = require("express-validator");
const users = require("../data/student");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

// GET all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// GET single user
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  user ? res.json(user) : res.status(404).send({ message: "User not found" });
});

// POST new user
app.post(
  "/api/userspost",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newUser = {
      id: users.length + 1,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isactive: req.body.isactive,
    };
    users.push(newUser);
    res.json(newUser);
  }
);

// PUT update user
app.put(
  "/api/update/:id",
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.isactive = req.body.isactive ?? user.isactive;
    res.json(user);
  }
);

// DELETE user
app.delete("/api/delete/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  index !== -1
    ? res.json(users.splice(index, 1))
    : res.status(404).send({ message: "User not found" });
});

// Export handler for Vercel
module.exports = serverless(app);
