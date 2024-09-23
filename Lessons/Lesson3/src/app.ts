import fs from "node:fs";

import express, { Request, Response } from "express";
import fsPromises from "fs/promises";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

const main = async () => {
  const pathToDB = path.join(__dirname, "db.json");
  const dbContent = await fsPromises.readFile(pathToDB, "utf-8");
  const users = JSON.parse(dbContent);

  // update db.json file function
  function updateDB(updatedUsers) {
    fs.writeFile(pathToDB, JSON.stringify(updatedUsers), () =>
      console.log("DB.json updated"),
    );
  }

  // validation function
  function validateUserData({ name, email, password }) {
    if (name.length < 3 || name.length > 20) {
      return "Name length cannot be less than 3 characters and cannot be greater than 20";
    } else if (email.length < 8 || email.length > 30) {
      return "Email cannot be less than 8 characters and cannot be greater than 30 characters";
    } else if (password.length < 8 || password.length > 30) {
      return "Password cannot be less than 8 characters and cannot be greater than 30 characters";
    }
    return null;
  }

  try {
    app.get("/users", async (req: Request, res: Response) => {
      try {
        res.send(users);
      } catch (e) {
        res.status(500).send(e.message);
      }
    });

    app.get("/users/:userId", (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        const user = users[+userId - 1];
        res.send(user);
      } catch (e) {
        res.status(500).send(e.message);
      }
    });

    // app.post
    app.post("/users", async (req: Request, res: Response) => {
      try {
        const { name, email, password } = req.body;

        // validation user data
        const validationError = validateUserData({ name, email, password });
        if (validationError) {
          return res.status(400).send(validationError);
        }

        const id = users[users.length - 1].id + 1;
        const newUser = { id, name, email, password };
        users.push(newUser);

        // function to update db.json
        updateDB(users);

        res.status(201).send(newUser);
      } catch (e) {
        res.status(500).send(e.message);
      }
    });

    // app.put
    app.put("/users/:userId", (req: Request, res: Response) => {
      try {
        const userId = Number(req.params.userId);
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) {
          return res.status(404).send("User not found");
        }

        const { name, email, password } = req.body;

        // validation user data
        const validationError = validateUserData({ name, email, password });
        if (validationError) {
          return res.status(400).send(validationError);
        }

        users[userIndex].name = name;
        users[userIndex].email = email;
        users[userIndex].password = password;

        updateDB(users);

        res.status(201).send(users[userIndex]);
      } catch (e) {
        res.status(500).send(e.message);
      }
    });

    // app.delete
    app.delete("/users/:userId", (req: Request, res: Response) => {
      try {
        const userId = Number(req.params.userId);
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) {
          return res.status(404).send("User not found");
        }
        users.splice(userIndex, 1);
        res.sendStatus(204);
        updateDB(users);
      } catch (e) {
        res.status(500).send(e.message);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

void main();
app.listen(PORT);
