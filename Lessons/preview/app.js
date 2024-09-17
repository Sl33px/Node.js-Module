const express = require('express');
const {response} = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000

const bobs = [
    {
        name: 'bob1',
        age: 20,
        gender: 'male',
    },
    {
        name: 'bob2',
        age: 3,
        gender: 'male',
    },
    {
        name: 'bob3',
        age: 21,
        gender: 'male',
    },
    {
        name: 'bob4',
        age: 65,
        gender: 'male'
    }
]

app.get('/bobs', (req, res) => {
    // request to db to get info
    res.json(bobs)
})

app.post('/bobs', (req, res) => {
    const bob = req.body;
    bobs.push(bob);

    res.status(201).json({message: 'Bob added successfully'});
    console.log(req.body)
})

app.put('/bobs/:id', (req, res) => {
    console.log(req.params)
    const { id } = req.params;
    const updatedbobInfo = req.body;

    bobs[+id] = updatedbobInfo;

    res.status(200).json({
        message: 'Bob updated successfully',
        date: bobs[id]
    });
})

app.delete('/bobs/:id', (req, res) => {
    const { id } = req.params;

    bobs.splice(+id, 1);

    res.status(200).json({
        message: 'Bob deleted successfully'
    });
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

