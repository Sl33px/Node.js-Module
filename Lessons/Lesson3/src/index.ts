import express, { Request, Response } from "express";

import { read, write } from "./fs.service";

const app = express();

app.use(express.json());
              app.use(express.urlencoded({ extended: true }));

app.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await read();
    res.send(users); // Не возвращаем результат res.send(), просто вызываем его
  } catch (e) {
               res.status(500).send(e instanceof Error ? e.message : "Unknown error");
  }
});

app.post("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
              if (!name || name.length < 3) {
      res
        .status(400)
        .send("Name is required and should be at least 3 characters long");
      return; // Добавляем return, чтобы завершить выполнение функции
    }
    if (!email || !email.includes("@")) {
      res.status(400).send("Email is required and should be valid");
      return;
    }
    if (!password || password.length < 6) {
      res
        .status(400)
        .send("Password is required and should be at least 6 characters long");
      return;
    }
    const users = await read();

    const id = users.length ? users[users.length - 1]?.id + 1 : 1;
    const newUser = { id, name, email, password };
    users.push(newUser);

    await write(users);
    res.status(201).send(newUser);
  } catch (e) {
    res.status(500).send(e instanceof Error ? e.message : "Unknown error");
  }
});

app.get(
  "/users/:userId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.params.userId);
      const users = await read();
      const user = users.find((user) => user.id === userId);
      if (!user) {
        res.status(404).send("User not found");
        return;
      }
      res.send(user);
    } catch (e) {
      res.status(500).send(e instanceof Error ? e.message : "Unknown error");
    }
  },
);

app.put(
  "/users/:userId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.params.userId);
      const { name, email, password } = req.body;

      if (!name || name.length < 3) {
        res
          .status(400)
          .send("Name is required and should be at least 3 characters long");
        return;
      }
      if (!email || !email.includes("@")) {
        res.status(400).send("Email is required and should be valid");
        return;
      }
      if (!password || password.length < 6) {
        res
          .status(400)
          .send(
            "Password is required and should be at least 6 characters long",
          );
        return;
      }
      const users = await read();

      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        res.status(404).send("User not found");
        return;
      }

      users[userIndex].name = name;
      users[userIndex].email = email;
      users[userIndex].password = password;

      await write(users);
      res.status(200).send(users[userIndex]);
    } catch (e) {
      res.status(500).send(e instanceof Error ? e.message : "Unknown error");
    }
  },
);

app.delete(
  "/users/:userId",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.params.userId);
      const users = await read();

      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        res.status(404).send("User not found");
        return;
      }
      users.splice(userIndex, 1);

      await write(users);
      res.sendStatus(204);
    } catch (e) {
      res.status(500).send(e instanceof Error ? e.message : "Unknown error");
    }
  },
);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
