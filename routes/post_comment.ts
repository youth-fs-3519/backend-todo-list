import { Router } from "express";
import { PrismaClient } from "../generated/prisma";

const postCommentsRouter = Router();
const prisma = new PrismaClient();

postCommentsRouter.get('/:id/comments', async (req, res) => {
    const { id } = req.params;

    try {
        const postList = await prisma.comment.findMany({
            where: {
                postId: Number(id)
            }
        });

        res.json(postList);
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: "An error occurred while fetching the comment list." });
    }
});

postCommentsRouter.post('/:id/comments', async (req, res) => {
    const { id } = req.params;

    try {
        const {
            title,
            body,
            email,
        } = req.body as {
            title: string,
            body: string,
            email: string,
        };

        const newpost = await prisma.comment.create({
            data: {
                title,
                body,
                email,
                postId: Number(id)
            }
        });

        res.json(newpost);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the comment item." });
    }
});

postCommentsRouter.put('/:id/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    try {
        const existingpost = await prisma.comment.findUnique({
            where: { id: Number(commentId) }
        });

        if (!existingpost) {
            res.status(404).json({ error: "comment item not found." });
            return;
        }

        const {
            title,
            body,
        } = req.body as {
            title: string,
            body: string,
        };

        const updatedpost = await prisma.comment.update({
            where: {
                id: Number(commentId)
            },
            data: {
                title,
                body
            }
        });

        res.json(updatedpost);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the comment item." });
    }
});

postCommentsRouter.delete('/:id/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    try {
        const existingpost = await prisma.comment.findUnique({
            where: { id: Number(commentId) }
        });

        if (!existingpost) {
            res.status(404).json({ error: "comment item not found." });
            return;
        }

        const deletedpost = await prisma.comment.delete({
            where: {
                id: Number(commentId)
            }
        });

        res.json(deletedpost);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the comment item." });
    }
});

export default postCommentsRouter;