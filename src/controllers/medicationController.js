import { MedicationModel } from "../models/medicationModels.js";

export const MedicationController = {
  async getAll(req, res) {
    try {
      const { name, page = 1, limit = 10 } = req.query;
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      
      if (pageNum <= 0 || limitNum <= 0) {
        return res.status(400).json({ error: "Page and limit must be positive integers." });
      }
      const result = await MedicationModel.getAllWithPagination(name, pageNum, limitNum);
      const totalPages = result.totalCount > 0 ? Math.ceil(result.totalCount / limitNum) : 0;

      res.json({
        data: result.medications,
        pagination: {
          currentPage: pageNum,
          totalPages: totalPages,
          totalItems: result.totalCount,
          itemsPerPage: limitNum
        }
      });
    } catch (err) {
      console.error("GetAll Error:", err);
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const med = await MedicationModel.getById(req.params.id);

      res.json(med);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  },

  async create(req, res) {
    try {
      const { quantity, price } = req.body;
      if (quantity !== undefined && quantity < 0) {
        return res.status(400).json({ error: "Kuantitas tidak boleh negatif." });
      };

      if (price !== undefined && price < 0) {
        return res.status(400).json({ error: "Harga tidak boleh negatif." });
      };

      const med = await MedicationModel.create(req.body);
      res.status(201).json(med);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const { quantity, price } = req.body;
      if (quantity !== undefined && quantity < 0) {
        return res.status(400).json({ error: "Quantity cannot be negative." });
      };

      if (price !== undefined && price < 0) {
        return res.status(400).json({ error: "Price cannot be negative." });
      };

      const med = await MedicationModel.update(req.params.id, req.body);
      res.json(med);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async remove(req, res) {
    try {
      await MedicationModel.remove(req.params.id);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

