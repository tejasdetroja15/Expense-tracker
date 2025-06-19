const ExcelJS = require('exceljs');
const Income = require("../models/Income");


exports.addIncome = async (req, res) => {
    console.log("Received Data:", req.body);  
    const userId = req.user.id;

    try {
        const { icon = "default-icon", source, amount, date } = req.body;

        if (!date || !source || !amount) {
            return res.status(400).json({ msg: "Please fill in all fields" });
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        await newIncome.save();
        res.json({ msg: "Income added successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: "Server Error" });
        }
}

exports.updateIncome = async (req, res) => {
    const userId = req.user.id;
    const incomeId = req.params.id; 
    const { source, amount, date, icon } = req.body; 

    try {
        if (!source || !amount || !date) {
            return res.status(400).json({ msg: "Please fill in all fields" });
        }

        const updatedIncome = await Income.findOneAndUpdate(
            { _id: incomeId, userId: userId }, 
            { source, amount, date: new Date(date), icon: icon || null }, 
            { new: true, runValidators: true } 
        );

        if (!updatedIncome) {
            return res.status(404).json({ msg: "Income not found or unauthorized" });
        }

        res.json({ msg: "Income updated successfully", income: updatedIncome });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

exports.deleteIncome = async (req, res) => {
    const userId = req.user.id;
    try{
        await Income.findByIdAndDelete(req.params.id);
        res.json({msg: "Income deleted successfully"});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
}

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Income');

        worksheet.columns = [
            { header: 'Source', key: 'source', width: 20 },
            { header: 'Amount', key: 'amount', width: 15 },
            { header: 'Date', key: 'date', width: 15 }
        ];
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF4F81BD' }
        };

        income.forEach(item => {
            worksheet.addRow({
                source: item.source,
                amount: item.amount,
                date: item.date.toLocaleDateString()
            });
        });

        worksheet.eachRow({ includeEmpty: false }, function(row) {
            row.eachCell({ includeEmpty: false }, function(cell) {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Income_Details.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server Error" });
    }
};

