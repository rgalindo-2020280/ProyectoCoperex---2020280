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

export const updateCompany = async (req, res) => {
    try {
        const { name, impactLevel, yearsInBusiness, category } = req.body
        const { id } = req.params
        const company = await Company.findById(id)
        if (!company) {
            return res.status(404).send({
                success: false,
                message: 'Company not found'
            })
        }
        if (category) {
            const existingCategory = await Category.findById(category)

            if (!existingCategory) {
                return res.status(404).send({
                    success: false,
                    message: 'Category not found'
                })
            }
        }
        const updatedCompany = await Company.findByIdAndUpdate(
            id,
            { name, impactLevel, yearsInBusiness, category },
            { new: true }
        )
        if (category && category.toString() !== company.category.toString()) {
            await Category.findByIdAndUpdate(company.category, {
                $pull: { companies: company._id }
            })

            await Category.findByIdAndUpdate(category, {
                $push: { companies: updatedCompany._id }
            })
        }
        const populatedCompany = await Company.findById(updatedCompany._id)
            .populate({
                path: 'category',
                select: 'name description -_id'
            })
        return res.send({
            success: true,
            message: 'Company updated successfully',
            updatedCompany: populatedCompany
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            success: false,
            message: 'General error'
        })
    }
}

export const getCompaniesAZ = async (req, res) => {
    try {
        const { category, yearsInBusiness } = req.query
        const filter = {}
        if (category) {
            filter.category = category
        }
        if (yearsInBusiness) {
            filter.yearsInBusiness = { $gte: yearsInBusiness }
        }
        const companies = await Company.find(filter).populate('category', 'name description')
        const sortedCompaniesAZ = companies.sort((a, b) => {
            return a.name.localeCompare(b.name)
        })

        return res.send({
            success: true,
            companies: sortedCompaniesAZ
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: "Error retrieving companies",
            error: error.message
        })
    }
}

export const getCompaniesZA = async (req, res) => {
    try {
        const { category, yearsInBusiness } = req.query
        const filter = {}
        if (category) {
            filter.category = category
        }
        if (yearsInBusiness) {
            filter.yearsInBusiness = { $gte: yearsInBusiness }
        }
        const companies = await Company.find(filter).populate('category', 'name description')
        const sortedCompaniesZA = companies.sort((a, b) => {
            return b.name.localeCompare(a.name)
        })
        return res.send({
            success: true,
            companies: sortedCompaniesZA
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: "Error retrieving companies",
            error: error.message
        })
    }
}

export const getByYears = async (req, res) => {
    try {
        const { yearsInBusiness } = req.body
        if (!yearsInBusiness || yearsInBusiness < 1) {
            return res.status(400).send({
                success: false,
                message: "Please provide a valid number of years in business to filter"
            })
        }
        const companies = await Company.find({
            yearsInBusiness: { $gte: yearsInBusiness }
        }).populate('category', 'name description')
        for (let i = 0; i < companies.length; i++) {
            for (let j = i + 1; j < companies.length; j++) {
                if (companies[i].yearsInBusiness > companies[j].yearsInBusiness) {
                    const temp = companies[i]
                    companies[i] = companies[j]
                    companies[j] = temp
                }
            }
        }
        return res.send({
            success: true,
            companies
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: "Error retrieving companies",
            error: error.message
        })
    }
}

