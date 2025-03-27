import { Router } from "express";
import { PrismaClient } from "../generated/prisma";

const toDoRouter = Router();
const prisma = new PrismaClient();

toDoRouter.get('/', async (req, res) => {
    const { 
        paginate = true,
        page = 1,
        limit = 10,
        orderBy = 'id',
        order = 'asc',
    } = req.query as {
        paginate?: boolean;
        page?: number;
        limit?: number;
        orderBy?: string;
        order?: 'asc' | 'desc';
    };

    const toDoList = await prisma.toDo.findMany({
        skip: paginate ? (page - 1) * limit : undefined,
        take: paginate ? limit : undefined,
        orderBy: {
            [orderBy]: order
        }
    });

    res.json(toDoList);
});

toDoRouter.post('/', async (req, res) => {
    const { 
        name, 
        description,
        finished, 
    } = req.body as { 
        name: string, 
        description: string,
        finished: boolean 
    };

    const newToDo = await prisma.toDo.create({
        data: {
            name,
            description,
            finished
        }
    });

    res.json(newToDo);
});

toDoRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { 
        name, 
        description,
        finished, 
    } = req.body as { 
        name: string, 
        description: string,
        finished: boolean 
    };

    const updatedToDo = await prisma.toDo.update({
        where: {
            id
        },
        data: {
            name,
            description,
            finished
        }
    });

    res.json(updatedToDo);
});

toDoRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const deletedToDo = await prisma.toDo.delete({
        where: {
            id
        }
    });

    res.json(deletedToDo);
});

export default toDoRouter;