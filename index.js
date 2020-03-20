const express = require("express");
const db = require("./data/db");
// const shortid = require("shortid"); It didn't work, I assume because ID only accepts integer, shortid generates string too
const server = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT;

server.listen(PORT, () => console.log(`listening on port ${PORT}...`));

server.use(express.json());
server.use(cors());

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    const newUser = { id: Date.now(), name, bio };
    db.insert(newUser)
      .then(addedUser => {
        res.status(201).json({ newUser });
      })
      .catch(err => {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the user to the database."
        });
      });
  }
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(user => {
      !user
        ? res
            .status(404)
            .json({ message: "The user with the specified ID does not exist." })
        : res.status(200).json(user);
    })
    .catch(err =>
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." })
    );
});

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
      deleted
        ? res.status(204).end()
        : res.status(404).json({
            errorMessage: "The user with the specified ID does not exist."
          });
    })
    .catch(err =>
      res.status(500).json({ errorMessage: "The user could not be removed" })
    );
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = req.body;
  if (!user.name || !user.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.update(id, user)
      .then(updated => {
        !updated
          ? res.status(404).json({
              message: "The user with the specified ID does not exist."
            })
          : res.status(200).json({ updatedUser: user });
      })
      .catch(err =>
        res
          .status(500)
          .json({ errorMessage: "The user information could not be modified." })
      );
  }
});
