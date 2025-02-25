import Company from "../models/company.js"
import Category from "../models/category.js"

export const addCompany = async (req, res) => {
    try {
        const { name, impactLevel, yearsInBusiness, category } = req.body
        const existingCategory = await Category.findById(category)
        if (!existingCategory) {
            return res.status(404).send("Category not found")
        }
        const existingCompany = await Company.findOne({ name })
        if (existingCompany) {
            return res.status(400).send("Company already exists")
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

        res.status(201).send("Company added successfully")
    } catch (error) {
        res.status(500).send("Error adding company")
    }
}
