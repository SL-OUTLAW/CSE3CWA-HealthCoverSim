const express = require("express");
const router = express.Router();
const { cal_quote } = require("../utils/calculator");
const {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
} = require("../models/quoteModel");

const { validator } = require("../middleware/validator");

// dev test route
router.get("/test-api", (req, res) => {
  res.status(200).json({ message: "API working" });
});

// API endpoints

// POST create quote
router.post("/", validator, async (req, res) => {
  try {
    // data from frontend
    // console.log("data received", req.body);

    let quoteData = req.body;

    let calculatedQuote = cal_quote(quoteData);

    let db = req.app.locals.db;

    const result = await createQuote(db, quoteData, calculatedQuote);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create quote" });
    console.error(error);
  }
});

// GET read all quote
router.get("/", validator, async (req, res) => {
  try {
    let quoteData = req.body;

    let db = req.app.locals.db;

    const result = await getAllQuotes(db);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quotes" });
    console.error(error);
  }
});

// GET read 1 quote by ID
router.get("/:id", validator, async (req, res) => {
  try {
    // console.log("data received", req.params);

    let quoteData = req.params;

    let db = req.app.locals.db;

    let id = parseInt(quoteData.id);

    const result = await getQuoteById(db, id);

    if (!result) {
      return res.status(404).json({ error: `Quote with ID ${id} not found` });
    }

    // recalculate quote data
    const calculatedQuote = cal_quote(result);

    res.status(200).json({ ...result, ...calculatedQuote });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quotes" });
    console.error(error);
  }
});

// PUT update quote by id
router.put("/:id", validator, async (req, res) => {
  try {
    // data from frontend
    console.log("data received", req.body);

    let quoteData = req.body;

    let id = parseInt(req.params.id);

    let calculatedQuote = cal_quote(quoteData);

    let db = req.app.locals.db;

    const result = await updateQuote(db, id, quoteData, calculatedQuote);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update quote" });
    console.error(error);
  }
});

// DELETE delete quote by id
router.delete("/:id", validator, async (req, res) => {
  try {
    let id = parseInt(req.params.id);

    let db = req.app.locals.db;

    const result = await deleteQuote(db, id);

    res.status(200).json({ message: `Quote ${id} deleted successfully` });
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to delete quote" });
    console.error(error);
  }
});

module.exports = router;
