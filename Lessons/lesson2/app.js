const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = [
    {id: 1, name: 'Maksym', email: 'mak4@gmail.com', password: 'qwe123'},
    {id: 2, name: 'Alina', email: 'al3@gmail.com', password: 'rew123'},
    {id: 3, name: 'Anna', email: 'an6@gmail.com', password: '463erqq'},
    {id: 4, name: 'Tomara', email: 'tom7@gmail.com', password: 'wwer434'},
    {id: 5, name: 'Dima', email: 'd8@gmail.com', password: 'sfsdgd134'},
    {id: 6, name: 'Rita', email: 'r0@gmail.com', password: 'gfh4243'},
    {id: 7, name: 'Denis', email: 'den5@gmail.com', password: '5ygy5'},
    {id: 8, name: 'Sergey', email: 'ser4@gmail.com', password: 'gfgf434'},
    {id: 9, name: 'Angelina', email: 'anf4@gmail.com', password: 'tkuk656'},
    {id: 10, name: 'Irina', email: 'irka2@gmail.com', password: '5yg5'},
]

const PORT = 3000

app.get('/users', (req, res) => {
    try {
        res.send(users)
    } catch (err) {
        res.status(500).json({message: 'Error getting users'})
    }
})

app.post('/users', (req, res) => {
    try {
        const { name, email, password } = req.body;
        const id = users[users.length - 1].id + 1;
        const newUser = {id, name, email, password};
        users.push(newUser);
        res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send(e.message);
    }
})

app.get('/users/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const user = users[+userId - 1]
        // const user = users.find(user => user.id === +userId)
        res.send(user)
        console.log('user id: ', userId)
        console.log('user: ', user)
    } catch (e) {
        res.status(500).send(e.message);
    }
})

app.put('/users/:userId', (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }
        const {name, email, password} = req.body;
        // TODO validate data
        // users[userIndex] = {...users[userIndex], name, email, password};
        users[userIndex].name = name;
        users[userIndex].email = email;
        users[userIndex].password = password;
        res.status(201).send(users[userIndex]);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.delete('/users/:userId', (req, res) => {
    try {
        const userId  = Number(req.params.userId);
        const userIndex = users.findIndex(user => user.id === userId)
        if (userIndex === -1) {
            return res.status(404).send('User not found')
        }
        users.splice(userIndex, 1);
        res.sendStatus(204)
    } catch (e) {
        res.status(500).send(e.message);
    }
})

app.listen(PORT)