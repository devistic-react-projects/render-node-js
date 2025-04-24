const express = require("express");
const { body, validationResult } = require("express-validator");
const app = express();
const port = process.env.PORT || 3000;
const users = require("./data/student");

// middleware to parse JSON data
app.use(express.json());

// get request for all users
app.get("/users", (req, res) => {
  res.json(users);
});

// get request for one user
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  user ? res.json(user) : res.status(404).send({ message: "User not found" });
});

// post data with validation
app.post(
  "/userspost",
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

//Update request with validation
app.put(
  "/update/:id",
  [
    body("name").optional().notEmpty().withMessage("name cannot be empty"),
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
    user.isactive = req.body.isactive || user.isactive;
    res.json(user);
  }
);

// delete request
app.delete("/delete/:id", (req, res) => {
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  index !== -1
    ? res.json(users.splice(index, 1))
    : res.status(404).send({ message: "User not found" });
});

// start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
