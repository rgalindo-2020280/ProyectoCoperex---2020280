import XLSXPopulate from 'xlsx-populate'
import Company from '../company/company.model.js'
import path from 'path'
import fs from 'fs'

export const generateReport = async (req, res) => {
    try {
        const workbook = await XLSXPopulate.fromBlankAsync()
        const companies = await Company.find().populate('category', 'name')
        const sheet = workbook.sheet(0)

        sheet.cell('A1').value('Company ID')
        sheet.cell('B1').value('Company Name')
        sheet.cell('C1').value('Impact Level')
        sheet.cell('D1').value('Years in Business')
        sheet.cell('E1').value('Category')

        for (let i = 0; i < companies.length; i++) {
            const company = companies[i]
            workbook.sheet(0).cell(`A${i + 2}`).value(company.id)
            workbook.sheet(0).cell(`B${i + 2}`).value(company.name)
            workbook.sheet(0).cell(`C${i + 2}`).value(company.impactLevel)
            workbook.sheet(0).cell(`D${i + 2}`).value(company.yearsInBusiness)
            workbook.sheet(0).cell(`E${i + 2}`).value(company.category ? company.category.name : 'N/A')
        }

        const reportFolderPath = path.join(process.cwd(), 'src', 'report', 'Reporte')
        if (!fs.existsSync(reportFolderPath)) {
            fs.mkdirSync(reportFolderPath, { recursive: true })
        }

        const fileName = 'ReportCompany.xlsx'
        const filePath = path.join(reportFolderPath, fileName)

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

        await workbook.toFileAsync(filePath)

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error("Error sending file:", err)
                res.status(500).send({
                    success: false,
                    message: "Error sending the report file"
                })
            }
        })

    } catch (error) {
        console.error(error)
        return res.status(500).send({
            success: false,
            message: "Error generating report",
            error: error.message
        })
    }
}