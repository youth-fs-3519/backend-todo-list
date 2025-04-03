import express, { json } from 'express';
import cors from 'cors';
import toDoRouter from './routes/todo';
import categoryRouter from './routes/category';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import postRouter from './routes/post';
import postCommentsRouter from './routes/post_comment';

const app = express();
const port = 8000;

app.use(json())
app.use(cors())

app.get('/', (req, res) => {
    res.json("hello world")
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/todos', toDoRouter)
app.use('/categories', categoryRouter)
app.use('/posts', postRouter)
app.use('/posts', postCommentsRouter)

app.listen(port, () => {
    console.log(`App de exemplo esta rodando na porta http://localhost:${port}`)
});
