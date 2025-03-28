import { Router } from "express";
import { PrismaClient } from "../generated/prisma";

const toDoRouter = Router();
const prisma = new PrismaClient();

toDoRouter.get('/', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the to-do list." });
    }
});

toDoRouter.post('/', async (req, res) => {
    try {
        const {
            name,
            description,
            finished,
            categoryId,
        } = req.body as {
            name: string,
            description?: string,
            finished?: boolean,
            categoryId?: string
        };

        const newToDo = await prisma.toDo.create({
            data: {
                name,
                description,
                finished,
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        });

        res.json(newToDo);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the to-do item." });
    }
});

toDoRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const existingToDo = await prisma.toDo.findUnique({
            where: { id }
        });

        if (!existingToDo) {
            res.status(404).json({ error: "To-do item not found." });
            return;
        }

        const {
            name,
            description,
            finished,
            categoryId,
        } = req.body as {
            name: string,
            description?: string,
            finished?: boolean,
            categoryId?: string
        };

        const updatedToDo = await prisma.toDo.update({
            where: {
                id
            },
            data: {
                name,
                description,
                finished,
                category: {
                    connect: {
                        id: categoryId
                    }
                }
            }
        });

        res.json(updatedToDo);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the to-do item." });
    }
});

toDoRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const existingToDo = await prisma.toDo.findUnique({
            where: { id }
        });

        if (!existingToDo) {
            res.status(404).json({ error: "To-do item not found." });
            return;
        }

        const deletedToDo = await prisma.toDo.delete({
            where: {
                id
            }
        });

        res.json(deletedToDo);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the to-do item." });
    }
});

export default toDoRouter;