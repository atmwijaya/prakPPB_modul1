import express from "express";
import { MedicationController } from "../controllers/medicationController.js";
import { ReportController } from "../controllers/reportController.js";

const router = express.Router();

router.get("/", MedicationController.getAll);
router.get("/:id", MedicationController.getById);
router.post("/", MedicationController.create);
router.put("/:id", MedicationController.update);
router.delete("/:id", MedicationController.remove);
router.get("/report/total", ReportController.getTotalMedications);

export default router;