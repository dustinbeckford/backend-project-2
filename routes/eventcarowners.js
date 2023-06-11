const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Create a new car
router.post("/cars", async (req, res) => {
  const { make, model, year, type, ownerId } = req.body;
  const id = 1
  try {
    const newCar = await Car.create({
     
    });
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ error: "Failed to create car" });
  }
});

// Get all events by carowner id
router.get("/owners_events_by/:id", async (req, res) => {
  try {
    const cars = await Car.findAll({
    where: {
        id: 3
    }
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: "Failed to get cars by event" });
  }
});


module.exports = router;