import Category from "../models/category.js"

export const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.status(400).send("Category already exists")
        }
        const newCategory = new Category({
            name,
            description
        })
        await newCategory.save()
        res.status(201).send("Category added successfully")
    } catch (error) {
        res.status(500).send("Error adding category")
    }
}
