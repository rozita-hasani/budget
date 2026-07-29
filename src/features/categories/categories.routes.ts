import {Router} from 'express';
import {categorySchema} from "../../validations/category";
import {createCategory, deleteCategory, getCategories} from "./categories.repository";
import {handleCategoryUpdate} from "./categories.service.";

const router = Router();

router.post("/", async (req, res) => {
    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const userId = req.user!.userId;

    const category = await createCategory({...result.data, userId})

    return res.status(201).json(category[0]);
})

router.get("/", async (req, res) => {
    const userId = req.user!.userId;

    const userCategories = await getCategories(userId);

    return res.json(userCategories)
})

router.put("/:id", async (req, res) => {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const updatedCategory = await handleCategoryUpdate({...result.data, id, userId})

    return res.json(updatedCategory);
})

router.delete("/:id", async (req, res) => {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const deleted = await deleteCategory(id, userId);

    if (deleted.length === 0) {
        return res.status(404).json({message: "Category not found"});
    }

    return res.status(204).send();
})

export default router;