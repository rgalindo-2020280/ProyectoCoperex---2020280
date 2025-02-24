import { Schema, model } from 'mongoose'

const reportSchema = new Schema(
    {
        generatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User who generated the report is required"]
        },
        companies: [{
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: [true, "At least one company must be included in the report"]
        }],
        generatedAt: {
            type: Date,
            default: Date.now
        }
    }
)

export default model("Report", reportSchema)
