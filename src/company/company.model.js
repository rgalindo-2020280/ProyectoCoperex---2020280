import { Schema, model } from 'mongoose'

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Company name is required"],
            unique: true,
            maxLength: [100, "Cannot exceed 100 characters"]
        },
        impactLevel: {
            type: String,
            required: [true, "Impact level is required"],
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        yearsInBusiness: {
            type: Number,
            required: [true, "Years in business is required"],
            min: [0, "Years cannot be negative"]
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

export default model("Company", companySchema)


