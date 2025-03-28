import { Router } from "express";
import { PrismaClient } from "../generated/prisma";

const categoryRouter = Router();
const prisma = new PrismaClient();

categoryRouter.get('/', async (req, res) => {
    try {
        const {
            paginate = true,
            page = "1",
            limit = "10",
            orderBy = 'createdAt',
            order = 'asc',
        } = req.query as {
            paginate?: boolean;
            page?: string;
            limit?: string;
            orderBy?: string;
            order?: 'asc' | 'desc';
        };

        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);

        if (isNaN(pageInt) || isNaN(limitInt) || 0 >= pageInt || 0 >= limitInt) {
            res.status(400).json({ error: "Invalid page or limit." });
            return;
        }

        if (order !== 'asc' && order !== 'desc') {
            res.status(400).json({ error: "Order must be 'asc' or 'desc'" });
            return;
        }

        const categoryList = await prisma.category.findMany({
            skip: paginate ? (pageInt - 1) * limitInt : undefined,
            take: paginate ? limitInt : undefined,
            orderBy: {
                [orderBy]: order
            }
        });

        res.json(categoryList);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the categories" });
    }
});

categoryRouter.post('/', async (req, res) => {
    try {
        const { name } = req.body as { name: string };

        if (!name) {
            res.status(400).json({ error: "Name is required" });
            return;
        }

        const newcategory = await prisma.category.create({
            data: { name },
        });

        res.json(newcategory);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the category" });
    }
});

categoryRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body as { name: string };

        if (!name) {
            res.status(400).json({ error: "Name is required" });
            return;
        }

        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        const updatedcategory = await prisma.category.update({
            where: { id },
            data: { name },
        });

        res.json(updatedcategory);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while updating the category" });
    }
});

categoryRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        const deletedcategory = await prisma.category.delete({
            where: {
                id
            }
        });

        res.json(deletedcategory);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the category" });
    }
});

export default categoryRouter;