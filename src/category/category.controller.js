import Category from "./category.model.js"
import Company from "../company/company.model.js"

export const addCategory = async (req, res) => {
    try {
        const { name, description, companyIds } = req.body
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Category name is required"
            })
        }
        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.status(400).send({
                success: false,
                message: "Category already exists"
            })
        }
        const newCategory = new Category({
            name,
            description: description || "",
            companies: []
        })
        await newCategory.save()
        if (companyIds && companyIds.length > 0) {
            await Company.updateMany(
                { _id: { $in: companyIds } },
                { category: newCategory._id }
            )
            newCategory.companies = companyIds
            await newCategory.save()
        }
        const populatedCategory = await Category.findById(newCategory._id)
            .populate({
                path: 'companies',
                select: 'name impactLevel yearsInBusiness -_id'
            })
        return res.status(201).send({
            success: true,
            message: "Category added successfully",
            category: populatedCategory
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error adding category",
            error: error.message
        })
    }
}


export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate({
            path: 'companies',
            select: 'name impactLevel yearsInBusiness -_id'
        })
        if (!categories || categories.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No categories found"
            })
        }
        return res.status(200).send({
            success: true,
            categories
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: "Error fetching categories",
            error: error.message
        })
    }
}
