const express = require("express");

const {addIncome , getAllIncome, deleteIncome, downloadIncomeExcel, updateIncome} = require("../controllers/IncomeController");

const {protect} = require("../middlewares/AuthMiddleware");

const router = express.Router();


router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.put("/:id", protect, updateIncome);
router.delete("/:id", protect, deleteIncome);
router.get("/downloadexcel", protect, downloadIncomeExcel);

module.exports = router;
