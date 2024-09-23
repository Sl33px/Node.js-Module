// @ts-ignore
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000

const bobs: ReadableStream<Uint8Array> | null = [
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

app.get('/bobs', (req: Request, res: Response) => {
    // request to db to get info
    // @ts-ignore
    res.json(bobs)
})

app.post('/bobs', (req: Request, res: Response) => {
    const bob = req.body;
    // @ts-ignore
    bobs.push(bob);

    // @ts-ignore
    res.status(201).json({message: 'Bob added successfully'});
    console.log(req.body)
})

app.put('/bobs/:id', (req: Request, res: Response) => {
    console.log(req.params)
    const { id } = req.params;
    bobs[+id] = req.body;

    // @ts-ignore
    res.status(200).json({
        message: 'Bob updated successfully',
        date: bobs[id]
    });
})

app.delete('/bobs/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    bobs.splice(+id, 1);

    // @ts-ignore
    res.status(200).json({
        message: 'Bob deleted successfully'
    });
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

