import {Router} from 'express';
import {categorySchema} from "../../validations/category";
import {createCategory, deleteCategory, getCategories} from "./categories.repository";
import {handleCategoryUpdate} from "./categories.service.";
import {toCategoryResponse} from "./categories.mapper";

const router = Router();

/**
 * @openapi
 * /v1/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *                 example: Food
 *               color:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", async (req, res) => {
    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const userId = req.user!.userId;

    const category = await createCategory({...result.data, userId})

    return res.status(201).json(toCategoryResponse(category[0]));
})

/**
 * @openapi
 * /v1/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get("/", async (req, res) => {
    const userId = req.user!.userId;

    const userCategories = await getCategories(userId);

    return res.json(userCategories.map(toCategoryResponse))
})

/**
 * @openapi
 * /v1/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 */
router.put("/:id", async (req, res) => {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const result = categorySchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const updatedCategory = await handleCategoryUpdate({...result.data, id, userId})

    return res.json(toCategoryResponse(updatedCategory));
})

/**
 * @openapi
 * /v1/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete a category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
router.delete("/:id", async (req, res) => {
    const id = req.params.id as string;
    const userId = req.user!.userId;

    const deleted = await deleteCategory(id, userId);

    if (!deleted) {
        return res.status(404).json({message: "Category not found"});
    }

    return res.status(204).send();
})

export default router;