import express, { json } from 'express';
import toDoRouter from './routes/todo';

const app = express();
const port = 8000;

app.use(json())

app.get('/', (req, res) => {
    res.json("hello world")
})

app.use('/todos', toDoRouter)

app.listen(port, () => {
    console.log(`App de exemplo esta rodando na porta http://localhost:${port}`)
});
