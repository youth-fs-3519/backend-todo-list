import express, { json } from 'express';
import toDoRouter from './routes/todo';
import categoryRouter from './routes/category';

const app = express();
const port = 8000;

app.use(json())

app.get('/', (req, res) => {
    res.json("hello world")
})

app.use('/todos', toDoRouter)
app.use('/categories', categoryRouter)

app.listen(port, () => {
    console.log(`App de exemplo esta rodando na porta http://localhost:${port}`)
});
