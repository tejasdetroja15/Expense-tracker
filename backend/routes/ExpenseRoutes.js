const express = require("express");

const {addExpense , getAllExpense, deleteExpense, downloadExpenseExcel} = require("../controllers/ExpenseController");

const {protect} = require("../middlewares/AuthMiddleware");

const router = express.Router();


router.post("/add",protect, addExpense);
router.get("/get",protect, getAllExpense);
router.delete("/:id",protect, deleteExpense);
router.get("/downloadexcel",protect, downloadExpenseExcel);

module.exports = router;
