const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
app.use(express.json());
const PORT = 3000;
const users = [];
app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  const userName = req.body.name;
  const userPassword = req.body.password;
  try {
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    // console.log(salt);
    // console.log(hashedPassword);
    const user = { name: userName, password: hashedPassword };
    users.push(user);
    res.status(201).send("User Created Successfully");
  } catch (e) {
    res.status(500).send(`${e}`);
  }
});

app.post("/users/login", async (req, res) => {
  const userName = req.body.name;
  const userPassword = req.body.password;
  const user = users.find((user) => user.name == userName);
  if (user == null) res.status(400).send("User Not Found");
  try {
    const tp = await bcrypt.compare(userPassword, user.password);
    // console.log(tp);
    if (tp) res.send("Success");
    else res.send("Not Allowed");
  } catch (e) {
    res.status(401).send(`Login ${e}`);
  }
});

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
