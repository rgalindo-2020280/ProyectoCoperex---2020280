import Company from "./company.model.js"
import Category from "../category/category.model.js"

export const addCompany = async (req, res) => {
    try {
        const { name, impactLevel, yearsInBusiness, category } = req.body
        if (!name || !impactLevel || yearsInBusiness === undefined || !category) {
            return res.status(400).send({
                success: false,
                message: "All fields required"
            })
        }
        const existingCategory = await Category.findById(category)
        if (!existingCategory) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            })
        }
        const existingCompany = await Company.findOne({ name })
        if (existingCompany) {
            return res.status(400).send({
                success: false,
                message: "Company already exists"
            })
        }
        const newCompany = new Company({
            name,
            impactLevel,
            yearsInBusiness,
            category
        })
        const savedCompany = await newCompany.save()
        existingCategory.companies.push(savedCompany._id)
        await existingCategory.save()
        const populatedCompany = await Company.findById(savedCompany._id)
            .populate({
                path: 'category',
                select: 'name description -_id'
            })

        return res.status(201).send({
            success: true,
            message: "Company added successfully",
            company: populatedCompany
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error adding company",
            error: error.message
        })
    }
}
