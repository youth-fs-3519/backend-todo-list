import { Router } from "express";
import { PrismaClient } from "../generated/prisma";

const postRouter = Router();
const prisma = new PrismaClient();

postRouter.get('/', async (req, res) => {
    try {
        const postList = await prisma.post.findMany({
            include: {
                _count: {
                    select: { Comment: true}
                }
            }
        });

        res.json(postList);
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: "An error occurred while fetching the to-do list." });
    }
});

postRouter.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const postList = await prisma.post.findFirst({
            where: {
                id: Number(id)
            }
        });

        res.json(postList);
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: "An error occurred while fetching the to-do list." });
    }
});

postRouter.post('/', async (req, res) => {
    try {
        const {
            title,
            body,
        } = req.body as {
            title: string,
            body: string,
        };

        const newpost = await prisma.post.create({
            data: {
                title,
                body,
            }
        });

        res.json(newpost);
    } catch (error) {
        console.error(error);
        
        res.status(500).json({ error: "An error occurred while creating the to-do item." });
    }
});

postRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const existingpost = await prisma.post.findUnique({
            where: { id: Number(id) }
        });

        if (!existingpost) {
            res.status(404).json({ error: "To-do item not found." });
            return;
        }

        const {
            title,
            body,
        } = req.body as {
            title: string,
            body: string,
        };

        const updatedpost = await prisma.post.update({
            where: {
                id: Number(id)
            },
            data: {
                title,
                body
            }
        });

        res.json(updatedpost);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the to-do item." });
    }
});

postRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const existingpost = await prisma.post.findUnique({
            where: { id: Number(id) }
        });

        if (!existingpost) {
            res.status(404).json({ error: "To-do item not found." });
            return;
        }

        const deletedpost = await prisma.post.delete({
            where: {
                id: Number(id)
            }
        });

        res.json(deletedpost);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the to-do item." });
    }
});

export default postRouter;